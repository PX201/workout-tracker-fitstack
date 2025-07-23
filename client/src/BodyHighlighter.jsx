import React, { useEffect, useState } from "react";
import Model from 'react-body-highlighter';
import UserNavbar from "./UserNavbar";

function BodyHighlighter() {
  const [body, setBody] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);
  const muscleUrl = "http://localhost:8080/api/muscles";
  const url = "http://localhost:8080/api/user";

  useEffect(() => {
    // TODO: replace with fetch() call
    setBody([
      { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
      { name: 'Push Ups', muscles: ['chest'] },
    ]);
    const init = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    }
    // HTTP request to get muscles
    fetch(muscleUrl, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        if (data) {
          setMuscles(data);
        }
      }).catch(console.log);

    // HTTP request to get logs
    fetch(`${url}/log/me`, init)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        if (data) {
          setLogs(data);
        }
      }).catch(console.log);

    // HTTP request to get routines
    fetch(`${url}/me/routine`, init)
      .then(response => {
        if (response.status === 200 || response.status === 403) {
          return response.json();
        } else {
          return Promise.reject(`Unexpected Status Code: ${response.status}`);
        }
      }).then(data => {
        setRoutines(data);
      }).catch(console.log);


  }, []);

  // map log and routine data to body heatmap
  useEffect(() => {
    const newBody = [];

    // if we haven't loaded muscles and routines yet, return
    if (muscles.length === 0 || routines.length === 0) {
      return;
    }

    /*
    body structure: [ { name: <routine title>, muscles: [<muscle groups>] }, ...]
    */
    logs.forEach(l => {
      const r = routines.find(r => r.routineId === l.routineId);
      newBody.push({ 
        name: r.title, 
        muscles: r.muscles.map(m => {
          return m.toLowerCase().replace('_', '-'); // change strings like UPPER_BACK to upper-back
        })
      });
    });
    setBody(newBody);
  }, [muscles, routines, logs]);

  // TODO: replace click with hover?
  const handleClick = React.useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;
    alert(`You've worked out your ${muscle} ${frequency} times through the following routines: ${exercises.slice(0,-1).map(e => { return `${e},`; })} ${exercises.slice(-1)}`);
  }, [body]);

  return (
    <>
      <UserNavbar />
      <section className="container mt-5">
        <h2 className="text-center">Muscle Groups Worked On</h2>
        <div className="row">
          <div className="col-2"></div>
          <Model className="col-4"
            data={body}
            style={{ margin: "auto", width: '25rem', padding: '5rem' }}
            onClick={handleClick}
          />
          <Model className="col-4"
            data={body}
            style={{ margin: "auto", width: '25rem', padding: '5rem' }}
            onClick={handleClick}
            type="posterior"
          />
          <div className="col-2"></div>
        </div>
      </section>
    </>
  );
}

export default BodyHighlighter;
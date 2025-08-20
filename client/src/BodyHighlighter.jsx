import React, { useEffect, useState } from "react";
import Model from 'react-body-highlighter';
import { BASE_API_URL } from "./components/UserInfo";

function BodyHighlighter() {
  const [body, setBody] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const init = {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    }
    // HTTP request to get muscles
    fetch(`${BASE_API_URL}/muscles`, init)
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
    fetch(`${BASE_API_URL}/user/log/me`, init)
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
    fetch(`${BASE_API_URL}/user/me/routine`, init)
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

      // filter logs that are more than one month old
      let today = new Date();
      today.setMonth(today.getMonth() - 1);
      if (today > Date.parse(l.date)) {
        return;
      }

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
    alert(`You've worked out your ${muscle} ${frequency} times through the following routines: ${exercises.slice(0, -1).map(e => { return `${e},`; })} ${exercises.slice(-1)}`);
  }, [body]);

  return (
    <>
      <section className="container mt-5">
        <h2 className="text-center">Muscle Groups Worked On</h2>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-4 bg-white bg-opacity-25 rounded m-4">
            <Model
              data={body}
              style={{ margin: "auto", width: '40rem', padding: '8rem' }}
              onClick={handleClick}
              highlightedColors={[
                "#FFF9C4", // 1 - very faint yellow
                "#FFF176", // 2 - soft yellow
                "#FFD54F", // 3 - yellow-orange
                "#FFB74D", // 4 - light orange
                "#FF8A65", // 5 - orange/red mix
                "#EF5350", // 6 - light red
                "#E53935", // 7 - strong red
                "#C62828", // 8 - darker red
                "#B71C1C", // 9 - deep red
                "#7F0000", // 10 - very dark red
              ]} />
          </div>
          <div className="col-4 bg-white bg-opacity-25 rounded m-4">
            <Model
              data={body}
              style={{ margin: "auto", width: '40rem', padding: '8rem' }}
              onClick={handleClick}
              highlightedColors={[
                "#FFF9C4", // 1 - very faint yellow
                "#FFF176", // 2 - soft yellow
                "#FFD54F", // 3 - yellow-orange
                "#FFB74D", // 4 - light orange
                "#FF8A65", // 5 - orange/red mix
                "#EF5350", // 6 - light red
                "#E53935", // 7 - strong red
                "#C62828", // 8 - darker red
                "#B71C1C", // 9 - deep red
                "#7F0000", // 10 - very dark red
              ]}
              type="posterior"
            />
          </div>
          <div className="col-2"></div>
        </div>
        <p className="p2 bg-white text-dark px-2 py-1 d-inline-block rounded shadow-sm"> <strong>NOTE:</strong> Body diagram reflects activity over the past month</p>
      </section>
    </>
  );
}

export default BodyHighlighter;
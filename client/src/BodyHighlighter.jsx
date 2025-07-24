import React, { useEffect, useState } from "react";
import Model from 'react-body-highlighter';

function BodyHighlighter() {
  const [body, setBody] = useState([]);

  // TEST DATA
  useEffect(() => {
    // TODO: replace with fetch() call
    setBody([
      { name: 'Bench Press', muscles: ['chest', 'triceps', 'front-deltoids'] },
      { name: 'Push Ups', muscles: ['chest'] },
    ]);
    console.log(body);
  }, []);

  // TODO: replace click with hover
  const handleClick = React.useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;
    alert(`You clicked the ${muscle}! You've worked out this muscle ${frequency} times through the following exercises: ${JSON.stringify(exercises)}`)
  }, [body]);

  return (
    <>
      <section className="container mt-5">
        <h2 className="text-center">Muscle Groups Worked On</h2>
        <div className="row">
          <div className="col-2"></div>
          <Model className="col-4"
            data={body}
            style={{margin: "auto", width: '25rem', padding: '5rem' }}
            onClick={handleClick}
          />
          <Model className="col-4"
            data={body}
            style={{margin: "auto", width: '25rem', padding: '5rem' }}
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
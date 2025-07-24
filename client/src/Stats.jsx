import { useState, useEffect } from "react";

function Stats(){
    const [logStats, setLogStats] = useState([]);
    const [error, setError] = useState("");
    const url = "http://localhost:8080/api/user";

    useEffect(() => {
    const init = { 
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("me")}`
      }
    };
    fetch(`${url}/log/me`, init)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }else {
          return Promise.reject(`Error fetching logs: ${response.status}`);
        }
    }).then(data => {
        const grouped = groupLogsByRoutineTitle(data);
        setLogStats(grouped);
    }).catch(err => {
        console.error(err);
        setError(["Failed to load stats."]);
      });
  }, []);

  return (
    <div className="container my-4">
  <h2 className="mb-4">Routine Stats</h2>
  {error && <div className="alert alert-danger">{error}</div>}

  <div className="row">
    {logStats.map((stat) => (
      <div key={stat.routineTitle} className="col-12 col-md-6 col-lg-4 mb-3">
        <div className="card h-100 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{stat.routineTitle}</h5>
            <p className="card-text mb-1"><strong>Avg Intensity:</strong> {stat.avgIntensity.toFixed(1)}</p>
            <p className="card-text mb-1"><strong>Avg Duration:</strong> {stat.avgDuration.toFixed(1)} min</p>
            <p className="card-text mb-0"><strong>Total Logs:</strong> {stat.count}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
}

function groupLogsByRoutineTitle(logs) {
  const map = {};

  for (let log of logs) {
    const title = log.routineTitle;
    if (!map[title]) {
      map[title] = { routineTitle: title, totalDuration: 0, totalIntensity: 0, count: 0 };
    }
    map[title].totalDuration += log.duration;
    map[title].totalIntensity += log.intensity;
    map[title].count += 1;
  }

  return Object.values(map).map((r) => ({
    routineTitle: r.routineTitle,
    avgDuration: r.totalDuration / r.count,
    avgIntensity: r.totalIntensity / r.count,
    count: r.count,
  }));
}

export default Stats;
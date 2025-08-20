import { useState, useEffect, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  Title, Tooltip, Legend, PointElement
} from "chart.js";
import { BASE_API_URL } from "./components/UserInfo";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  Title, Tooltip, Legend, PointElement
);

function Stats(){
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("count"); // count | avgDuration | avgIntensity


  useEffect(() => {
    const init = {
      method: "GET",
      headers: { "Authorization": `Bearer ${sessionStorage.getItem("me")}` }
    };
    fetch(`${BASE_API_URL}/user/log/me`, init)
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(setLogs)
      .catch(err => { console.error(err); setError("Failed to load stats."); });
  }, []);

  const perRoutine = useMemo(() => groupLogsByRoutineTitle(logs), [logs]);

  //  Top 10 bar 
  const top10 = useMemo(() => (
    [...perRoutine].sort((a,b)=>b.count-a.count).slice(0,10)
  ), [perRoutine]);

  const barData = useMemo(() => ({
    labels: top10.map(x => x.routineTitle),
    datasets: [{
      label: "Total Logs",
      data: top10.map(x => x.count),
      backgroundColor: "rgba(13, 110, 253, 0.6)"
    }]
  }), [top10]);

  //  Weekly volume (minutes per week) 
  const weekly = useMemo(() => groupByIsoWeek(logs), [logs]);
  const lineData = useMemo(() => ({
    labels: weekly.map(w => w.weekLabel),
    datasets: [{
      label: "Minutes / week",
      data: weekly.map(w => w.totalMinutes),
      borderColor: "rgba(25, 135, 84, 1)",
      fill: false
    }]
  }), [weekly]);

  //  Cards: search + sort 
  const filteredSorted = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = perRoutine.filter(r => r.routineTitle.toLowerCase().includes(needle));
    arr.sort((a,b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0));
    return arr;
  }, [perRoutine, q, sortBy]);

  return (
    <div className="container my-4">
      <h2 className="mb-3">Routine Stats</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm p-3">
            <h5 className="mb-3">Top 10 Routines by Logs</h5>
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card h-100 shadow-sm p-3">
            <h5 className="mb-3">Weekly Volume</h5>
            <Line data={lineData} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="d-flex gap-2 align-items-center mb-2">
        <input
          className="form-control"
          placeholder="Search routines…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{maxWidth: 320}}
        />
        <select className="form-select w-auto" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="count">Sort by: Logs</option>
          <option value="avgDuration">Sort by: Avg Duration</option>
          <option value="avgIntensity">Sort by: Avg Intensity</option>
        </select>
      </div>

      {/* All routine cards */}
      <div className="row">
        {filteredSorted.map((stat) => (
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
        {!filteredSorted.length && <div className="text-muted">No routines match.</div>}
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
    map[title].totalDuration += Number(log.duration) || 0;
    map[title].totalIntensity += Number(log.intensity) || 0;
    map[title].count += 1;
  }
  return Object.values(map).map((r) => ({
    routineTitle: r.routineTitle,
    avgDuration: r.count ? r.totalDuration / r.count : 0,
    avgIntensity: r.count ? r.totalIntensity / r.count : 0,
    count: r.count,
  }));
}

// Group by ISO week (Mon-Sun); returns [{weekLabel, totalMinutes}]
function groupByIsoWeek(logs) {
  const bucket = new Map();
  for (const log of logs) {
    const keyDate = new Date(log.date + "T00:00:00");
    const monday = startOfIsoWeek(keyDate);
    const key = monday.toISOString().slice(0,10);
    const minutes = Number(log.duration) || 0;
    bucket.set(key, (bucket.get(key) || 0) + minutes);
  }
  const arr = [...bucket.entries()]
    .sort((a,b) => a[0].localeCompare(b[0]))
    .map(([weekStart, totalMinutes]) => ({
      weekLabel: weekStart, totalMinutes
    }));
  return arr;
}

function startOfIsoWeek(d) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon
  date.setDate(date.getDate() - day);
  return date;
}

export default Stats;
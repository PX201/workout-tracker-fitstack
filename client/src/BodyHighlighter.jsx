import React, { useEffect, useState, useMemo, useCallback } from "react";
import Model from "react-body-highlighter";
import { BASE_API_URL } from "./components/UserInfo";

function BodyHighlighter() {
  const [muscles, setMuscles] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const init = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("me")}`,
      },
    };

    fetch(`${BASE_API_URL}/muscles`, init)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => data && setMuscles(data))
      .catch(console.log);

    fetch(`${BASE_API_URL}/user/log/me`, init)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => data && setLogs(data))
      .catch(console.log);

    fetch(`${BASE_API_URL}/user/me/routine`, init)
      .then((r) => (r.status === 200 || r.status === 403 ? r.json() : Promise.reject(r.status)))
      .then((data) => setRoutines(data || []))
      .catch(console.log);
  }, []);

  // Build body heatmap data from logs/routines (last 1 month)
  const body = useMemo(() => {
    if (!muscles.length || !routines.length) return [];
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const data = [];
    for (const l of logs) {
      if (Date.parse(l.date) < +oneMonthAgo) continue;
      const r = routines.find((rr) => rr.routineId === l.routineId);
      if (!r) continue;
      data.push({
        name: r.title,
        muscles: r.muscles.map((m) => m.toLowerCase().replace("_", "-")),
      });
    }
    return data;
  }, [muscles, routines, logs]);

  const handleClick = useCallback(({ muscle, data }) => {
    const { exercises, frequency } = data;
    alert(
      `You've worked out your ${muscle} ${frequency} times via: ${
        exercises.length ? exercises.join(", ") : "—"
      }`
    );
  }, []);

  return (
    <section className="container-fluid py-4">
      <h2 className="text-center mb-3">Muscle Groups Worked On</h2>

      {/* two panels: stack on mobile, side-by-side on lg+ */}
      <div className="row g-3 justify-content-center">
        <div className="col-12 col-md-10 col-lg-5">
          <div className="heatmap-card">
            <div className="heatmap-canvas">
              <Model
                data={body}
                onClick={handleClick}
                // let CSS control sizing; no fixed width/padding here
                style={{ width: "100%", height: "100%" }}
                highlightedColors={[
                  "#FFF9C4",
                  "#FFF176",
                  "#FFD54F",
                  "#FFB74D",
                  "#FF8A65",
                  "#EF5350",
                  "#E53935",
                  "#C62828",
                  "#B71C1C",
                  "#7F0000",
                ]}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-10 col-lg-5">
          <div className="heatmap-card">
            <div className="heatmap-canvas">
              <Model
                data={body}
                type="posterior"
                onClick={handleClick}
                style={{ width: "100%", height: "100%" }}
                highlightedColors={[
                  "#FFF9C4",
                  "#FFF176",
                  "#FFD54F",
                  "#FFB74D",
                  "#FF8A65",
                  "#EF5350",
                  "#E53935",
                  "#C62828",
                  "#B71C1C",
                  "#7F0000",
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="bg-white text-dark px-2 py-1 d-inline-block rounded shadow-sm mt-3">
        <strong>NOTE:</strong> Body diagram reflects activity over the past month
      </p>
    </section>
  );
}

export default BodyHighlighter;
import { useEffect, useMemo, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import Stats from './Stats';
import { BASE_API_URL } from './components/UserInfo';

function Calendar() {
  const [logs, setLogs] = useState([]);
  const [rangeMonths, setRangeMonths] = useState(12); // 3 / 6 / 12
  const url = `${BASE_API_URL}/user`;

  useEffect(() => {
    const init = {
      method: "GET",
      headers: { "Authorization": `Bearer ${sessionStorage.getItem("me")}` }
    };
    fetch(`${url}/log/me`, init)
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  // ---- Derived data ----
  const {
    countsByDate, minutesByDate, totalLogs, activeRoutines, avgDuration, streakDays
  } = useMemo(() => {
    const byDate = {};
    const minsByDate = {};
    const routines = new Set();
    let totalMin = 0;

    for (const log of logs) {
      const d = log.date; // YYYY-MM-DD from backend
      byDate[d] = (byDate[d] || 0) + 1;
      minsByDate[d] = (minsByDate[d] || 0) + (Number(log.duration) || 0);
      routines.add(log.routineTitle);
      totalMin += Number(log.duration) || 0;
    }

    // streak up to today
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 9999; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const key = dt.toISOString().slice(0, 10);
      if (!byDate[key]) break;
      streak++;
    }

    const total = logs.length;
    const avg = total ? totalMin / total : 0;

    return {
      countsByDate: byDate,
      minutesByDate: minsByDate,
      totalLogs: total,
      activeRoutines: routines.size,
      avgDuration: avg,
      streakDays: streak
    };
  }, [logs]);

  // heatmap values array
  const values = useMemo(() => (
    Object.keys(countsByDate).map(d => ({ date: d, count: countsByDate[d], minutes: minutesByDate[d] }))
  ), [countsByDate, minutesByDate]);

  const startDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - rangeMonths);
    return d;
  }, [rangeMonths]);

  const classForValue = (v) => {
    if (!v || !v.count) return 'color-empty';
    if (v.count >= 4) return 'color-scale-4';
    if (v.count === 3) return 'color-scale-3';
    if (v.count === 2) return 'color-scale-2';
    return 'color-scale-1'; // 1
  };

  const tooltipDataAttrs = (v) => {
    if (!v || !v.date) return { title: 'No activity' };
    const minutes = v.minutes || 0;
    const text = `${v.date} — ${v.count} log${v.count>1?'s':''} (${minutes.toFixed(0)} min)`;
    return { title: text, 'aria-label': text };
  };

  return (
    <>
      {/* KPIs */}
      <section className="container mt-4">
        <div className="row g-3">
          <Kpi title="Total Logs" value={totalLogs} />
          <Kpi title="Current Streak" value={`${streakDays} day${streakDays!==1?'s':''}`} />
          <Kpi title="Active Routines" value={activeRoutines} />
          <Kpi title="Avg Duration" value={`${avgDuration.toFixed(0)} min`} />
        </div>
      </section>

      {/* Calendar */}
      <section className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="m-0">Consistency Calendar</h2>
          <select
            className="form-select w-auto"
            value={rangeMonths}
            onChange={(e) => setRangeMonths(Number(e.target.value))}
          >
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </select>
        </div>

        <div className="mx-auto my-3 w-100" style={{maxWidth: 900}}>
          <CalendarHeatmap
            startDate={startDate}
            endDate={new Date()}
            showWeekdayLabels={false}
            values={values}
            classForValue={classForValue}
            tooltipDataAttrs={tooltipDataAttrs}
          />
          {/* Legend */}
          <div className="d-flex align-items-center gap-2 small mt-2">
            <span className='text-white'>Less</span>
            <span className="legend-box color-scale-1" />
            <span className="legend-box color-scale-2" />
            <span className="legend-box color-scale-3" />
            <span className="legend-box color-scale-4" />
            <span className='text-white'>More</span>
          </div>
        </div>
      </section>
       <Stats/>
    </>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="card shadow-sm h-100">
        <div className="card-body text-center">
          <div className="fw-semibold text-secondary">{title}</div>
          <div className="fs-4">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
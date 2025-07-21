import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function Calendar() {
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // TODO: replace with HTTP call
    setDates([
      { date: '2025-05-01', count: 2 },
      { date: '2025-05-22', count: 3 },
      { date: '2025-05-30', count: 2 },
      { date: '2025-07-01', count: 1 },
      // ...and so on
    ])
  }, []);

  // set start date of calendar
  const getStartDate = () => {
    let date = new Date();;
    date.setDate(date.getDate() - 90);
    return date;
  }

  /*
  TODO: add hover functionality?
  */

  return (
    <>
      <section id="container">
        <div className="text-center">
          <h2>Workout Calendar</h2>
        </div>
        <div className="mx-auto m-5 w-50">
          <CalendarHeatmap
            startDate={getStartDate()}
            endDate={Date.now()}
            showWeekdayLabels={true}
            values={dates}
          />
        </div>
      </section>
    </>
  );
}

export default Calendar;
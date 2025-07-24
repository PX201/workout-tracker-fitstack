import { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import UserNavbar from './UserNavbar';
import Stats from './Stats';

function Calendar() {
  const [dates, setDates] = useState([]);
  const [errors, setErrors] = useState([]);
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
      } else {
        return Promise.reject(`Error fetching logs: ${response.status}`);
      }
    })
    .then(data => {
      const countsByDate = data.reduce((acc, log) => {
        const date = log.date;
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const dateCountsArray = Object.entries(countsByDate).map(([date, count]) => ({
        date,
        count
      }));
      console.log(dateCountsArray);
      setDates(dateCountsArray);
    })
    .catch(err => {
      console.error(err);
      setErrors(["Could not fetch logs."]);
    });
  }, []);

  // set start date of calendar
  const getStartDate = () => {
    let date = new Date();;
    date.setDate(date.getDate() - 365);
    return date;
  }

  /*
  TODO: add hover functionality?
  */

  return (
    <>
      <UserNavbar />
      <section className="container mt-5">
        <div className="text-center">
          <h2>Workout Calendar</h2>
        </div>
        <div className="mx-auto m-5 w-50">
          <CalendarHeatmap
            startDate={getStartDate()}
            endDate={Date.now()}
            showWeekdayLabels={false}
            values={dates}
          />
        </div>
      </section>
      <Stats/>
    </>
  );
}

export default Calendar;
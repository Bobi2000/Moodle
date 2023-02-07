import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import events from "./events";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

export default function ReactBigCalendar() {
  const [eventsData, setEventsData] = useState(events);

  // const handleSelect = ({ start, end }) => {
  //   console.log("test");
  //   const title = window.prompt("New Event name");
  //   if (title)
  //     setEventsData([
  //       ...eventsData,
  //       {
  //         start,
  //         end,
  //         title,
  //       },
  //     ]);
  // };
  return (
    <div className="App">
      <Calendar
        views={["month"]}
        selectable
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={eventsData}
        style={{ height: "100vh" }}
        // onSelectEvent={(event) => alert(event.title)}
        // onSelectSlot={handleSelect}
      />
    </div>
  );
}

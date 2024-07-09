import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useHistory } from 'react-router-dom';
import httpCommon from "src/http-common";
import PropTypes from "prop-types";

const WorkOrderCalendarView = () => {
  const site_ID = localStorage.getItem("site_ID");
  const navigate = useNavigate();
  // const history = useHistory();

  const [events2, setEvents] = useState([]);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpCommon.get(
          `/get_WorkOrderCalenderData.php?site_cd=${site_ID}`
        );

        const formattedEvents = response.data.data.CalendarData.map((item) => ({
          start: new Date(item.wko_mst_org_date.date),
          end: new Date(item.wko_mst_org_date.date),
          title: `${item.wko_mst_wo_no}`,
          status: `${item.wko_mst_status}`,
          rowId: `${item.RowID}`,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.log("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [site_ID]);

  // Event click handler
  const handleEventClick = (events2) => {
    if (events2 && events2.rowId) {
     
      navigate(`/dashboard/work/neworder?rowID=${events2.rowId}`);
    }
  };
  // console.log("events23333",events2);
  return (
    <>
      <div className="ViewPartCal">
        <div style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events2}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            statusAccessor="status"
            views={["month", "week", "day"]}
            defaultView="month"
            style={{ marginBottom: "20px" }}
            selectable
            onSelectEvent={handleEventClick}
          />
        </div>
      </div>
    </>
  );
};
WorkOrderCalendarView.propTypes = {
  data: PropTypes.shape({
    site_cd: PropTypes.string.isRequired,
  }).isRequired,
};
export default WorkOrderCalendarView;

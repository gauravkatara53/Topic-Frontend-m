import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/App.css";
import { events } from "@/Data/calender";

interface EventItem {
  title: string;
  description: string;
  date: Date;
}

const AcademicCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const matchedEvent = events.find(
        (event) => event.date.toDateString() === date.toDateString()
      );

      const today = new Date();

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday = 0, Saturday = 6

      let classes = "";

      if (isToday && matchedEvent)
        classes += " react-calendar__tile--event-today";
      else if (matchedEvent) classes += " react-calendar__tile--event";
      else if (isToday) classes += " react-calendar__tile--today";

      if (isWeekend) classes += " react-calendar__tile--weekend";

      return classes.trim();
    }

    return null;
  };

  const handleDateClick = (date: Date) => {
    const matchedEvent = events.find(
      (event) => event.date.toDateString() === date.toDateString()
    );
    setSelectedEvent(matchedEvent || null);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-6 text-left">
        Academic Calendar
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={tileClassName}
          className="w-full mx-auto"
        />
      </div>

      {selectedEvent && (
        <div className="rounded-md my-4 border-l-4 border-yellow-500 bg-yellow-100 p-4">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {selectedEvent.title}
              </p>
              <p className="text-sm text-gray-600">
                {selectedEvent.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCalendar;

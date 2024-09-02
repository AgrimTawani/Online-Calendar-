import { useState, useEffect } from 'react';
import axios from 'axios'; 

const Calendar = () => {
  const NumOfDays = 31;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Local storage is not working
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '{}'); // Default to empty object if null
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    axios.get('https://mocki.io/v1/7b47d683-984a-4fe8-9d40-4fc57a71145a')
      .then(response => {
        const holidaysData = response.data;
        const augustHolidays = holidaysData.response.holidays
          .filter(holiday => holiday.date.iso.startsWith('2019-08'))
          .reduce((acc, holiday) => {
            const day = parseInt(holiday.date.iso.split('-')[2], 10);
            if (!acc[day]) {
              acc[day] = [];
            }
            acc[day].push(holiday.name);
            return acc;
          }, {});

        setEvents(augustHolidays);
      })
      .catch(error => {
        console.error('Error fetching holidays data:', error);
      });
  }, []);


  const handleDayClick = (day) => {
    setSelectedDay(day);
    setEventName('');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEventName('');
  };

  const handleSave = () => {
    if (eventName.trim()) {
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        
        if (!updatedEvents[selectedDay]) {
          updatedEvents[selectedDay] = [];
        }

        updatedEvents[selectedDay] = [...updatedEvents[selectedDay], eventName];
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        return updatedEvents;
      });
    }
    setEventName('');
    setIsModalOpen(false);
  };

  const dayElements = [];

  for (let i = 0; i < 4; i++) {
    dayElements.push(<div key={`empty-${i}`} className="border-none"></div>);
  }

  for (let day = 1; day <= NumOfDays; day++) {
    dayElements.push(
      <div
        key={day}
        className="border border-gray-300 rounded p-2 h-24 relative hover:bg-gray-200 cursor-pointer"
        onClick={() => handleDayClick(day)}
      >
        <span className="absolute top-1 right-1 text-xs text-gray-500">
          {day}
        </span>
        <div className="mt-2">
          {events[day]?.map((event, index) => (
            <div key={index} className="text-xs bg-blue-100 mt-1 p-1 rounded">
              {event}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">2019 August Calendar</h2>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div key={day} className="font-bold text-center p-2">
            {day}
          </div>
        ))}
        {dayElements}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Add Event for Day {selectedDay}</h3>
            <div className="flex flex-col justify-center">
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Event Name"
                className="border p-2 mb-4 w-full italic"
              />
              <div className="flex justify-evenly">
                <button
                  onClick={handleClose}
                  className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>

                <button
                  onClick={handleSave}
                  className="ml-2 bg-blue-300 px-4 py-2 rounded hover:bg-blue-400"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

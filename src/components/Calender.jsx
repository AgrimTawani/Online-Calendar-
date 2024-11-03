/* eslint-disable no-undef */
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import axios from 'axios';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2019, 0, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});
  const [tasks, setTasks] = useState({});
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '{}');
    setEvents(storedEvents);

    axios.get('https://mocki.io/v1/7b47d683-984a-4fe8-9d40-4fc57a71145a')
      .then(res => {
        const monthEvents = {};
        const holidays = res.data.response.holidays;
        holidays.forEach(holiday => {
          const day = new Date(holiday.date.iso).getDate();
          const month = new Date(holiday.date.iso).getMonth();
          const year = new Date(holiday.date.iso).getFullYear();
          const key = `${year}-${month + 1}-${day}`;
          
          if (!monthEvents[key]) {
            monthEvents[key] = [];
          }
          monthEvents[key].push({ name: holiday.name, isHoliday: true });
        });

        setEvents(prevEvents => {
          const updatedEvents = { ...prevEvents, ...monthEvents };
          localStorage.setItem('events', JSON.stringify(updatedEvents));
          return updatedEvents;
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setEventName('');
    setIsModalOpen(true);
    setIsSidebarOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEventName('');
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDay(null);
  };

  const handleSave = () => {
    if (eventName.trim()) {
      setEvents((prevEvents) => {
        const updatedEvents = { ...prevEvents };
        const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
        
        if (!updatedEvents[key]) {
          updatedEvents[key] = [];
        }

        updatedEvents[key] = [...updatedEvents[key], { name: eventName, isHoliday: false }];
        return updatedEvents;
      });
      setEventName('');
      setIsModalOpen(false);
    }    
  };

  const handleDeleteEvent = (dateKey, eventIndex) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[dateKey] = updatedEvents[dateKey].filter((_, index) => index !== eventIndex);
      if (updatedEvents[dateKey].length === 0) {
        delete updatedEvents[dateKey];
      }
      return updatedEvents;
    });
  };

  const handleAddTask = (dateKey, taskText) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [dateKey]: [...(prevTasks[dateKey] || []), { text: taskText, completed: false }]
    }));
  };

  const handleDeleteTask = (dateKey, taskIndex) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[dateKey] = updatedTasks[dateKey].filter((_, index) => index !== taskIndex);
      if (updatedTasks[dateKey].length === 0) {
        delete updatedTasks[dateKey];
      }
      return updatedTasks;
    });
  };

  const handleToggleTask = (dateKey, taskIndex) => {
    setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        if (!updatedTasks[dateKey]) {
            updatedTasks[dateKey] = [];
        }
        updatedTasks[dateKey] = updatedTasks[dateKey].map((task, index) => 
            index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        return updatedTasks;
    });
};

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const dayElements = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      dayElements.push(<div key={`empty-${i}`} className="border-none"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      dayElements.push(
        <div
          key={day}
          className="border border-gray-200 rounded-lg p-2 h-28 relative cursor-pointer transition-all duration-200 shadow-sm transform hover:scale-105 backdrop-blur-md bg-white/30 border-white/10"
          onClick={() => handleDayClick(day)}
        >
          <span className="absolute top-1 right-2 text-sm font-semibold text-black">
            {day}
          </span>
          <div className="mt-6 space-y-1">
            {events[dateKey]?.map((event, index) => (
              <div
                key={index}
                className={`text-xs p-1 rounded-md flex justify-between items-center ${
                  event.isHoliday ? 'bg-green-200 text-green-900' : 'bg-[#B3E5FC] text-blue-900'
                } transition-opacity duration-200 opacity-90 hover:opacity-100`}
              >
                <span>{event.name}</span>
                {!event.isHoliday && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(dateKey, index);
                    }}
                    className="ml-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return dayElements;
  };

  return (
    <div className="mx-auto p-8 bg-[#1C1F2E] min-h-screen flex items-center justify-center">
      <Sidebar 
        isOpen={isSidebarOpen}
        selectedDay={selectedDay}
        currentDate={currentDate}
        tasks={tasks}
        onClose={handleCloseSidebar}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
      />
      
      <div className={`max-w-6xl w-full mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : ''}`}>
        <Header 
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        
        <div className="grid grid-cols-7 gap-4 mt-8">
          {days.map((day) => (
            <div key={day} className="font-bold font-inter text-2xl text-center p-2 text-[#D1D5DB]">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
        
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80">
            <h3 className="text-lg font-bold">Add Event</h3>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mt-2"
              placeholder="Event name"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleClose}
                className="bg-red-500 text-white rounded-lg px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white rounded-lg px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

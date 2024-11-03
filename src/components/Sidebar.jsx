/* eslint-disable react/prop-types */
import { X, Plus, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({
  isOpen,
  selectedDay,
  currentDate,
  tasks,
  onClose,
  onAddTask,
  onDeleteTask,
}) => {
  const [newTask, setNewTask] = useState('');
  
  const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;

  const navigate = useNavigate();

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(dateKey, newTask);
      setNewTask('');
    }
  };

  const handlePlayTask = (task) => {
    navigate(`/task-timer/${task.text}`);
  };
  

  return (
    <div
      className={`fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-md p-6 border-r border-white/20 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">
          Tasks for {selectedDay}{' '}
          {currentDate.toLocaleString('default', { month: 'long' })}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-200 rounded-lg transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add new task..."
          className="flex-1 p-2 rounded-lg bg-white/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
        />
        <button
          onClick={handleAddTask}
          disabled={!newTask.trim()}
          className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        {tasks[dateKey]?.map((task, index) => (
          <div
            key={index}
            className="flex items-center p-3 rounded-lg bg-white/20 border border-white/10 group hover:bg-white/30 transition-colors duration-200"
          >
            <span className="flex-1 text-white truncate ml-3">
              {task.text}
            </span>
            <button
              onClick={() => handlePlayTask(task)}
              className="p-1 text-green-400 hover:text-green-600 transition-all duration-200 rounded-full hover:bg-white/10 mr-2"
            >
              <Play size={16} />
            </button>
            <button
              onClick={() => onDeleteTask(dateKey, index)}
              className="p-1 text-red-400 hover:text-red-600 transition-all duration-200 rounded-full hover:bg-white/10"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

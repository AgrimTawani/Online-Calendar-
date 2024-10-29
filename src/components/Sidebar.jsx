/* eslint-disable react/prop-types */
import { X, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ 
  isOpen, 
  selectedDay,
  currentDate,
  tasks,
  onClose,
  onAddTask,
  onDeleteTask,
  onToggleTask
}) => {
  const [newTask, setNewTask] = useState('');
  const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${selectedDay}`;
  const dayTasks = tasks[dateKey] || [];

  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(dateKey, newTask);
      setNewTask('');
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-80 bg-white/10 backdrop-blur-md p-6 border-r border-white/20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">
          Tasks for {selectedDay} {currentDate.toLocaleString('default', { month: 'long' })}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Add new task..."
          className="flex-1 p-2 rounded-lg bg-white/20 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddTask}
          className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {dayTasks.map((task, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleTask(dateKey, index)}
                className={`text-lg ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
              >
                <CheckCircle2 size={20} />
              </button>
              <span className={`text-white ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.text}
              </span>
            </div>
            <button
              onClick={() => onDeleteTask(dateKey, index)}
              className="text-red-400 hover:text-red-600 transition-colors duration-200"
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
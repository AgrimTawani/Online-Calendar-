import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react'; 

const TaskTimer = () => {
  const { taskName } = useParams();
  const [time, setTime] = useState(0); 
  const [timer, setTimer] = useState(0); 
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsRunning(false); 
    }
  }, [isRunning, timer]);

  const startTimer = () => {
    if (time > 0) {
      setTimer(time);
      setIsRunning(true);
    }
  };

  const addTime = () => setTimer((prev) => prev + 10);
  const subtractTime = () => setTimer((prev) => Math.max(prev - 10, 0));

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-800 text-white p-6">
      <div className="bg-white/20 border border-white/10 p-8 rounded-lg backdrop-blur-md text-center w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Task: {taskName}</h2>

        {!isRunning ? (
          <div className="mb-6">
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(parseInt(e.target.value, 10))}
              placeholder="Set timer (seconds)"
              className="p-2 rounded-lg text-gray-900 w-full text-center"
            />
            <button
              onClick={startTimer}
              className="mt-4 p-2 bg-indigo-500 text-white rounded-lg w-full hover:bg-indigo-600 transition-colors duration-200"
            >
              Start Timer
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-5xl mb-4">{timer}s</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={addTime}
                className="flex items-center p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <ArrowUp size={16} className="mr-1" /> +10s
              </button>
              <button
                onClick={subtractTime}
                className="flex items-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                <ArrowDown size={16} className="mr-1" /> -10s
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTimer;

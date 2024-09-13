/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Header = ({ currentDate, onPrevMonth, onNextMonth }) => {
    return (
      <div className="flex justify-between items-center mb-6">
        <button
          className="p-2 rounded-full bg-indigo-100 text-indigo-500 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-110"
          onClick={onPrevMonth}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-inter font-bold text-[#D1D5DB]">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          className="p-2 rounded-full bg-indigo-100 text-indigo-500 hover:bg-indigo-200 transition-all duration-200 transform hover:scale-110"
          onClick={onNextMonth}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };
export default Header;
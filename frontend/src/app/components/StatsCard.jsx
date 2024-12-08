import React from 'react';

const StatsCard = ({ value, label }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-gray-400 mt-1">{label}</div>
    </div>
  );
};

export default StatsCard;
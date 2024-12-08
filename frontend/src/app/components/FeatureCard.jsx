import React from 'react';
import { LucideIcon } from 'lucide-react';


const FeatureCard = ({ icon: Icon, title, description, gradient }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-lg ${gradient} p-3 mb-4`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default FeatureCard;
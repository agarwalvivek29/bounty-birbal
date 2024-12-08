import React from 'react';
import { Github, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-20 pb-32 text-center">
      <div className="space-y-4 max-w-4xl mx-auto px-4">
        <div className="inline-block">
          <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 mb-8">
            <span className="text-blue-400">🏆 ETHIndia 2024 Hackathon Project</span>
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Where GitHub Meets
          </span>
          <br />
          <span className="text-white">Web3 Magic</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Transform open-source collaboration with blockchain-powered bounties, AI-driven insights,
          and seamless GitHub integration.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
            <Github className="mr-2" />
            Connect GitHub
          </button>
          <button className="flex items-center px-8 py-4 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-700">
            Learn More
            <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
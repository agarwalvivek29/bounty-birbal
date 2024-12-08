

import React from 'react';
import { Github, Zap, Shield, Users, Bot, Lock } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import FeatureCard from './FeatureCard';
import StatsCard from './StatsCard';
import HeroSection from './HeroSection';

function Home() {
  const features = [
    {
      icon: Github,
      title: 'GitHub-Native Integration',
      description: 'Manage bounties directly from GitHub with simple commands like /bounty and /reward.',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure Smart Contracts',
      description: 'Guaranteed payments through Ethereum and Polygon smart contracts.',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      icon: Bot,
      title: 'AI-Powered Analysis',
      description: 'Lit Protocol AI analyzes PRs and tracks progress automatically.',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      icon: Lock,
      title: 'Privacy-First KYC',
      description: 'Anon Aadhaar ensures secure, privacy-preserving verification.',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience instant transactions and minimal fees on Base Network.',
      gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with developers worldwide and grow the Web3 ecosystem.',
      gradient: 'bg-gradient-to-r from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <HeroSection />

        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            <StatsCard value="10,000+" label="Developers" />
            <StatsCard value="$2M+" label="Bounties Paid" />
            <StatsCard value="1,000+" label="Projects" />
            <StatsCard value="24hr" label="Avg. Resolution" />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Web3 Innovation</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience the future of open-source collaboration with our cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>

        <footer className="border-t border-gray-800 py-12">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2024 Bounty-Birbal. Built with ❤️ for ETHIndia 2024</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
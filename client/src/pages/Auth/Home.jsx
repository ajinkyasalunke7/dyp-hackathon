import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Layout, Sparkles } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-highlight" />
              <span className="ml-2 text-xl font-semibold text-highlight">MindMesh</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="#" className="text-gray-600 hover:text-highlight">About</Link>
              <Link to="#" className="text-gray-600 hover:text-highlight">Contact</Link>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-600 hover:text-highlight"
              >
                Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent"
              >
                Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Peer-to-Peer </span>
                <span className="block text-highlight">Personalized solutions</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                MindMesh: Instant doubt-solving and real-time peer collaboration through chat and video.
              </p>
              <div className="mt-5 sm:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-highlight hover:bg-accent md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary py-24" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Layout className="h-8 w-8 text-highlight mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Real-Time Doubt Solving</h3>
              <p className="mt-2 text-gray-500">Get instant answers through live chat and video calls.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Code className="h-8 w-8 text-highlight mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Multi-Subject Support</h3>
              <p className="mt-2 text-gray-500">Solve queries across a wide range of subjects anytime.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Sparkles className="h-8 w-8 text-highlight mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Peer-to-Peer Collaboration</h3>
              <p className="mt-2 text-gray-500">Connect with fellow learners for interactive discussions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-accent">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-600">&copy; 2025 MindMesh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

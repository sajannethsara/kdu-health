import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeBgImg from '../../assets/home_back.jpg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center text-black"
      style={{ backgroundImage: `url(${HomeBgImg})` }}
    >
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to QuickCare</h1>
        <p className="text-lg">Your trusted partner in healthcare solutions</p>
        <div className="flex gap-2 items-center justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md shadow"
            onClick={() => navigate('/about')}
          >
            Learn More
          </button>
          <button
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow"
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

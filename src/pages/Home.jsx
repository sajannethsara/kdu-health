import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import doctorStudentImg from '../assets/WhatsApp Image 2025-09-09 at 10.08.44_7222031e.jpg';
import qcLogo from '../assets/qc.jpg';  

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ambulanceBtnRef = React.useRef(null);

  React.useEffect(() => {
    if (location.state && location.state.scrollToAmbulance && ambulanceBtnRef.current) {
      ambulanceBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <img src={qcLogo} alt="QuickCare Logo" className="h-10 w-10" />
          <span className="text-2xl font-bold text-blue-700 tracking-wide">QUICK CARE</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-blue-700 font-semibold hover:underline" onClick={() => navigate('/signup')}>Sign Up</button>
          <button className="text-3xl text-gray-600 hover:text-blue-700 focus:outline-none" aria-label="Menu">&#9776;</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Emergency Button */}
        <button
          ref={ambulanceBtnRef}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg mb-6 animate-bounce"
          onClick={() => navigate('/emergency')}
        >
          Call Ambulance
        </button>

        {/* Illustration */}
        <div className="mb-6">
          <img
            src={doctorStudentImg}
            alt="Doctor and Student"
            className="h-40 w-auto rounded-xl shadow-md object-cover"
            onError={e => {e.target.onerror = null; e.target.src = '/vite.svg';}}
          />
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">Welcome to QuickCare</h1>

        {/* Role-Based Login Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow" onClick={() => navigate('/login')}>Login as Student</button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md shadow" onClick={() => navigate('/login')}>Login as Doctor</button>
          <button className="bg-blue-400 hover:bg-cyan-500 text-white font-semibold py-2 rounded-md shadow" onClick={() => navigate('/login')}>Login as Amb_Assistant</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex justify-center gap-8 py-4 bg-white shadow-inner text-gray-600 text-sm">
        <a href="#help" className="hover:underline">Help</a>
        <a href="#about" className="hover:underline">About</a>
      </footer>
    </div>
  );
};

export default Home;
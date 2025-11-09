import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Reports from './pages/reports'
import RateUs from './pages/RateUs'
import Emergency from './pages/Emergency'
import Student from './pages/student'
import DoctorDashboard from './pages/doctor'
import Notifications from './pages/notifications'
import DoctorNotifications from './pages/doctorNotifications'
import Chat from './pages/chat'


function App() {
  return (
    <Router>
      <div>
        {/* Navigation Menu */}
        <nav className="p-4 bg-gradient-to-r from-blue-500 to-orange-400 text-white flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
          <Link to="/">Home</Link>
          <Link to="/signup">Signup</Link>         
          <Link to="/login">Login</Link>
          
          <Link to="/emergency">Emergency</Link>
          <Link to="/student">Student</Link>
          <Link to="/doctor">Doctor</Link>
          <Link to="/notifications">St Notification</Link>
          <Link to="/doctor-notifications">Doctor Notifications</Link>
         
          <Link to="/reports">Reports</Link>
          <Link to="/rateus">Rate Us</Link>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rateus" element={<RateUs />} />
          <Route path="/emergency" element={<Emergency userRole="student" />} />
          <Route path="/student" element={<Student />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/doctor-notifications" element={<DoctorNotifications />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
import React from 'react';
import { useNavigate } from 'react-router-dom';

const doctor = {
  name: 'Dr. Achintha Dissanayaka',
  specialization: 'General Physician',
  avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
};

const appointments = [
  {
    id: 1,
    patient: 'Maneesha Thathsarani',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    tag: '#stomach pain',
    status: 'Ongoing',
  },
  {
    id: 2,
    patient: 'Nimal Perera',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    tag: '#fever',
    status: 'Ongoing',
  },
  {
    id: 3,
    patient: 'Samanthi Silva',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    tag: '#headache',
    status: 'Pending',
  },
];

export default function DoctorDashboard() {
  const ongoing = appointments.filter(a => a.status === 'Ongoing');
  const pending = appointments.filter(a => a.status === 'Pending');
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Doctor Info Header */}
      <div className="bg-blue-100 rounded-xl p-6 text-center mb-6">
        <img src={doctor.avatar} alt="doctor" className="mx-auto mb-2 w-16 h-16 rounded-full border-2 border-blue-300" />
        <div className="font-semibold text-lg text-blue-900">{doctor.name}</div>
        <div className="text-sm text-blue-700">{doctor.specialization}</div>
      </div>

      {/* Section Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-red-600 font-bold text-lg">Today's Appointments</span>
        <span className="bg-red-500 text-white rounded-full px-2 text-xs font-semibold">{appointments.length}</span>
      </div>

      {/* Ongoing Appointments */}
      {ongoing.length > 0 && (
        <div className="mb-6">
          <div className="text-blue-700 font-semibold mb-2">Ongoing</div>
          {ongoing.map(app => (
            <div
              key={app.id}
              className="flex items-center bg-white rounded-lg shadow p-4 mb-3 cursor-pointer hover:bg-blue-50 transition"
              onClick={() => navigate('/chat', { state: { patient: app.patient, avatar: app.avatar, tag: app.tag } })}
            >
              <img src={app.avatar} alt={app.patient} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="font-semibold">{app.patient}</div>
                <div className="text-xs text-gray-500">{app.tag}</div>
              </div>
              <span className="bg-blue-400 text-white rounded-full px-2 py-1 text-xs font-semibold">Ongoing</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending Appointments */}
      {pending.length > 0 && (
        <div>
          <div className="text-gray-700 font-semibold mb-2">Pending</div>
          {pending.map(app => (
            <div key={app.id} className="flex items-center bg-white rounded-lg shadow p-4 mb-3">
              <img src={app.avatar} alt={app.patient} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="font-semibold">{app.patient}</div>
                <div className="text-xs text-gray-500">{app.tag}</div>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-l-full font-semibold hover:bg-orange-900 transition">Accept</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

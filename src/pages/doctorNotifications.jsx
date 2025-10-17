import React from 'react';

const notifications = [
  {
    id: 1,
    type: 'new_appointment',
    icon: '📅',
    title: 'New Appointment Request',
    description: 'You have a new appointment request from Maneesha Thathsarani.',
    time: '2 min ago',
    cta: 'View Appointment',
  },
  {
    id: 2,
    type: 'report_uploaded',
    icon: '📄',
    title: 'Report Uploaded',
    description: 'Patient Nimal Perera has uploaded a new blood test report.',
    time: '10 min ago',
    cta: 'Review Report',
  },
  {
    id: 3,
    type: 'appointment_cancelled',
    icon: '❌',
    title: 'Appointment Cancelled',
    description: 'Patient Samanthi Silva cancelled their appointment.',
    time: '1 hour ago',
    cta: null,
  },
  {
    id: 4,
    type: 'emergency',
    icon: '🚑',
    title: 'Emergency Request',
    description: 'Emergency request received from student. Immediate attention required.',
    time: 'Just now',
    cta: 'View Emergency',
  },
];

export default function DoctorNotifications() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🔔</span>
        <span className="text-2xl font-bold">Doctor Notifications</span>
      </div>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`rounded-xl p-4 border shadow-sm mb-4 bg-white flex flex-col gap-2 ${
            n.type === 'appointment_cancelled'
              ? 'bg-red-50 border-red-300'
              : n.type === 'emergency'
              ? 'bg-blue-100 border-blue-400'
              : 'border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{n.icon}</span>
            <span
              className={`text-xl font-semibold ${
                n.type === 'new_appointment'
                  ? 'text-blue-600'
                  : n.type === 'appointment_cancelled' || n.type === 'emergency'
                  ? 'text-red-600'
                  : 'text-gray-700'
              }`}
            >
              {n.title}
            </span>
          </div>
          <div className="text-gray-700 text-sm pl-9">{n.description}</div>
          <div className="flex items-center justify-between pl-9">
            <span className="text-xs text-gray-600">{n.time}</span>
            {n.cta && (
              <button className="bg-blue-400 text-white px-4 py-1 rounded-full hover:bg-blue-500 text-xs font-semibold">
                {n.cta}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

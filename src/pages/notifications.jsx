import React from 'react';
import { useNavigate } from 'react-router-dom';

const notifications = [
  {
    id: 1,
    type: 'confirmed',
    icon: '✅',
    title: 'Appointment Confirmed',
    description: 'Your appointment with Dr. Achintha Dissanayaka is confirmed for today at 3:00 PM.',
    time: '2 min ago',
    cta: 'View Details',
  },
  {
    id: 2,
    type: 'report',
    icon: '📄',
    title: 'Report Reviewed',
    description: 'Your blood test report has been reviewed by Dr. Achintha Dissanayaka.',
    time: '1 hour ago',
    cta: 'View Report',
  },
  {
    id: 3,
    type: 'cancelled',
    icon: '❌',
    title: 'Appointment Cancelled',
    description: 'Your appointment with Dr. Achintha Dissanayaka was cancelled.',
    time: 'Yesterday',
    cta: null,
  },
  {
    id: 4,
    type: 'emergency',
    icon: '🚑',
    title: 'Emergency Alert',
    description: 'Ambulance is on the way to your location. Please stay safe.',
    time: 'Just now',
    cta: 'Track Ambulance',
  },
];

export default function Notifications() {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🔔</span>
        <span className="text-2xl font-bold">Notifications</span>
      </div>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`rounded-xl p-4 border shadow-sm mb-4 bg-white flex flex-col gap-2 ${
            n.type === 'cancelled'
              ? 'bg-red-50 border-red-300'
              : n.type === 'emergency'
              ? 'bg-blue-100 border-blue-400'
              : 'border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {n.icon}
            </span>
            <span
              className={`text-xl font-semibold ${
                n.type === 'confirmed'
                  ? 'text-green-600'
                  : n.type === 'cancelled' || n.type === 'emergency'
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
              <button
                className="bg-blue-400 text-white px-4 py-1 rounded-full hover:bg-blue-500 text-xs font-semibold"
                onClick={() => {
                  if (n.type === 'emergency') navigate('/emergency');
                }}
              >
                {n.cta}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

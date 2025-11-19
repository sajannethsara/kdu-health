import React from 'react';

export default function StudentNotifications() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <p className="text-sm text-muted-foreground">No new notifications at this time.</p>
      {/* Future: List of notifications from Firestore or state */}
    </div>
  );
}

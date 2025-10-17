import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/UserStore';

const initialChats = [
  {
    id: '1',
    name: 'Dr. Achintha Dissanayaka',
    specialization: 'General Physician',
    message: 'Docter mata kema knn appiri...',
    status: 'Ongoing',
  }
];

export default function Student() {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState(null);
  const [uid, setUid] = useState(auth.currentUser?.uid ?? null);
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // redirect to login if no user
    if (!user) {
      navigate('/login');
      return;
    }

    // set uid from auth if not set
    if (!uid && auth.currentUser?.uid) {
      setUid(auth.currentUser.uid);
    }

    // only students allowed
    if (user.role && user.role !== 'student') {
      // you can navigate away or leave the Access Denied UI
      return;
    }

    // fetch chats for the current student (if uid available)
    const fetchChatsData = async (studentUid) => {
      if (!studentUid) return;
      try {
        const q = query(collection(db, 'Appointments'), where('st_id', '==', studentUid));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            dr_name: data.dr_name ?? '',
            title: data.title ?? '',
            approved: data.approved ?? false,
          };
        });
        setChats(results.length ? results : initialChats);
        console.log('Fetched chats:', results);
        // setChats(results.length ? results : initialChats);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        // setChats(initialChats);
      }
    };

    fetchChatsData(uid);
  }, [user, uid, navigate]);

  if (!user) return null;
  if (user.role && user.role !== 'student') return <div>Access Denied</div>;

  const filteredChats = (chats || []).filter(chat =>
    (chat.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (chat.specialization || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto p-4">
      <input
        type="text"
        placeholder="Search Doctors / specialist"
        className="w-full p-2 rounded-md border border-gray-300 mb-4 focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex items-center gap-3 mb-6">
        <img
          src={user?.photoURL || "https://randomuser.me/api/portraits/women/44.jpg"}
          alt="profile"
          className="rounded-full w-10 h-10"
        />
        <div>
          <div className="font-semibold text-lg">{user?.name}</div>
          <div className="text-xs text-gray-500">{auth.currentUser?.email}</div>
        </div>
      </div>

      <div
        className="bg-red-50 border border-red-400 rounded-lg p-4 mb-6 relative cursor-pointer hover:shadow-lg transition"
        onClick={() => navigate('/', { state: { scrollToAmbulance: true } })}
      >
        <p>🚨 <span className="font-bold">Claiming an <span className="text-red-600">Emergency</span></span></p>
        <p className="text-sm">Immediate connection to UHKDU Werahara for urgent medical situations</p>
        <span className="absolute top-3 right-4 text-lg text-blue-500 hover:underline">↗</span>
      </div>

      <div>
        {filteredChats?.length === 0 && <div className="text-gray-500">No chats found</div>}
        {filteredChats?.map(chat => (
          <div key={chat.id} className="p-4 border rounded mb-3">
            <div className="font-semibold">{chat.dr_name}</div>
            {chat.title && <div className="text-sm text-gray-600">{chat.title}</div>}
            {chat.message && <div className="text-sm mt-2">{chat.message}</div>}
            <div className="text-xs mt-2 text-gray-500">{chat.approved}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db,auth } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/UserStore';


const initialChats = [
  {
    name: 'Dr. Achintha Dissanayaka',
    specialization: 'General Physician',
    message: 'Docter mata kema knn appiri...',
    status: 'Ongoing',
  },
  {
    name: 'Dr. Achintha Dissanayaka',
    specialization: 'General Physician',
    message: 'Docter mata kema knn appiri...',
    status: 'Ongoing',
  },
  {
    name: 'Dr. Achintha Dissanayaka',
    specialization: 'General Physician',
    status: 'Done',
  },
  {
    name: 'Dr. Achintha Dissanayaka',
    specialization: 'General Physician',
    status: 'Done',
  },
];

export default function Student() {

  const [uid, setUid] = useState(auth.currentUser?.uid);
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const fetchUserData = async () => {

      try {
        // 👇 Query the 'Users' collection where uid == your UID
        const usersRef = collection(db, "Users");

        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first matching document
          const userDoc = querySnapshot.docs[0];
          setUserData({ id: userDoc.id, ...userDoc.data() });
          console.log("User Data:", { id: userDoc.id, ...userDoc.data() });
        } else {
          console.log("No user found with UID:", uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) fetchUserData();
  }, [uid]);

  const [search, setSearch] = useState('');
  const [chats, setChats] = useState(initialChats);
  const navigate = useNavigate();

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    (chat.specialization && chat.specialization.toLowerCase().includes(search.toLowerCase()))
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
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="rounded-full w-10 h-10" />
        <div>
          <div className="font-semibold text-lg">{user?.name}</div>
          <div className="text-xs text-gray-500">{auth.currentUser?.email}</div>
        </div>
      </div>

      <div
        className="bg-red-50 border border-red-400 rounded-lg p-4 mb-6 relative cursor-pointer hover:shadow-lg transition"
        onClick={() => {
          navigate('/', { state: { scrollToAmbulance: true } });
        }}
      >
        <p>🚨 <span className="font-bold">Claiming an <span className="text-red-600">Emergency</span></span></p>
        <p className="text-sm">Immediate connection to UHKDU Werahara for urgent medical situations</p>
        <span className="absolute top-3 right-4 text-lg text-blue-500 hover:underline">↗</span>
      </div>

      {filteredChats.map((chat, idx) => (
        chat.status === 'Ongoing' ? (
          <div
            className="bg-white p-4 mb-4 rounded-lg shadow cursor-pointer hover:bg-blue-50 transition"
            key={idx}
            onClick={() => navigate('/chat')}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{chat.name}</div>
                <div className="text-xs text-gray-500">{chat.specialization}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs text-white bg-blue-500">{chat.status}</span>
            </div>
            <div className="text-sm text-gray-700 mt-2">{chat.message}</div>
          </div>
        ) : (
          <div className="bg-white p-4 mb-4 rounded-lg shadow" key={idx}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{chat.name}</div>
                <div className="text-xs text-gray-500">{chat.specialization}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs text-white bg-orange-400">{chat.status}</span>
            </div>
            <button className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold">Request New Appointment</button>
          </div>
        )
      ))}
    </div>
  );
}

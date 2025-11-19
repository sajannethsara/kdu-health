import React, { useEffect, useState } from 'react';
import { doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/UserStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Chat from '../common/Chat';
import StudentNotifications from './StudentNotifications';
import AppoinmentFormDialog from './AppoinmentFormDialog';

export default function Student() {
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return; // not logged in yet
    if (user && user.uid === currentUid) return; // already have user data, avoid refetch

    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "Users");
        const q = query(usersRef, where("uid", "==", currentUid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = { id: userDoc.id, ...userDoc.data() };
          setUser(userData);
          console.log("User Data:", userData);
        } else {
          console.log("No user found with UID:", currentUid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const [search, setSearch] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [doctorsResults, setDoctorsResults] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const filteredChats = chats.filter(chat =>
    (chat.studentName || chat.doctorName || chat.name || '').toLowerCase().includes(chatSearch.toLowerCase()) ||
    (chat.specialization && chat.specialization.toLowerCase().includes(chatSearch.toLowerCase()))
  );

  // search for doctors when the search input has text
  useEffect(() => {
    let mounted = true;
    const term = (search || '').trim().toLowerCase();
    if (!term) {
      setDoctorsResults([]);
      return;
    }

    const doSearch = async () => {
      try {
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('role', '==', 'doctor'));
        const snap = await getDocs(q);
        if (!mounted) return;
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // simple client-side filtering (name / specialization)
        const filtered = list.filter(u => {
          const name = (u.name || '').toLowerCase();
          const spec = (u.specialization || '').toLowerCase();
          const email = (u.email || '').toLowerCase();
          return name.includes(term) || spec.includes(term) || email.includes(term);
        });
        setDoctorsResults(filtered);
      } catch (err) {
        console.error('Doctor search error', err);
      }
    };

    doSearch();
    return () => { mounted = false; };
  }, [search]);

  // subscribe to chats for this student
  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      // clear chats if user signs out
      setChats([]);
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('studentId', '==', currentUid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(list);
      // set selected chat if nothing selected yet
      setSelectedChatId(prev => (prev ? prev : list.length > 0 ? list[0].id : null));
    }, (err) => console.error('Chats snapshot error', err));

    return () => unsub();
  }, [auth.currentUser?.uid]);

  // start a chat with a doctor (or open existing)
  const startChat = async (doctor) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      navigate('/login');
      return;
    }

    const doctorUid = doctor.uid || doctor.id;

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('studentId', '==', currentUid), where('doctorId', '==', doctorUid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        // open existing chat
        const existing = snap.docs[0];
        setSelectedChatId(existing.id);
        return;
      }

      // create new chat
      const newChat = {
        // align field names with existing Firestore documents
        createdAt: serverTimestamp(),
        studentId: currentUid,
        studentName: user?.name || auth.currentUser?.displayName || '',
        studentAvatar: user?.avatar || auth.currentUser?.photoURL || '',
        doctorId: doctorUid,
        doctorName: doctor.name || '',
        specialization: doctor.specialization || '',
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
        status: 'active',
      };

      const docRef = await addDoc(collection(db, 'chats'), newChat);
      setSelectedChatId(docRef.id);
    } catch (err) {
      console.error('startChat error', err);
    }
  };
  return (
    <div className="min-h-screen p-4 flex flex-col bg-gray-50">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search Doctors / Specialist"
          className="mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
        />
        {searchFocused && search.trim() !== '' && (
          <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg w-full max-h-60 overflow-y-auto">
            {doctorsResults.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">No doctors found</div>
            ) : (
              <div className="space-y-2 p-2">
                {doctorsResults.map((docr) => (
                  <div
                    key={docr.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                    onClick={() => {
                      startChat(docr);
                      setSearch('');
                      setSearchFocused(false);
                    }}
                  >
                    <div className="font-semibold text-gray-800">{docr.name}</div>
                    <div className="text-xs text-gray-500">{docr.specialization || docr.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="rounded-full w-12 h-12 shadow-md" />
          <div>
            <p className="font-semibold text-lg text-gray-800">{user?.firstName + ' ' + user?.lastName}</p>
            <p className="text-xs text-gray-500">{auth.currentUser?.email}</p>
          </div>
        </div>
        <div className="mr-7">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative">
                Notifications
                {chats.filter(chat => chat.status === 'Ongoing').length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 leading-none">
                    {chats.filter(chat => chat.status === 'Ongoing').length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <StudentNotifications />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div
        className="bg-red-50 border border-red-400 rounded-lg p-4 mb-6 relative cursor-pointer hover:shadow-lg transition"
        onClick={() => {
          navigate('/', { state: { scrollToAmbulance: true } });
        }}
      >
        <p className="text-lg font-bold text-red-600">🚨 Claiming an Emergency</p>
        <p className="text-sm text-gray-600">Immediate connection to UHKDU Werahara for urgent medical situations</p>
        <span className="absolute top-3 right-4 text-lg text-blue-500 hover:underline">↗</span>
      </div>

      <div className="flex gap-6 h-[70vh]">
        <div className="w-80 overflow-y-auto bg-white rounded-md shadow-md p-4">
          <div className="space-y-3">
            {filteredChats.length === 0 && <div className="text-sm text-gray-500">No chats yet</div>}
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition ${selectedChatId === chat.id ? 'bg-blue-100' : 'bg-white'} shadow-md`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.studentAvatar || chat.doctorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((chat.doctorName || chat.studentName || 'User'))}`} />
                      <AvatarFallback>{((chat.doctorName || chat.studentName || 'U').charAt(0))}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-800">{chat.doctorName || chat.studentName || chat.name}</div>
                      <div className="text-xs text-gray-500">{chat.specialization}</div>
                    </div>
                  </div>
                  {chat.status && <span className={`px-3 py-1 rounded-full text-xs text-white ${chat.status === 'Ongoing' ? 'bg-blue-500' : 'bg-orange-400'}`}>{chat.status}</span>}
                </div>
                <div className="text-sm text-gray-600 mt-1">{chat.lastMessage || chat.message || ''}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md p-4 h-full">
          <div className="flex flex-row justify-end gap-4 items-center mb-4">
            <p className="text-sm text-gray-800">Request an Appointment from {chats.find(c => c.id === selectedChatId)?.doctorName || ''}</p>
            <AppoinmentFormDialog
              studentId={user?.uid}
              studentName={user?.firstName + ' ' + user?.lastName}
              doctorId={selectedChatId}
              doctorName={chats.find(c => c.id === selectedChatId)?.doctorName || ''}
            />
          </div>
          {selectedChatId ? (
            <div className="flex h-fit">
              <Chat chatId={selectedChatId} chatName={chats[0].doctorName || chats[0].studentName || chats[0].name} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">Select a chat to open conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}

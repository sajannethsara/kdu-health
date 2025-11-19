import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useUserStore } from '../../store/UserStore';
import Chat from '../common/Chat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DoctorNotifications from './DoctorNotifications';

export default function DoctorDashboard() {
  const { user, setUser } = useUserStore();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // ensure profile in store
  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;
    if (user && user.uid === currentUid) return;

    (async () => {
      try {
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('uid', '==', currentUid));
        const snap = await getDocs(q);
        if (!snap.empty) setUser({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (err) {
        console.error('Error fetching doctor profile', err);
      }
    })();
  }, [setUser, user]);

  // subscribe to chats where this doctor is the participant
  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) { setChats([]); return; }

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('doctorId', '==', currentUid));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setChats(list);
      setSelectedChatId(prev => (prev ? prev : list.length > 0 ? list[0].id : null));
    }, err => console.error('Doctor chats snapshot error', err));

    return () => unsub();
  }, [auth.currentUser?.uid]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 p-4">
      <header className="bg-white border-b mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">KDU Health — Doctor</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={user?.avatar || auth.currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/44.jpg'} alt="doctor" className="rounded-full w-10 h-10" />
              <div>
                <div className="font-semibold">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{auth.currentUser?.email}</div>
              </div>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost">Notifications</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <DoctorNotifications />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto h-[70vh] px-2">
          <div className="h-full flex gap-6">
            <aside className="w-80 bg-white rounded-lg p-4 flex flex-col h-full overflow-y-auto">
              <div className="mb-3">
                <div className="text-sm text-gray-500">Chats</div>
              </div>

              <div className="space-y-3">
                {chats.length === 0 && <div className="text-sm text-gray-500">No active chats</div>}
                {chats.map(chat => (
                  <div key={chat.id} onClick={() => setSelectedChatId(chat.id)} className={`p-3 rounded-lg cursor-pointer hover:bg-accent transition ${selectedChatId === chat.id ? 'bg-accent' : 'bg-card'} shadow`}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.studentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.studentName || 'Student')}`} />
                        <AvatarFallback>{(chat.studentName || 'S').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{chat.studentName || chat.name}</div>
                        <div className="text-xs text-muted-foreground">{chat.lastMessage || chat.specialization || ''}</div>
                      </div>
                      {chat.status && <div className={`px-2 py-0.5 rounded-full text-xs text-white ${chat.status === 'Ongoing' ? 'bg-blue-500' : 'bg-orange-400'}`}>{chat.status}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            <section className="flex-1 h-full">
              <div className="h-full bg-white rounded-lg shadow p-0">
                {selectedChatId ? (
                  <Chat chatId={selectedChatId} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">Select a chat to view messages</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

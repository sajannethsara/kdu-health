import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
export default function Chat({ chatId: propChatId , chatName} = {}) {
  const location = useLocation();
  // The parent chat document id (e.g. a chat between student and doctor)
  const chatId = propChatId || location.state?.chatId;

  const [chatMeta, setChatMeta] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const user = useUserStore((s) => s.user);
  const role = useUserStore((s) => s.role);

  // Load chat metadata (studentName, avatar, tag, etc.)
  useEffect(() => {
    if (!chatId) return;
    const chatDocRef = doc(db, "chats", chatId);
    let mounted = true;
    getDoc(chatDocRef)
      .then((snap) => {
        if (mounted && snap.exists())
          setChatMeta({ id: snap.id, ...snap.data() });
      })
      .catch((err) => console.error("Failed to load chat meta", err));
    return () => {
      mounted = false;
    };
  }, [chatId]);

  // Subscribe to messages subcollection
  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages(docs);
      },
      (err) => {
        console.error("Messages snapshot error", err);
      }
    );
    return () => unsub();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatId) {
      console.warn("No chatId provided in location.state; cannot send message");
      return;
    }
    const text = input.trim();
    if (!text) return;

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const newMessage = {
        text,
        sender:
          role ||
          (user?.uid === chatMeta?.studentId ? "student" : "doctor") ||
          "doctor",
        timestamp: serverTimestamp(),
      };
      await addDoc(messagesRef, newMessage);

      // update parent chat doc lastMessage/lastMessageAt
      const chatDocRef = doc(db, "chats", chatId);
      await updateDoc(chatDocRef, {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      });

      setInput("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex   flex-col h-140 w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 p-4 rounded-t-lg flex items-center gap-4 border-b">
        <Avatar className="h-12 w-12">
          <AvatarImage src={chatMeta?.studentAvatar || "https://randomuser.me/api/portraits/women/44.jpg"} />
          <AvatarFallback>{(chatName || 'P').charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-xl text-gray-800">
            {chatMeta?.doctorName || "Empty Name"}
          </div>
          <div className="text-sm px-2 py-1 rounded-full bg-gray-200 text-gray-600 inline-block mt-1">
            {chatMeta?.tag || ""}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col h-100 max-h-100 p-4 overflow-y-scroll bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "student" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`bg-blue-100 p-3 rounded-lg max-w-[75%] my-2 text-sm text-gray-800 shadow-sm ${
                msg.sender === "student" ? "self-end" : "self-start"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 flex items-center gap-3 p-3 border-t bg-white">
        <Input
          className="flex-1 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          autoFocus
        />
        <Button variant="ghost" onClick={sendMessage} className="text-blue-600 hover:text-blue-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-7.5-15-7.5v6l10 1.5-10 1.5v6z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}

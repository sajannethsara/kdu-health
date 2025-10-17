import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const initialMessages = [
  { id: 1, text: 'Hello Doctor, I have a stomach pain.', sender: 'student' },
  { id: 2, text: 'Hi Maneesha, can you describe your symptoms?', sender: 'doctor' },
  { id: 3, text: 'It started this morning and feels sharp.', sender: 'student' },
  { id: 4, text: 'Do you have any other symptoms?', sender: 'doctor' },
];

export default function Chat() {
  const location = useLocation();
  const patient = location.state?.patient || 'Maneesha Thathsarani';
  const avatar = location.state?.avatar || 'https://randomuser.me/api/portraits/women/44.jpg';
  const tag = location.state?.tag || '#stomach pain';
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now(), text: input, sender: 'doctor' }]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="bg-blue-100 p-4 rounded-t-xl flex items-center gap-3">
        <img src={avatar} alt={patient} className="rounded-full w-10 h-10" />
        <div>
          <div className="font-semibold text-lg text-blue-900">{patient}</div>
          <div className="bg-gray-100 text-sm px-2 py-1 rounded-full text-gray-700 inline-block mt-1">{tag}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`bg-blue-200 p-3 rounded-xl max-w-[75%] my-2 text-sm text-gray-800 ${
                msg.sender === 'student' ? 'self-end' : 'self-start'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-3 p-3 border-t bg-gray-100">
        <input
          className="flex-1 bg-white p-2 rounded-full outline-none text-sm border border-gray-300"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-500"
          onClick={sendMessage}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6l10 1.5-10 1.5v6z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

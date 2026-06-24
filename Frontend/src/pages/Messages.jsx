import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Info, Image as ImageIcon, Smile, ChevronLeft } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const socketRef = useRef();

  useEffect(() => {
    // Connect Socket
    socketRef.current = io('http://localhost:3000');
    if (user) {
      socketRef.current.emit('join_user_room', user._id);
    }

    socketRef.current.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Fetch conversations
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };
    fetchConversations();

    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!activeChat) return;
    
    socketRef.current.emit('join_conversation', activeChat._id);
    
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages/${activeChat._id}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeChat) return;

    try {
      const res = await api.post(`/chat/messages/${activeChat._id}`, {
        text: messageText,
        receiverId: activeChat.participants.find(p => p._id !== user._id)._id
      });
      
      const newMsg = res.data;
      // Socket emission is handled by backend, but we can optimistically update
      setMessages((prev) => [...prev, newMsg]);
      setMessageText('');
      
      // Also emit via socket manually if backend expects it (based on server.js)
      socketRef.current.emit('send_message', newMsg);
      
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px-64px)] md:h-screen -mx-4 md:-mx-8 overflow-hidden relative">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-80 border-r border-border flex-col bg-dark ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id !== user._id) || {};
            return (
              <div 
                key={conv._id} 
                onClick={() => setActiveChat(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeChat?._id === conv._id ? 'bg-white/5' : 'hover:bg-white/5'}`}
              >
                <Avatar src={otherUser.profilePic} size="md" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-white truncate">{otherUser.username}</p>
                  <p className="text-sm truncate text-gray-500">{conv.lastMessage?.text || 'Started a conversation'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex-col bg-dark/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between glass z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)} 
                  className="md:hidden p-1 -ml-2 text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <Avatar src={activeChat.participants.find(p => p._id !== user._id)?.profilePic} size="md" />
                <div>
                  <p className="text-white font-bold">{activeChat.participants.find(p => p._id !== user._id)?.username}</p>
                  <p className="text-xs text-primary">Online</p>
                </div>
              </div>
              <div className="flex gap-4 text-gray-400">
                <Phone className="w-5 h-5 hover:text-white cursor-pointer" />
                <Video className="w-5 h-5 hover:text-white cursor-pointer" />
                <Info className="w-5 h-5 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isMe = msg.sender === user._id;
                return (
                  <div key={msg._id} className={`flex flex-col max-w-[70%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`p-3 rounded-2xl ${isMe ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm' : 'glass text-white rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="p-4 glass border-t border-border mt-auto">
              <div className="flex items-center gap-4 bg-card rounded-full px-4 py-2 border border-border focus-within:border-primary transition-colors">
                <button className="text-gray-400 hover:text-white"><Smile className="w-5 h-5" /></button>
                <input 
                  type="text" 
                  placeholder="Message..." 
                  className="flex-1 bg-transparent text-white focus:outline-none"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="text-gray-400 hover:text-white"><ImageIcon className="w-5 h-5" /></button>
                <button 
                  onClick={handleSendMessage}
                  className={`${messageText ? 'text-primary' : 'text-gray-600'} transition-colors`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;

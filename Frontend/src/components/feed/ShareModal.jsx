import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Search, CheckCircle2 } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../api/axios';

const ShareModal = ({ post, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/search?query=${searchQuery}`);
        
        // Don't show ourselves in the share list
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUsers(res.data.filter(u => u._id !== decoded.id));
        } else {
          setUsers(res.data);
        }
      } catch (err) {
        console.error('Failed to search users', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleUser = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleSend = async () => {
    if (selectedUserIds.length === 0) return;
    
    setSending(true);
    try {
      // For each selected user, create a conversation and send the message
      const sendPromises = selectedUserIds.map(async (targetUserId) => {
        // 1. Get or create conversation
        const convRes = await api.post(`/chat/conversation/${targetUserId}`);
        const conversationId = convRes.data._id;
        
        // 2. Send the message containing the post image link and caption
        const messageText = `Shared a post:\\n${post.image}\\n${post.caption || ''}`;
        await api.post(`/chat/message/${conversationId}`, { text: messageText });
      });

      await Promise.all(sendPromises);
      onClose();
      // Optional: you could add a toast notification here
    } catch (err) {
      console.error('Failed to send post', err);
      alert('Failed to send post. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center sm:items-center bg-black/80">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full sm:max-w-md bg-dark rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl border border-border h-[80vh] sm:h-[60vh] overflow-hidden"
      >
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-dark">
          <h2 className="text-white font-bold text-lg">Share Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border bg-dark">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search users..."
              className="w-full bg-card text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none border border-border focus:border-primary transition-colors"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
          {loading ? (
            <div className="text-center text-gray-500 py-8 text-sm">Searching...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">No users found</div>
          ) : (
            users.map(user => {
              const isSelected = selectedUserIds.includes(user._id);
              return (
                <div 
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                    <Avatar src={user.profilePic} size="md" />
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-sm">{user.name || user.username}</span>
                      <span className="text-gray-500 text-xs">@{user.username}</span>
                    </div>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-600'}`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {selectedUserIds.length > 0 && (
          <div className="p-4 border-t border-border bg-dark flex flex-col gap-3">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? 'Sending...' : `Send to ${selectedUserIds.length} ${selectedUserIds.length === 1 ? 'user' : 'users'}`}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShareModal;

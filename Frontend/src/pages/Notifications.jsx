import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, UserPlus, Check, X } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import api from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notifRes, pendingRes] = await Promise.all([
          api.get('/notifications'),
          api.get('/follow/pending')
        ]);
        setNotifications(notifRes.data);
        setPendingRequests(pendingRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRequest = async (requestId, action) => {
    try {
      await api.post(`/follow/${action}/${requestId}`);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  return (
    <div className="pt-6 px-4 md:px-8 pb-20 md:pb-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Notifications</h1>

      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Follow Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req._id} className="flex items-center justify-between glass p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <Avatar src={req.sender?.profilePic} size="md" />
                  <div>
                    <p className="text-white text-sm font-semibold">{req.sender?.username}</p>
                    <p className="text-gray-400 text-xs">{req.sender?.name}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" className="px-3 py-1.5 h-auto text-sm" onClick={() => handleRequest(req._id, 'accept')}>
                    Accept
                  </Button>
                  <Button variant="secondary" className="px-3 py-1.5 h-auto text-sm" onClick={() => handleRequest(req._id, 'reject')}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent</h2>
        <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">You have no notifications yet.</div>
        ) : notifications.map(notif => (
          <div key={notif._id} className="flex items-center justify-between glass p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar src={notif.fromUser?.profilePic} size="md" />
                <div className="absolute -bottom-1 -right-1 bg-dark rounded-full p-1">
                  {notif.type === 'like' && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                  {notif.type === 'comment' && <MessageCircle className="w-3 h-3 text-blue-500 fill-blue-500" />}
                  {notif.type === 'follow' && <UserPlus className="w-3 h-3 text-primary" />}
                </div>
              </div>
              
              <div>
                <p className="text-white text-sm">
                  <span className="font-semibold">{notif.fromUser?.username}</span>
                  {notif.type === 'like' && ' liked your post.'}
                  {notif.type === 'comment' && ` commented on your post.`}
                  {notif.type === 'follow' && ' started following you.'}
                </p>
              </div>
            </div>

            {notif.type === 'follow' ? (
              <Button variant="secondary" className="px-4 py-1.5 text-sm h-auto">
                Following
              </Button>
            ) : (
              notif.post && <img src={notif.post.image} alt="Post" className="w-12 h-12 object-cover rounded-md" />
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Grid, Bookmark, List, Heart, MessageCircle, Send, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import UserListModal from '../components/profile/UserListModal';
import api from '../api/axios';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMe, setIsMe] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '', website: '' });
  const [editFile, setEditFile] = useState(null);
  const fileInputRef = useRef(null);

  // Modal State
  const [showListModal, setShowListModal] = useState(null); // 'followers' or 'followings'
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        
        const targetId = id || decoded.id;
        const isMeTarget = decoded.id === targetId;
        setIsMe(isMeTarget);

        const [profileRes, postsRes, savedRes] = await Promise.all([
          api.get(`/users/${targetId}`),
          api.get(`/posts/user/${targetId}`),
          isMeTarget ? api.get('/saved') : Promise.resolve({ data: [] })
        ]);
        
        setProfile(profileRes.data);
        setIsFollowing(profileRes.data.isFollowing || false);
        setEditForm({
          name: profileRes.data.name || '',
          bio: profileRes.data.bio || '',
          website: profileRes.data.website || ''
        });
        setPosts(postsRes.data);
        if (isMeTarget) setSavedPosts(savedRes.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleMessage = async () => {
    try {
      await api.post(`/chat/conversation/${profile._id}`);
      navigate('/messages');
    } catch (error) {
      console.error("Failed to start conversation", error);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(`/follow/request/${profile._id}`);
      alert("Follow request sent!");
    } catch (error) {
      console.error("Failed to send follow request", error);
      alert(error.response?.data?.message || "Failed to follow");
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/follow/unfollow/${profile._id}`);
      setIsFollowing(false);
      setProfile(prev => ({ ...prev, followersCount: Math.max(0, prev.followersCount - 1) }));
    } catch (error) {
      console.error("Failed to unfollow", error);
      alert("Failed to unfollow");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('bio', editForm.bio);
      formData.append('website', editForm.website);
      if (editFile) formData.append('profilePic', editFile);

      const res = await api.put('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data.user);
      setIsEditing(false);
      setEditFile(null);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleShowList = async (type) => {
    try {
      const targetId = id || profile._id;
      const res = await api.get(`/follow/${type}/${targetId}`);
      // The API returns an array of follower objects { follower: {...user} } OR following objects { user: {...user} }
      const users = res.data.map(item => type === 'followers' ? item.follower : item.user);
      setListData(users);
      setShowListModal(type);
    } catch (error) {
      console.error(`Failed to fetch ${type}`, error);
    }
  };

  if (loading || !profile) return <div className="text-white text-center pt-20">Loading profile...</div>;

  return (
    <div className="">
      {/* Cover Photo */}
      <div className="h-48 md:h-64 w-full relative">
        <img src={profile.coverPic || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'} alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-8 -mt-16 relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <Avatar src={profile.profilePic} size="xl" className="border-4 border-dark" />
          
          <div className="flex gap-3">
            {isMe ? (
              <>
                <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button variant="secondary" className="px-3" onClick={() => navigate('/settings')}>
                  <Settings className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                {isFollowing ? (
                  <Button variant="secondary" onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button variant="primary" onClick={handleFollow}>Follow</Button>
                )}
                <Button variant="secondary" onClick={handleMessage}>
                  <Send className="w-5 h-5 mr-2" /> Message
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{profile.name || profile.username}</h1>
          <p className="text-gray-400">@{profile.username}</p>
          
          <p className="mt-4 text-white whitespace-pre-wrap">{profile.bio}</p>
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary hover:underline mt-2 inline-block">
              {profile.website}
            </a>
          )}
        </div>

        <div className="flex gap-6 border-y border-border py-4 mb-6">
          <div className="text-center flex-1 md:flex-none">
            <span className="block font-bold text-white text-xl">{posts.length}</span>
            <span className="text-gray-400 text-sm">Posts</span>
          </div>
          <div 
            className="text-center flex-1 md:flex-none cursor-pointer hover:opacity-80"
            onClick={() => handleShowList('followers')}
          >
            <span className="block font-bold text-white text-xl">{profile.followersCount || 0}</span>
            <span className="text-gray-400 text-sm">Followers</span>
          </div>
          <div 
            className="text-center flex-1 md:flex-none cursor-pointer hover:opacity-80"
            onClick={() => handleShowList('followings')}
          >
            <span className="block font-bold text-white text-xl">{profile.followingCount || 0}</span>
            <span className="text-gray-400 text-sm">Following</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button 
            onClick={() => setActiveTab('posts')}
            className={`flex-1 flex justify-center py-4 border-b-2 transition-colors ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            <Grid className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex-1 flex justify-center py-4 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-white'}`}
          >
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {(activeTab === 'posts' ? posts : savedPosts).map((post) => (
            <motion.div 
              key={post._id}
              whileHover={{ scale: 0.98 }}
              className="aspect-square bg-card overflow-hidden cursor-pointer rounded-sm md:rounded-xl relative group"
            >
              <img src={post.image} alt="Post" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white font-bold"><Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : 'fill-white'}`} /> {post.likesCount || 0}</div>
                <div className="flex items-center gap-1 text-white font-bold"><MessageCircle className="w-5 h-5 fill-white" /> {post.commentsCount || 0}</div>
              </div>
            </motion.div>
          ))}
          {activeTab === 'saved' && savedPosts.length === 0 && (
             <div className="col-span-3 text-center text-gray-500 py-10">No saved posts yet.</div>
          )}
          {activeTab === 'posts' && posts.length === 0 && (
             <div className="col-span-3 text-center text-gray-500 py-10">No posts yet.</div>
          )}
        </div>

      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-2xl p-6 border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar src={editFile ? URL.createObjectURL(editFile) : profile.profilePic} size="xl" />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setEditFile(e.target.files[0])}
                  />
                  <span className="text-sm text-primary cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
                    Change Profile Photo
                  </span>
                </div>

                <Input 
                  placeholder="Name" 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                />
                
                <div className="glass rounded-xl p-3">
                  <textarea 
                    placeholder="Bio" 
                    className="w-full bg-transparent text-white focus:outline-none resize-none min-h-[100px]"
                    value={editForm.bio}
                    onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  />
                </div>

                <Input 
                  placeholder="Website" 
                  value={editForm.website} 
                  onChange={e => setEditForm({...editForm, website: e.target.value})} 
                />

                <Button variant="primary" fullWidth type="submit" className="mt-6">
                  Save Changes
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Followers / Following List Modal */}
      <AnimatePresence>
        {showListModal && (
          <UserListModal 
            title={showListModal === 'followers' ? 'Followers' : 'Following'}
            users={listData}
            onClose={() => setShowListModal(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;

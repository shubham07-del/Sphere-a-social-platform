import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import ShareModal from './ShareModal';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showHeart, setShowHeart] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const navigate = useNavigate();
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  };

  useEffect(() => {
    if (isCommentsOpen) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const res = await api.get(`/comments/${post._id}`);
          setComments(res.data);
        } catch (err) {
          console.error("Failed to fetch comments", err);
        } finally {
          setLoadingComments(false);
        }
      };
      fetchComments();
    }
  }, [isCommentsOpen, post._id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/comments/${post._id}`, { text: commentText });
      // Add new comment to local state
      // We need to populate the user for the local state so it looks right
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const newComment = {
        ...res.data.comment,
        user: { _id: decoded.id, username: decoded.username } // approximate
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setCommentsCount(prev => prev + 1);
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDoubleTap = async () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount(prev => prev + 1);
      try {
        await api.post(`/likes/${post._id}`);
      } catch (err) {
        console.error('Failed to like post:', err);
      }
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const toggleLike = async () => {
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);
    
    try {
      await api.post(`/likes/${post._id}`);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setIsLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  const toggleSave = async () => {
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    try {
      await api.post(`/saved/${post._id}`);
    } catch (err) {
      console.error('Failed to toggle save:', err);
      setIsSaved(wasSaved);
    }
  };

  return (
    <div className="glass rounded-2xl mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(`/profile/${post.user?._id}`)}
        >
          <Avatar src={post.user?.profilePic} size="md" />
          <div>
            <h3 className="font-semibold text-white">{post.user?.username}</h3>
            <p className="text-xs text-gray-400">{getTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Image */}
      <div 
        className="relative w-full aspect-square bg-black cursor-pointer"
        onDoubleClick={handleDoubleTap}
      >
        <img 
          src={post.image} 
          alt="Post" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Double tap heart animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: '-50%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1.5, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.8, y: '-50%', x: '-50%' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={toggleLike}
              className={isLiked ? "text-red-500" : "text-white"}
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <button className="text-white hover:text-gray-300 transition-colors">
              <MessageCircle className="w-7 h-7" />
            </button>
            <button 
              onClick={() => setIsShareOpen(true)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Send className="w-7 h-7" />
            </button>
          </div>
          <button 
            onClick={toggleSave}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current text-white' : ''}`} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-white mb-2">{likesCount} likes</p>

        {/* Caption */}
        <p className="text-white mb-2">
          <span 
            className="font-semibold mr-2 cursor-pointer hover:underline"
            onClick={() => navigate(`/profile/${post.user?._id}`)}
          >
            {post.user?.username}
          </span>
          {post.caption}
        </p>

        {/* Comments Link */}
        {commentsCount > 0 ? (
          <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="text-gray-400 text-sm hover:text-gray-300">
            {isCommentsOpen ? 'Hide comments' : `View all ${commentsCount} comments`}
          </button>
        ) : (
          <button onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="text-gray-400 text-sm hover:text-gray-300">
            Be the first to comment
          </button>
        )}
      </div>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsCommentsOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border border-border overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-border bg-dark/50">
                <h3 className="text-lg font-bold text-white">Comments</h3>
                <button onClick={() => setIsCommentsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="p-4 flex-1 overflow-y-auto space-y-5 hide-scrollbar">
                {loadingComments ? (
                  <p className="text-gray-500 text-center text-sm py-4">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-center text-sm py-4">No comments yet. Be the first!</p>
                ) : (
                  comments.map(c => (
                    <div key={c._id} className="flex gap-3">
                      <Avatar src={c.user?.profilePic} size="md" />
                      <div>
                        <p className="text-white text-sm">
                          <span className="font-semibold mr-2">{c.user?.username}</span>
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Comment Form */}
              <form onSubmit={handleAddComment} className="p-4 border-t border-border bg-dark/50 flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!commentText.trim()} 
                  className={`text-sm font-semibold transition-colors ${commentText.trim() ? 'text-primary' : 'text-gray-600'}`}
                >
                  Post
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareOpen && (
          <ShareModal post={post} onClose={() => setIsShareOpen(false)} />
        )}
      </AnimatePresence>

    </div>
  );
};

export default PostCard;

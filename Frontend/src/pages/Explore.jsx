import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Heart, MessageCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import api from '../api/axios';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await api.get('/posts/explore');
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch explore posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);
  return (
    <div className="pt-6 px-4 md:px-8 pb-20 md:pb-6">
      <div className="mb-8">
        <Input icon={SearchIcon} placeholder="Search for people, tags, or places..." />
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar pb-2">
        {['Trending', 'Photography', 'Art', 'Travel', 'Technology', 'Style'].map(tag => (
          <button key={tag} className="glass px-6 py-2 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors">
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry-like Grid */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading explore feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No posts found to explore.</div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {posts.map((post, i) => (
            <motion.div 
              key={post._id}
              whileHover={{ scale: 0.98 }}
              className={`bg-card overflow-hidden cursor-pointer relative group ${i % 5 === 0 ? 'row-span-2' : ''}`}
            >
              <img src={post.image} alt="Explore" className="w-full h-full object-cover aspect-square" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white font-bold"><Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : 'fill-white'}`} /> {post.likesCount || 0}</div>
                <div className="flex items-center gap-1 text-white font-bold"><MessageCircle className="w-5 h-5 fill-white" /> {post.commentsCount || 0}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;

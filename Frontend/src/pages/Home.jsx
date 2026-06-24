import React, { useState, useEffect, useRef } from 'react';
import StoryCard from '../components/feed/StoryCard';
import PostCard from '../components/feed/PostCard';
import PageWrapper from '../components/layout/PageWrapper';
import api from '../api/axios';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingStory, setUploadingStory] = useState(false);
  const storyInputRef = useRef(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [postsRes, storiesRes] = await Promise.all([
          api.get('/posts/feed'),
          api.get('/stories/feed')
        ]);
        setPosts(postsRes.data);
        setStories(storiesRes.data);
      } catch (error) {
        console.error("Failed to fetch feed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingStory(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      await api.post('/stories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Refresh stories
      const storiesRes = await api.get('/stories/feed');
      setStories(storiesRes.data);
    } catch (error) {
      console.error("Failed to upload story:", error);
    } finally {
      setUploadingStory(false);
      if (storyInputRef.current) storyInputRef.current.value = '';
    }
  };

  if (loading) {
    return <PageWrapper><div className="pt-20 text-center text-white">Loading feed...</div></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="pt-6 px-4 md:px-8 pb-20 md:pb-6">
        
        {/* Stories Section */}
        <div className="mb-8 overflow-x-auto pb-4 pt-2 hide-scrollbar flex w-full">
          <div className="flex gap-4 min-w-max items-center">
            <div className="relative">
              <StoryCard 
                isAdd={true} 
                user={{ profilePic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' }} 
                onClick={() => storyInputRef.current?.click()}
              />
              {uploadingStory && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center -top-2 h-[72px]">
                  <span className="text-white text-xs">...</span>
                </div>
              )}
              <input 
                type="file" 
                ref={storyInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleStoryUpload} 
              />
            </div>
            {stories.map(story => (
              <StoryCard key={story._id} user={story.user} />
            ))}
          </div>
        </div>

        {/* Feed Section */}
        <div className="max-w-xl mx-auto flex flex-col gap-8">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        
      </div>
    </PageWrapper>
  );
};

export default Home;

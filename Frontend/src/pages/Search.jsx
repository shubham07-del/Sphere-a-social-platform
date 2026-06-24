import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/users/search?query=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Failed to search", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="pt-6 px-4 md:px-8 pb-20 md:pb-6 max-w-2xl mx-auto">
      <div className="mb-8 relative">
        <Input 
          icon={SearchIcon} 
          placeholder="Search..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            onClick={() => setQuery('')}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!query && (
        <div className="text-center text-gray-500 mt-20">
          Start typing to search for users...
        </div>
      )}

      {query && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Results</h2>
          {loading ? (
            <div className="text-center text-gray-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="text-center text-gray-500">No users found for "{query}".</div>
          ) : (
            results.map(user => (
              <div 
                key={user._id} 
                onClick={() => navigate(`/profile/${user._id}`)}
                className="flex items-center justify-between cursor-pointer glass p-3 rounded-xl hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={user.profilePic} size="md" />
                  <div>
                    <p className="text-white font-medium">{user.username}</p>
                    <p className="text-gray-400 text-sm">{user.name}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

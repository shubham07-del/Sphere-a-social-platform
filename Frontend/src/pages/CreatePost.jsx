import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image as ImageIcon, MapPin, Smile, X } from 'lucide-react';
import Button from '../components/ui/Button';
import api from '../api/axios';

const CreatePost = () => {
  const [dragActive, setDragActive] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = function(e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to create post', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 px-4 md:px-8 pb-20 md:pb-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Create New Post</h1>

      <div className="glass rounded-3xl p-6">
        {/* Drag and Drop Zone */}
        {!preview ? (
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors mb-6 cursor-pointer ${
              dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleChange} 
            />
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-white mb-2">Drag photos and videos here</p>
            <p className="text-gray-400 mb-6">SVG, PNG, JPG or GIF (max. 10MB)</p>
            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Select from computer</Button>
          </div>
        ) : (
          <div className="relative mb-6 rounded-2xl overflow-hidden aspect-square bg-black">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={removeFile}
              className="absolute top-4 right-4 bg-dark/80 text-white p-2 rounded-full hover:bg-dark transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Caption Area */}
        <div className="mb-6">
          <textarea
            className="w-full bg-card border border-border text-white rounded-xl px-4 py-3 placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none min-h-[120px]"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <div className="flex justify-between items-center mt-2 px-2">
            <div className="flex gap-4 text-gray-400">
              <button className="hover:text-white transition-colors"><Smile className="w-5 h-5" /></button>
              <button className="hover:text-white transition-colors"><MapPin className="w-5 h-5" /></button>
            </div>
            <span className="text-sm text-gray-500">{caption.length}/2200</span>
          </div>
        </div>

        <Button fullWidth onClick={handleSubmit} disabled={!file || loading}>
          {loading ? 'Sharing...' : 'Share Post'}
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;

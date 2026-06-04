import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaImage, FaTimes, FaFeather } from 'react-icons/fa';
import Avatar from '../../components/ui/Avatar';
const COMMUNITY_CATEGORIES = [
  'General',
  'Crop Tips',
  'Pest Control',
  'Soil Health',
  'Equipment',
  'Success Stories',
];

export default function CreatePost({ onSubmit, user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [imagePreview, setImagePreview] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const fileRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      image: imagePreview || null,
      author: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous',
      avatar: user?.user_metadata?.avatar_url || null,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
    };

    onSubmit(newPost);
    setTitle('');
    setContent('');
    setCategory('General');
    setImagePreview(null);
    setIsFocused(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            name={user?.user_metadata?.full_name || user?.email}
            src={user?.user_metadata?.avatar_url}
            size="sm"
          />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest User'}
            </h3>
            {/* Category select */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 px-2 py-1 text-xs rounded-lg bg-white/5 border border-white/10 text-text-secondary focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
            >
              {COMMUNITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Post title..."
            className="w-full px-0 py-2 text-base font-semibold bg-transparent border-b border-white/10 text-text-primary placeholder-text-secondary/40 focus:outline-none focus:border-emerald-500/40 transition-colors"
            maxLength={120}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Share your thoughts, tips, or experiences..."
            rows={isFocused || content ? 4 : 2}
            className="w-full px-0 py-1 text-sm bg-transparent text-text-secondary placeholder-text-secondary/40 focus:outline-none resize-none transition-all"
            maxLength={2000}
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-400 transition-colors"
                aria-label="Remove image"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          )}

          {/* Actions */}
          {(isFocused || title || content) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between pt-2 border-t border-white/5"
            >
              <div className="flex gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="post-image-upload"
                />
                <label
                  htmlFor="post-image-upload"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/10 cursor-pointer text-sm transition-colors"
                >
                  <FaImage className="text-sm" />
                  Photo
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setContent('');
                    setImagePreview(null);
                    setIsFocused(false);
                    if (fileRef.current) fileRef.current.value = '';
                  }}
                  className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-white/10 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`flex items-center gap-1.5 px-5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isValid
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-white active:scale-95'
                      : 'bg-white/5 text-text-secondary/40 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <FaFeather className="text-xs" />
                  Post
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
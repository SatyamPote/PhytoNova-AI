import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaClock } from 'react-icons/fa';
import Avatar from '../../components/ui/Avatar';

function formatTimestamp(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [commentOpen, setCommentOpen] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="backdrop-blur-md bg-white/8 border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar name={post.author} src={post.avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">{post.author}</p>
          <p className="text-xs text-text-secondary flex items-center gap-1">
            <FaClock className="text-[10px]" />
            {formatTimestamp(post.createdAt)}
          </p>
        </div>
        {post.category && (
          <span className="px-2.5 py-0.5 text-xs rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 font-medium">
            {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pb-3 space-y-2">
        <h3 className="text-base font-bold text-text-primary">{post.title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 pb-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-56 object-cover rounded-xl"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-4 pb-4 border-t border-white/5 pt-3">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            liked
              ? 'bg-red-500/15 text-red-400 border border-red-500/20'
              : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
          }`}
        >
          <FaHeart className={`text-sm ${liked ? 'fill-current' : ''}`} />
          {likeCount}
        </button>
        <button
          onClick={() => setCommentOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            commentOpen
              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
              : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
          }`}
        >
          <FaComment className="text-sm" />
          {comments.length}
        </button>
      </div>

      {/* Comments */}
      {commentOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 pb-4 space-y-3 overflow-hidden"
        >
          <div className="border-t border-white/5 pt-3 space-y-3">
            {comments.length === 0 ? (
              <p className="text-xs text-text-secondary text-center py-2">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <Avatar name={comment.author} size="xs" />
                  <div className="flex-1 bg-white/5 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-text-primary">{comment.author}</span>
                      <span className="text-[10px] text-text-secondary">{formatTimestamp(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-text-secondary">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
            {/* Add comment input */}
            <div className="flex gap-2.5">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-text-primary placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const newComment = {
                        author: 'You',
                        text: e.target.value.trim(),
                        createdAt: new Date().toISOString(),
                      };
                      setComments((prev) => [newComment, ...prev]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 border border-emerald-500/30 text-sm font-medium transition-colors"
                  onClick={(e) => {
                    const input = e.target.closest('div').querySelector('input');
                    if (input && input.value.trim()) {
                      const newComment = {
                        author: 'You',
                        text: input.value.trim(),
                        createdAt: new Date().toISOString(),
                      };
                      setComments((prev) => [newComment, ...prev]);
                      input.value = '';
                    }
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.article>
  );
}
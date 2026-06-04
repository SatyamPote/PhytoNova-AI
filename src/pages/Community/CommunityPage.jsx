import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaUsers, FaComment, FaFeather } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const MOCK_POSTS = [
  {
    id: 'mock-001',
    title: 'My experience with neem oil for aphid control',
    content:
      'I have been using neem oil extract on my tomato plants for the past three weeks and the results are amazing. The aphid population dropped by 90% within the first week. Here is what I learned: mix 2ml per liter, spray in the evening, and repeat every 5 days.',
    category: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&q=80',
    author: 'Priya Farmer',
    avatar: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 14,
    liked: false,
    comments: [
      {
        author: 'Raj Patel',
        text: 'Great tips! Which brand of neem oil did you use?',
        createdAt: new Date(Date.now() - 3000000).toISOString(),
      },
      {
        author: 'Priya Farmer',
        text: 'I used the cold-pressed organic neem oil from a local supplier.',
        createdAt: new Date(Date.now() - 2500000).toISOString(),
      },
    ],
  },
  {
    id: 'mock-002',
    title: 'How I increased my yield by 40% using mycorrhizae',
    content:
      'After adding mycorrhizae inoculant to my soil last season, I noticed a dramatic improvement in root development and water uptake. My chili peppers went from an average of 2kg per plant to nearly 3kg. The key is to apply it at the root zone during transplanting.',
    category: 'Success Stories',
    image: null,
    author: 'Suresh Green',
    avatar: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    likes: 28,
    liked: false,
    comments: [
      {
        author: 'Anita Devi',
        text: 'This is very inspiring! Did you notice any difference in soil texture?',
        createdAt: new Date(Date.now() - 70000000).toISOString(),
      },
    ],
  },
  {
    id: 'mock-003',
    title: 'Best practices for composting in the monsoon season',
    content:
      'Monsoon brings extra moisture which can ruin a compost pile if not managed properly. Here are my top three tips: (1) Cover the pile with a tarp, leaving gaps for airflow. (2) Turn the compost more frequently to prevent anaerobic conditions. (3) Balance greens and browns 1:3 ratio even with extra rain.',
    category: 'Soil Health',
    image: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&q=80',
    author: 'Meera Compost',
    avatar: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    likes: 21,
    liked: false,
    comments: [],
  },
  {
    id: 'mock-004',
    title: 'Switched to copper fungicide — results after 2 weeks',
    content:
      'My grape vines were suffering from powdery mildew. After two applications of copper fungicide spaced 10 days apart, the infection cleared up significantly. Important: spray during dry weather and avoid overuse to prevent copper buildup in soil.',
    category: 'Crop Tips',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
    author: 'Vijay Kumar',
    avatar: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    likes: 11,
    liked: false,
    comments: [
      {
        author: 'Lakshmi',
        text: 'How long did you wait after spraying before harvesting?',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ],
  },
  {
    id: 'mock-005',
    title: 'Building a simple DIY drip irrigation system',
    content:
      'I set up a drip irrigation system for my small farm using PVC pipes, micro-tubing, and a basic timer. Total cost was under $50 and I saved 60% on water compared to manual watering. Happy to share the detailed steps and parts list with anyone interested.',
    category: 'Equipment',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80',
    author: 'Arun Tools',
    avatar: null,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    likes: 37,
    liked: false,
    comments: [
      {
        author: 'Sunita',
        text: 'Please share the parts list! I am planning the same setup.',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
      {
        author: 'Ramesh',
        text: 'Would love a diagram or video tutorial if possible.',
        createdAt: new Date(Date.now() - 86400000 * 5.5).toISOString(),
      },
    ],
  },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          const postIds = data.map((p) => p.id);

          // Fetch comment counts per post
          const { data: commentRows } = await supabase
            .from('comments')
            .select('post_id')
            .in('post_id', postIds);
          const commentCounts = {};
          (commentRows || []).forEach((r) => {
            commentCounts[r.post_id] = (commentCounts[r.post_id] || 0) + 1;
          });

          // Fetch like counts per post
          const { data: likeRows } = await supabase
            .from('likes')
            .select('post_id')
            .in('post_id', postIds);
          const likeCounts = {};
          (likeRows || []).forEach((r) => {
            likeCounts[r.post_id] = (likeCounts[r.post_id] || 0) + 1;
          });

          const mapped = data.map((p) => ({
            ...p,
            createdAt: p.created_at,
            likes: likeCounts[p.id] || 0,
            liked: false,
            comments: Array(commentCounts[p.id] || 0).fill(null),
          }));
          setPosts(mapped);
          return;
        }
      }
      setPosts(MOCK_POSTS);
    };
    fetchPosts();
  }, []);

  const handleNewPost = async (newPost) => {
    if (supabase && user) {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: newPost.title,
          content: newPost.content,
          author: newPost.author,
          category: newPost.category,
          image_url: newPost.image || null,
          user_id: user.id,
        })
        .select()
        .single();
      if (!error && data) {
        setPosts((prev) => [{ ...data, createdAt: data.created_at, likes: 0, liked: false, comments: [] }, ...prev]);
        return;
      }
    }
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-cyan-900/20 to-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <FaUsers className="text-cyan-400 text-xl" />
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">Community</h1>
          </div>
          <p className="text-text-secondary">
            Connect with fellow farmers, share experiences, and learn best practices from the PhytoNova community.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Create Post */}
        <CreatePost onSubmit={handleNewPost} user={user} />

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <FaComment className="text-xs text-cyan-400" />
            {posts.length} posts
          </span>
          <span className="flex items-center gap-1.5">
            <FaFeather className="text-xs text-emerald-400" />
            {posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)} comments
          </span>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
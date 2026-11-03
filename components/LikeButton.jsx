'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function LikeButton({ quoteId, initialLikes, initialLikedByMe, size = 13 }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [likedByMe, setLikedByMe] = useState(Boolean(initialLikedByMe));
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); // prevent card link navigation
    e.stopPropagation();

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }
    if (loading || !quoteId) return;

    // Optimistic update
    const wasLiked = likedByMe;
    setLikedByMe(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const res = await fetch(`/api/quotes/${quoteId}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      // Sync with server truth
      setLikes(data.likes);
      setLikedByMe(data.likedByMe);
      // Invalidate so list views also refresh
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    } catch {
      // Rollback on error
      setLikedByMe(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      title={isSignedIn ? (likedByMe ? 'Unlike' : 'Like') : 'Sign in to like'}
      className={`flex items-center gap-1 transition-colors select-none ${
        likedByMe ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart
        size={size}
        className={`transition-transform ${likedByMe ? 'fill-red-500 scale-110' : ''}`}
      />
      <span>{likes}</span>
    </button>
  );
}

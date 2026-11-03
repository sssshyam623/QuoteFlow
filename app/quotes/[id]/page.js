'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AddQuoteForm from '@/components/AddQuoteForm';
import LikeButton from '@/components/LikeButton';
import ShareButton from '@/components/ShareButton';
import { useAuth } from '@/context/AuthContext';

const tagColors = {
  Motivation: 'bg-purple-100 text-purple-700',
  Life: 'bg-green-100 text-green-700',
  Inspiration: 'bg-blue-100 text-blue-700',
  Success: 'bg-yellow-100 text-yellow-700',
};

const authorBios = {
  'Steve Jobs': 'Co-founder of Apple Inc. He was a pioneer in the personal computer revolution.',
  'Confucius': 'Chinese philosopher and politician of the Spring and Autumn period.',
  'Mahatma Gandhi': 'Leader of the Indian independence movement against British rule.',
  'Albert Einstein': 'Theoretical physicist who developed the theory of relativity.',
};

export default function QuoteDetailPage({ params }) {
  const [showForm, setShowForm] = useState(false);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then((r) => r.json())
      .then((d) => setQuote(d.quote))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Delete this quote?')) return;
    setDeleting(true);
    await fetch(`/api/quotes/${params.id}`, { method: 'DELETE' });
    window.location.href = '/quotes';
  };

  if (loading) {
    return (
      <>
        <Navbar onAddQuote={() => setShowForm(true)} />
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-48 h-6 bg-gray-100 rounded animate-pulse mx-auto" />
        </div>
      </>
    );
  }

  if (!quote) return (
    <>
      <Navbar onAddQuote={() => setShowForm(true)} />
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Quote not found.</p>
        <Link href="/quotes" className="text-primary text-sm hover:underline mt-2 block">← Back to Quotes</Link>
      </div>
    </>
  );

  const initials = quote.author.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const isOwner = userId && quote.createdBy === userId;

  return (
    <>
      <Navbar onAddQuote={() => setShowForm(true)} />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <Link href="/quotes" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Quotes
        </Link>
        <div className="bg-white rounded-2xl border border-gray-100 p-7 mb-5">
          <div className="flex items-start justify-between mb-4">
            <span className="text-5xl text-primary font-bold leading-none">"</span>
            <div className="flex items-center gap-3 text-gray-400">
              <LikeButton
                quoteId={quote.id}
                initialLikes={quote.likes}
                initialLikedByMe={quote.likedByMe}
                size={15}
              />
              <span className="flex items-center gap-1 text-xs">
                <Eye size={14} /> {quote.views}
              </span>
              <ShareButton quote={quote} size={15} />
            </div>
          </div>
          <p className="text-2xl font-semibold text-gray-900 leading-relaxed mb-4">{quote.text}</p>
          <p className="text-gray-500 font-medium">— {quote.author}</p>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">About the Author</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold text-sm flex items-center justify-center">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{quote.author}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {authorBios[quote.author] || 'Renowned thinker and philosopher.'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Tags</h3>
            {quote.tag && (
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${tagColors[quote.tag] || 'bg-gray-100 text-gray-600'}`}>
                {quote.tag}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Added on {quote.createdAt}</span>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
        </div>
      </main>
      {showForm && <AddQuoteForm onClose={() => setShowForm(false)} />}
    </>
  );
}

'use client';
import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import AddQuoteForm from '@/components/AddQuoteForm';
import LikeButton from '@/components/LikeButton';
import ShareButton from '@/components/ShareButton';
import { useQuotes } from '@/hooks/useQuotes';
import useFilterStore from '@/store/filterStore';
import { useAuth } from '@/context/AuthContext';

const tagColors = {
  Motivation: 'bg-purple-100 text-purple-700',
  Life: 'bg-green-100 text-green-700',
  Inspiration: 'bg-blue-100 text-blue-700',
  Success: 'bg-yellow-100 text-yellow-700',
};

const PAGE_SIZE = 10;

export default function QuotesPage() {
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const { isSignedIn } = useAuth();
  const { data, isLoading } = useQuotes();
  const { author, tag, sortBy } = useFilterStore();

  let quotes = data?.quotes || [];

  if (author !== 'All Authors') quotes = quotes.filter((q) => q.author === author);
  if (tag !== 'All Tags') quotes = quotes.filter((q) => q.tag === tag);
  if (sortBy === 'Most Liked') quotes = [...quotes].sort((a, b) => b.likes - a.likes);
  else if (sortBy === 'Oldest') quotes = [...quotes].reverse();

  const totalPages = Math.max(1, Math.ceil(quotes.length / PAGE_SIZE));
  const paginated = quotes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Navbar onAddQuote={() => setShowForm(true)} />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <FilterBar />
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border h-24 animate-pulse" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <p className="text-gray-500 text-center py-16">No quotes found. Be the first to add one!</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
            {paginated.map((quote) => {
              // Normalize id — API always returns id, but be defensive
              const quoteId = quote.id || quote._id?.toString();
              return (
                <div key={quoteId} className="p-5">
                  <p className="text-gray-800 font-medium mb-1">{quote.text}</p>
                  <p className="text-gray-500 text-sm mb-3">— {quote.author}</p>
                  <div className="flex items-center justify-between">
                    {quote.tag && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${tagColors[quote.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {quote.tag}
                      </span>
                    )}
                    <div className="flex items-center gap-3 text-gray-400 text-xs ml-auto">
                      <LikeButton
                        quoteId={quoteId}
                        initialLikes={quote.likes}
                        initialLikedByMe={quote.likedByMe}
                        size={13}
                      />
                      <span className="flex items-center gap-1">
                        <Eye size={13} /> <span>{quote.views ?? 0}</span>
                      </span>
                      <ShareButton quote={{ ...quote, id: quoteId }} size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  page === p ? 'bg-primary text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </main>
      {showForm && <AddQuoteForm onClose={() => setShowForm(false)} />}
    </>
  );
}

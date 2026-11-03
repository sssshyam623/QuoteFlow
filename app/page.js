'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import QuoteCard from '@/components/QuoteCard';
import AddQuoteForm from '@/components/AddQuoteForm';
import { useQuotes } from '@/hooks/useQuotes';

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useQuotes();
  const quotes = data?.quotes || [];

  return (
    <>
      <Navbar onAddQuote={() => setShowForm(true)} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-light to-white rounded-2xl p-8 mb-10 flex items-center justify-between overflow-hidden relative">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thoughts to Inspire<br />Your Day</h1>
            <p className="text-gray-500 mb-6 text-sm">Discover and share powerful quotes from great minds.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(true)}
                className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-dark transition-colors">
                <Plus size={15} /> Add Quote
              </button>
              <Link href="/quotes"
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View Quotes
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center w-40 h-40">
            <div className="relative">
              <div className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-6xl text-primary font-bold">"</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary/10 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Latest Quotes */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Latest Quotes</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-xl border border-gray-100 h-32 animate-pulse" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotes.slice(0, 4).map(quote => (
                  <QuoteCard key={quote.id} quote={quote} compact />
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/quotes" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors inline-block">
                  Load More
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      {showForm && <AddQuoteForm onClose={() => setShowForm(false)} />}
    </>
  );
}

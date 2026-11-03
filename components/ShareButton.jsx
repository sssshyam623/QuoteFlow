'use client';
import { useState, useRef, useEffect } from 'react';
import { Share2, Link2, Twitter, Check } from 'lucide-react';

export default function ShareButton({ quote, size = 13 }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Support both id and _id
  const quoteId = quote?.id || quote?._id?.toString();

  const quoteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/quotes/${quoteId}`
      : `/quotes/${quoteId}`;

  const quoteText = `"${quote?.text}" — ${quote?.author}`;

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const copyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(quoteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = quoteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setTimeout(() => setOpen(false), 1500);
  };

  const shareToTwitter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tweetText = encodeURIComponent(`${quoteText}\n\n${quoteUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  const nativeShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: 'QuoteFlow', text: quoteText, url: quoteUrl }).catch(() => {});
      setOpen(false);
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        title="Share"
        className="hover:text-primary transition-colors text-gray-400"
      >
        <Share2 size={size} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-6 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-44 z-50 text-sm">
          <button
            onClick={copyLink}
            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Link2 size={14} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>

          <button
            onClick={shareToTwitter}
            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <Twitter size={14} />
            Share on X/Twitter
          </button>

          {hasNativeShare && (
            <button
              onClick={nativeShare}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Share2 size={14} />
              More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}

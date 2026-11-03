'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quoteSchema } from '@/lib/zodSchemas';
import { useAddQuote } from '@/hooks/useQuotes';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

const tags = ['Motivation', 'Life', 'Inspiration', 'Success'];

export default function AddQuoteForm({ onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema),
  });
  const addQuote = useAddQuote();
  const { isSignedIn } = useAuth();

  const onSubmit = async (data) => {
    if (!isSignedIn) return; // safety guard; the button is hidden when signed out

    try {
      await addQuote.mutateAsync(data);
      onClose();
    } catch (err) {
      // swallowed — addQuote.isError / addQuote.error render the message below
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Add New Quote</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote <span className="text-red-500">*</span></label>
            <textarea {...register('text')} rows={3} placeholder="Enter the quote..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author <span className="text-red-500">*</span></label>
            <input {...register('author')} placeholder="Enter author name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
            <select {...register('tag')}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Select a tag</option>
              {tags.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          {addQuote.isError && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {addQuote.error?.message || 'Something went wrong. Please try again.'}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={addQuote.isPending}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
              {addQuote.isPending ? 'Adding...' : 'Add Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

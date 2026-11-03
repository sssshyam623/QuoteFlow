'use client';
import useFilterStore from '@/store/filterStore';

const authors = ['All Authors', 'Steve Jobs', 'Confucius', 'Mahatma Gandhi', 'Albert Einstein'];
const tags = ['All Tags', 'Motivation', 'Life', 'Inspiration', 'Success'];
const sorts = ['Newest', 'Oldest', 'Most Liked'];

export default function FilterBar() {
  const { author, tag, sortBy, setAuthor, setTag, setSortBy, clearFilters } = useFilterStore();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filter Quotes</h3>
        <button onClick={clearFilters} className="text-primary text-sm hover:underline">Clear</button>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-500 mb-1">Author</label>
          <select value={author} onChange={e => setAuthor(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            {authors.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-500 mb-1">Tag</label>
          <select value={tag} onChange={e => setTag(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            {tags.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs text-gray-500 mb-1">Sort By</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            {sorts.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          Apply Filter
        </button>
      </div>
    </div>
  );
}

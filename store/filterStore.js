import { create } from 'zustand';

const useFilterStore = create((set) => ({
  author: 'All Authors',
  tag: 'All Tags',
  sortBy: 'Newest',
  setAuthor: (author) => set({ author }),
  setTag: (tag) => set({ tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearFilters: () => set({ author: 'All Authors', tag: 'All Tags', sortBy: 'Newest' }),
}));

export default useFilterStore;

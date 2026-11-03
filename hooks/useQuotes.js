import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchQuotes = async () => {
  const res = await fetch('/api/quotes');
  if (!res.ok) throw new Error('Failed to fetch quotes');
  return res.json();
};

export function useQuotes() {
  return useQuery({
    queryKey: ['quotes'],
    queryFn: fetchQuotes,
    staleTime: 0,              // always refetch when window focuses
    refetchOnWindowFocus: true, // live update when user tabs back
    refetchInterval: 30_000,   // poll every 30s for real-time feel
  });
}

export function useAddQuote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to add quote');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}

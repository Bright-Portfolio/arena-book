interface PaginationProps {
  page: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, hasMore, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
      >
        Previous
      </button>
      <span className="text-sm text-gray-600">Page {page}</span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasMore}
        className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
      >
        Next
      </button>
    </div>
  );
}

export default function Pagination({ page, setPage, total, pageSize }: { page: number; setPage: (p: number) => void; total: number; pageSize: number }) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-4 justify-center items-center mt-4 mb-8 w-full">
      <button
        className="px-4 cursor-pointer py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold shadow hover:bg-yellow-300 transition disabled:opacity-40"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
 Previous
      </button>
      
      <span className="text-white text-lg font-mono">
        Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
      </span>
      <button
        className="px-4 cursor-pointer py-2 rounded-lg bg-yellow-400 text-slate-900 font-semibold shadow hover:bg-yellow-300 transition disabled:opacity-40"
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
export default function Pagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const from  = (page - 1) * pageSize + 1;
  const to    = Math.min(page * pageSize, total);
  const pages = [];
  const delta = 2;
  const left  = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2)             pages.push("…");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push("…");
  if (totalPages > 1)       pages.push(totalPages);

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <span className="pagination-info">{from}–{to} of {total} tasks</span>
      <button className="page-btn" disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === "…"
          ? <span key={`e${i}`} style={{ padding:"0 4px", color:"var(--text-muted)" }}>…</span>
          : <button key={p} className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => onPageChange(p)} aria-current={p === page ? "page" : undefined}>
              {p}
            </button>
      )}
      <button className="page-btn" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
        Next ›
      </button>
    </div>
  );
}

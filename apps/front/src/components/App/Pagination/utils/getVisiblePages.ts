export default function getVisiblePages(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
) {
  const half = Math.floor(maxVisiblePages / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = Math.min(totalPages, start + maxVisiblePages - 1);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

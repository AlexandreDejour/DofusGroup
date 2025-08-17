import "./Pagination.scss";

import getVisiblePages from "./utils/getVisiblePages";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages: number;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages,
}: PaginationProps) {
  const pages = getVisiblePages(currentPage, totalPages, maxVisiblePages);

  return (
    <ul className="pagination_list">
      {pages.map((page) => (
        <button
          type="button"
          aria-label={`To page ${page}`}
          role="button"
          className={`pagination_list_item link ${
            page === currentPage ? "active" : ""
          }`}
          key={page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </ul>
  );
}

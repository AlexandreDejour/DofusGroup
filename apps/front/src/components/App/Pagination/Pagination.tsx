import "./Pagination.scss";

import { Link } from "react-router";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  return (
    <ul className="pagination_list">
      {Array.from({ length: 10 }, (_, i) => {
        const page = i + 1;
        return (
          <Link
            className={`pagination_list_item link ${
              page === currentPage ? "active" : ""
            }`}
            to={`events/page${page}`}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Link>
        );
      })}
    </ul>
  );
}

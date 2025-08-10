import "./Pagination.scss";

import { Link } from "react-router";

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
      ))}
    </ul>
  );
}

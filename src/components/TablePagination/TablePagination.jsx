import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import "./TablePagination.css";

const TablePagination = ({
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  pageSize = 10,
  onPrevious,
  onNext,
}) => {
  const startRecord =
    totalRecords === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endRecord = Math.min(
    page * pageSize,
    totalRecords
  );

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="table-pagination-wrapper">
      <div className="table-pagination-info">
        Showing {startRecord}-{endRecord} of{" "}
        {totalRecords}
      </div>

      <div className="table-pagination-controls">
        <button
          type="button"
          className="table-pagination-btn"
          disabled={!hasPrevious}
          onClick={onPrevious}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>

        <span className="table-pagination-page-text">
          Page {page} of {totalPages || 1}
        </span>

        <button
          type="button"
          className="table-pagination-btn"
          disabled={!hasNext}
          onClick={onNext}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
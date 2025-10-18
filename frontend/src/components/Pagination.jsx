import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showPageNumbers = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const visiblePages = showPageNumbers ? getVisiblePages() : [];

  const buttonClass = "flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors rounded-md";
  const activeButtonClass = "bg-green-600 text-white";
  const inactiveButtonClass = "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50";
  const disabledButtonClass = "text-gray-400 bg-gray-100 cursor-not-allowed";

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Page Info */}
      <div className="text-sm text-gray-700">
        Showing page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page Button */}
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={() => handlePageChange(1)}
            className={`${buttonClass} ${inactiveButtonClass}`}
            title="First page"
          >
            First
          </button>
        )}

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonClass} ${
            currentPage === 1 ? disabledButtonClass : inactiveButtonClass
          }`}
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1 hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => {
              if (typeof page === 'string' && page.startsWith('ellipsis')) {
                return (
                  <div
                    key={page}
                    className="flex items-center justify-center px-3 py-2"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${buttonClass} ${
                    page === currentPage ? activeButtonClass : inactiveButtonClass
                  }`}
                  title={`Go to page ${page}`}
                >
                  {page}
                </button>
              );
            })}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonClass} ${
            currentPage === totalPages ? disabledButtonClass : inactiveButtonClass
          }`}
          title="Next page"
        >
          <span className="mr-1 hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page Button */}
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`${buttonClass} ${inactiveButtonClass}`}
            title="Last page"
          >
            Last
          </button>
        )}
      </div>
    </div>
  );
};

// Simple pagination component for mobile
export const SimplePagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === 1
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      <span className="text-sm text-gray-700">
        {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentPage === totalPages
            ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
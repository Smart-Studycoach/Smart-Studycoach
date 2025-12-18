"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface ModulePaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ModulePagination({
  currentPage,
  totalPages,
}: ModulePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  const handlePageChange = (pageNumber: number) => {
    router.push(createPageUrl(pageNumber));
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[#323333] text-white rounded-lg font-semibold hover:bg-zinc-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Vorige
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#C6002A] text-white"
                    : "bg-[#323333] text-white hover:bg-zinc-800/70"
                }`}
              >
                {pageNum}
              </button>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() =>
            currentPage < totalPages && handlePageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[#323333] text-white rounded-lg font-semibold hover:bg-zinc-800/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volgende
        </button>
      </div>
    </div>
  );
}

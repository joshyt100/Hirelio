// contact/SavedCoverLetters.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoverLetters, getPresignedUrl } from "@/api/save";
import { CoverLetterMetadataResponse } from "@/types/CoverLetterTypes";
import { CoverLetterRow } from "./CoverLetterRow";
import { TableSkeleton } from "./TableSkeleton";
import { NoDataRow } from "./NoDataRow";
import { useSidebar } from "@/context/SideBarContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function getPaginationRange(
  current: number,
  total: number
): (number | string)[] {
  const DOTS = "...";
  const totalButtons = 7;
  if (total <= totalButtons) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(current - 1, 1);
  const right = Math.min(current + 1, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const first = 1;
  const last = total;

  if (!showLeftDots && showRightDots) {
    return [...Array.from({ length: 4 }, (_, i) => i + 1), DOTS, last];
  }
  if (showLeftDots && !showRightDots) {
    return [first, DOTS, ...Array.from({ length: 4 }, (_, i) => total - 3 + i)];
  }
  return [first, DOTS, left, current, right, DOTS, last];
}

export const SavedCoverLetters: React.FC = () => {
  const { collapsed } = useSidebar();
  const leftPadding = collapsed ? "pl-24" : "pl-64";

  const PAGE_SIZE = 15;
  const [coverLetters, setCoverLetters] = useState<
    CoverLetterMetadataResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoverLetters = useCallback(
    async (page: number = 1) => {
      setLoading(true);
      try {
        const data = await getCoverLetters(page, PAGE_SIZE);
        setCoverLetters(data.results);
        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to fetch cover letters", err);
        setCoverLetters([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [PAGE_SIZE]
  );

  useEffect(() => {
    fetchCoverLetters(1);
  }, [fetchCoverLetters]);

  const handleDownload = async (id: number) => {
    try {
      const url = await getPresignedUrl(id);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div
      className={`flex flex-col min-h-screen ${leftPadding} transition-all duration-300 mx-auto`}
    >
      <div className="w-full flex justify-center mt-12 mb-8">
        <h1 className="text-3xl font-bold text-center">
          Saved Cover Letters
        </h1>
      </div>

      <div className="pl-4 w-full max-w-5xl mx-auto dark:bg-zinc-950">
        <div className="rounded-md border relative">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : coverLetters.length > 0 ? (
                coverLetters.map((letter) => (
                  <CoverLetterRow
                    key={letter.id}
                    letter={letter}
                    onDownload={handleDownload}
                  />
                ))
              ) : (
                <NoDataRow />
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    disabled={loading || currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!loading && currentPage > 1) {
                        fetchCoverLetters(currentPage - 1);
                      }
                    }}
                  />
                </PaginationItem>

                {paginationRange.map((p, i) =>
                  p === "..." ? (
                    <PaginationItem key={`dots-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === currentPage}
                        disabled={loading}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!loading) {
                            fetchCoverLetters(Number(p));
                          }
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    disabled={loading || currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!loading && currentPage < totalPages) {
                        fetchCoverLetters(currentPage + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};


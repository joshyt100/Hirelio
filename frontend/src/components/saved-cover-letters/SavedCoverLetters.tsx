import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { getCoverLetters, getPresignedUrl, deleteCoverLetter } from "@/api/save";
import { CoverLetterMetadataResponse } from "@/types/CoverLetterTypes";
import { useSidebar } from "@/context/SideBarContext";
import { Download, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TableSkeleton } from "./TableSkeleton";
import { NoDataRow } from "./NoDataRow";

function getPaginationRange(current: number, total: number): (number | string)[] {
  const DOTS = "...";
  const totalButtons = 7;
  if (total <= totalButtons) return Array.from({ length: total }, (_, i) => i + 1);
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
  const leftPaddingClass = collapsed ? "lg:pl-20" : "lg:pl-64";

  const PAGE_SIZE = 15;
  const [coverLetters, setCoverLetters] = useState<CoverLetterMetadataResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchCoverLetters = useCallback(async (page: number = 1) => {
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
  }, [PAGE_SIZE]);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    try {
      await deleteCoverLetter(id);
      fetchCoverLetters(currentPage);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handlePreview = async (id: number) => {
    try {
      const url = await getPresignedUrl(id);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Preview failed", error);
    }
  };

  const closePreview = () => {
    setPreviewUrl(null);
  };

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <div className={`flex flex-col min-h-screen ${leftPaddingClass}  transition-all duration-300 mx-1 sm:mx-2 lg:mx-0 lg:mr-2 xl:mx-0 `}>
      <div className="w-full flex justify-center mt-12 mb-8">
        <h1 className="text-3xl font-bold text-center">Saved Cover Letters</h1>
      </div>

      <div className="pl-4 w-full max-w-6xl  mx-auto">
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
                  <TableRow key={letter.id}>
                    <TableCell>{letter.company_name}</TableCell>
                    <TableCell>{letter.job_title}</TableCell>
                    <TableCell>{new Date(letter.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <button
                        onClick={() => handlePreview(letter.id)}
                        className="p-1  rounded"
                        title="Preview"
                      >
                        <Eye className="h-5 w-5 text-cyan-700" />
                      </button>
                      <button
                        onClick={() => handleDownload(letter.id)}
                        className="p-1  rounded"
                        title="Download"
                      >
                        <Download className="h-5 w-5 text-primary " />
                      </button>
                      <button
                        onClick={() => handleDelete(letter.id)}
                        className="p-1  rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <NoDataRow colSpan={4} />
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

      {/* Preview Dialog */}
      {previewUrl && (
        <Dialog open={!!previewUrl} onOpenChange={closePreview}>
          <DialogContent className="max-w-4xl h-[90vh]">
            <iframe
              src={previewUrl}
              title="Preview"
              className="w-full h-full p-2 rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};


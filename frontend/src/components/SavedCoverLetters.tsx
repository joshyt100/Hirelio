import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getCoverLetters, getPresignedUrl } from "../api/save";
import { CoverLetterMetadataResponse } from "@/types/types";
import { FaRegCopy } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export const SavedCoverLetters: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [coverLetters, setCoverLetters] = useState<CoverLetterMetadataResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const lettersPerPage = 12;

  useEffect(() => {
    const fetchCoverLetters = async (page: number) => {
      try {
        setLoading(true);
        const response = await getCoverLetters(page);
        setCoverLetters(response.results);
        const count = response.count;
        setTotalPages(Math.ceil(count / lettersPerPage));
      } catch (error) {
        console.error("Failed to get cover letters", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverLetters(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const downloadUrl = await getPresignedUrl(id);
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Failed to download cover letter", error);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-3xl font-bold mt-12 mb-12">Saved Cover Letters</h1>
      <div className="w-9/12  bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead className="text-left">Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : coverLetters.length > 0 ? (
                coverLetters.map((letter) => (
                  <TableRow
                    key={letter.id}
                    className="hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    <TableCell className="font-medium">
                      {letter.company_name}
                    </TableCell>
                    <TableCell>{letter.job_title}</TableCell>
                    <TableCell className="text-left">
                      {new Date(letter.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => handleDownload(letter.id)}
                        className="px-2 py-2 text-primary"
                      >
                        <FaRegCopy size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No cover letters found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-transparent hover:bg-transparent text-primary"
            >
              <FaChevronLeft size={16} />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-transparent hover:bg-transparent text-primary"
            >
              <FaChevronRight size={10} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoverLetters, getPresignedUrl } from "../api/save";
import { CoverLetterMetadataResponse } from "@/types/types";
import { FaRegCopy } from "react-icons/fa";

const SolidCircleLoader = ({ className = "w-6 h-6" }: { className?: string }) => (
  <div
    className={`border-4 border-solid border-zinc-300 dark:border-zinc-800 border-t-transparent dark:border-t-transparent rounded-full animate-spin ${className}`}
  />
);

export const SavedCoverLetters: React.FC = () => {
  const [coverLetters, setCoverLetters] = useState<CoverLetterMetadataResponse[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const fetchCoverLetters = useCallback(
    async (cursor: string | null = null, append = false) => {
      setLoading(true);
      try {
        const response = await getCoverLetters(cursor);
        const newLetters = response.results;
        if (append) {
          setCoverLetters((prev) => [...prev, ...newLetters]);
        } else {
          setCoverLetters(newLetters);
        }
        setNextCursor(response.next_cursor || null);
      } catch (err) {
        console.error("Failed to fetch cover letters", err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCoverLetters(null);
  }, [fetchCoverLetters]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !nextCursor) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 200
      ) {
        fetchCoverLetters(nextCursor, true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, nextCursor, fetchCoverLetters]);

  const handleDownload = async (id: number) => {
    try {
      const url = await getPresignedUrl(id);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-3xl font-bold mt-12 mb-12">Saved Cover Letters</h1>
      <div className="w-9/12 bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-md border">
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
              {initialLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <SolidCircleLoader className="w-6 h-6 mx-auto my-8" />
                  </TableCell>
                </TableRow>
              ) : coverLetters.length > 0 ? (
                coverLetters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell>{letter.company_name}</TableCell>
                    <TableCell>{letter.job_title}</TableCell>
                    <TableCell>
                      {new Date(letter.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => handleDownload(letter.id)}>
                        <FaRegCopy className="text-primary" size={20} />
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
              {loading && coverLetters.length > 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <SolidCircleLoader className="w-6 h-6 mx-auto my-4" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};


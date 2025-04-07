import React, { useEffect, useState, useCallback } from "react";
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
import { SolidCircleLoader } from "./SolidCircleLoader";

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
    <div className="flex flex-col min-h-screen transition-all duration-300 pl-[5.5rem] mx-auto  pr-4">
      <div className="w-full flex justify-center mt-12 mb-8">
        <h1 className="text-3xl font-bold text-center">Saved Cover Letters</h1>
      </div>
      <div className="w-full max-w-5xl mx-auto  dark:bg-zinc-950">
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
                <TableSkeleton />
              ) : coverLetters.length > 0 ? (
                <>
                  {coverLetters.map((letter) => (
                    <CoverLetterRow
                      key={letter.id}
                      letter={letter}
                      onDownload={handleDownload}
                    />
                  ))}
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        <SolidCircleLoader className="w-6 h-6 mx-auto my-4" />
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <NoDataRow />
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

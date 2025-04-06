
import React, { useEffect, useState, useCallback } from "react";
import { getCoverLetters, getPresignedUrl } from "@/api/save";
import { CoverLetterMetadataResponse } from "@/types/types";
import { CoverLetterTable } from "./CoverLetterTable";

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
        setCoverLetters((prev) => (append ? [...prev, ...newLetters] : newLetters));
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
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 200) {
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
        <CoverLetterTable
          coverLetters={coverLetters}
          loading={loading}
          initialLoading={initialLoading}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};


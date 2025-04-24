import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditCoverLetterDialog } from "./EditCoverLetterDialog";
import { useSidebar } from "@/context/SideBarContext";
import { SolidCircleLoader } from "../loader/SolidCircleLoader";
import { CoverLetterResultProps } from "@/types/CoverLetterTypes";

export const CoverLetterResult = ({
  coverLetter,
  setCoverLetter,
  onSave,
  isSaved,
  error,
  loading,
}: CoverLetterResultProps) => {
  const { isMobile } = useSidebar();
  const paddingClass = isMobile ? "px-4" : "px-6";

  return (
    <div
      className={`
        ${paddingClass}
        w-full sm:w-full
        rounded-lg
        flex flex-col justify-center items-center
        min-h-[300px]
      `}
    >
      {loading ? (
        <div className="flex flex-col items-center">
          <SolidCircleLoader className="w-6 h-6 mx-auto my-8" />
          <p className="mt-4">Generating your cover letter...</p>
        </div>
      ) : coverLetter ? (
        <div className="w-full relative">
          <h2 className="text-xl font-semibold mt-10 mb-4">
            Generated Cover Letter
          </h2>
          <div className="relative">
            <Textarea
              value={coverLetter}
              readOnly
              className="
                w-full flex-1 min-h-[750px]
                bg-zinc-50 border border-zinc-300
                dark:border-border dark:bg-zinc-900
                resize-none mb-4
              "
            />
            <EditCoverLetterDialog
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
            />
            <Button
              onClick={onSave}
              disabled={isSaved}
              className="absolute top-3 right-12"
            >
              {isSaved ? "Already Saved" : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full relative">
          <h2 className="text-xl font-semibold mt-10 mb-4">
            Generated Cover Letter
          </h2>
          <div className="relative">
            <Textarea
              value=""
              placeholder="Your cover letter will appear here."
              readOnly
              className="
                w-full flex-1 min-h-[750px]
                bg-zinc-50 border border-zinc-300
                dark:border-border dark:bg-zinc-900
                resize-none mb-4
              "
            />
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};


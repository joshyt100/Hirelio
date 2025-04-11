import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditCoverLetterDialog } from "./EditCoverLetterDialog";

export const CoverLetterResult = ({ coverLetter, setCoverLetter, onSave, isSaved, error, loading }: any) => {
  return (
    <div className="px-6 w-full sm:w-full rounded-lg flex flex-col justify-center items-center min-h-[300px]">
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"></div>
          <p className="mt-4">Generating your cover letter...</p>
        </div>
      ) : coverLetter ? (
        <div className="w-full relative">
          <h2 className="text-xl font-semibold mt-10 mb-4">Generated Cover Letter</h2>
          <div className="relative">
            <Textarea
              value={coverLetter}
              className="w-full flex-1 min-h-[750px] bg-zinc-50 border border-zinc-300 dark:border-border dark:bg-zinc-900 resize-none mb-4"
              readOnly
            />
            <EditCoverLetterDialog coverLetter={coverLetter} setCoverLetter={setCoverLetter} />
            <Button onClick={onSave} disabled={isSaved} className="absolute top-3 right-12">
              {isSaved ? "Already Saved" : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <p>Your cover letter will appear here.</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};


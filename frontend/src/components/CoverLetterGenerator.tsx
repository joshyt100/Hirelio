import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegCopy } from "react-icons/fa"

const API_URL = "http://127.0.0.1:8000/cover/generate/";

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!resume || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("resume", resume);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      setCoverLetter(data.cover_letter);
    } catch (err) {
      setError("Error s try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="max-w-6xl 2xl:max-w-8xl h-full w-full mx-auto flex flex-row">
      <div className="p-6 w-2/3 rounded-lg h-full flex flex-col">
        <h2 className="text-lg w-full font-semibold mb-4">Enter Job Description</h2>
        <Textarea
          placeholder="Enter job description..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w flex-1  min-h-[400px] resize-None mb-4"
        />

        <Label htmlFor="resume">Upload Resume</Label>
        <Input
          id="resume"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full mt-2"
        />

        <Button onClick={handleGenerateCoverLetter} disabled={loading} className="mt-4  w-full">
          {loading ? "Generating..." : "Generate Cover Letter"}
        </Button>
      </div>

      <div className="p-6 w-4/5 rounded-lg flex flex-col justify-center items-center min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"></div>
            <p className="mt-4">Generating your cover letter...</p>
          </div>
        ) : coverLetter ? (
          <div className="w-full relative">
            <h2 className="text-lg font-semibold mb-4">Generated Cover Letter</h2>
            <div className="relative">
              <Textarea
                placeholder=""
                value={coverLetter}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w flex-1  min-h-[750px] bg-zinc-100 dark:bg-zinc-900 resize-None mb-4"
              />

              <button
                //onClick={handleCopy}
                className="absolute top-3 right-3 bg-black text-white p-2 rounded-md hover:bg-gray-600 transition flex items-center justify-center"
              >
                <FaRegCopy size={18} />
              </button>
              <Button className="absolute top-3 bg-black mr-1 right-12">
                Save
              </Button>


            </div>
          </div>
        ) : (
          <p className="">Your cover letter will appear here.</p>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};


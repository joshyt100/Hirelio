import React, { useState, useEffect } from "react";
import { CoverLetterForm } from "./CoverLetterForm";
import { CoverLetterResult } from "./CoverLetterResult";
import { generateCoverLetter } from "@/api/generate";
import { saveCoverLetter } from "@/api/save";
import { CoverLetterData } from "@/types/types";

export const CoverLetterGenerator: React.FC = () => {
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem("jobDescription") || "");
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(() => localStorage.getItem("coverLetter") || null);
  const [jobName, setJobName] = useState(() => localStorage.getItem("jobName") || "");
  const [companyName, setCompanyName] = useState(() => localStorage.getItem("companyName") || "");
  const [isSaved, setIsSaved] = useState(() => localStorage.getItem("isSaved") === "true");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("jobDescription", jobDescription);
    localStorage.setItem("jobName", jobName);
    localStorage.setItem("companyName", companyName);
    if (coverLetter) localStorage.setItem("coverLetter", coverLetter);
  }, [jobDescription, jobName, companyName, coverLetter]);

  const handleGenerateCoverLetter = async () => {
    if (!resume || !jobDescription || !jobName || !companyName) {
      setError("Please upload a resume, enter a job description, and provide job and company names.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    formData.append("resume", resume);
    formData.append("job_name", jobName);
    formData.append("company_name", companyName);

    try {
      const response = await generateCoverLetter(formData);
      setCoverLetter(response.coverLetter);
      localStorage.setItem("coverLetter", response.coverLetter);
      setIsSaved(false);
      localStorage.setItem("isSaved", "false");
    } catch (error) {
      setError("Failed to generate cover letter");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!jobName || !companyName || !coverLetter || isSaved) {
      setError("You have already saved this cover letter.");
      return;
    }

    const data: CoverLetterData = {
      job_title: jobName,
      company_name: companyName,
      cover_letter: coverLetter,
    };

    try {
      await saveCoverLetter(data);
      setIsSaved(true);
      localStorage.setItem("isSaved", "true");
    } catch {
      setError("Failed to save cover letter");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-11/12 sm:max-w-xl md:max-w-4xl lg:max-w-6xl 2xl:max-w-8xl h-full flex flex-col items-center justify-center ml-28 max-w-lg md:flex-row">
        <CoverLetterForm
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          jobName={jobName}
          setJobName={setJobName}
          companyName={companyName}
          setCompanyName={setCompanyName}
          resume={resume}
          setResume={setResume}
          onGenerate={handleGenerateCoverLetter}
          loading={loading}
        />
        <CoverLetterResult
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          onSave={handleSave}
          isSaved={isSaved}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  );
};


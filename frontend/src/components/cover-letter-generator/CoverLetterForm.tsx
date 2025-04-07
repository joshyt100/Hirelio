import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const CoverLetterForm = ({
  jobDescription,
  setJobDescription,
  jobName,
  setJobName,
  companyName,
  setCompanyName,
  resume,
  setResume,
  onGenerate,
  loading,
}: any) => (
  <div className="p-6 w-full sm:w-full rounded-lg h-full flex flex-col">
    <h1 className="text-3xl w-full font-bold mb-6">Cover Letter Generator</h1>
    <h2 className="text-lg w-full font-semibold mb-4">Enter Job Description</h2>
    <Textarea
      placeholder="Enter job description..."
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
      className="w-full flex-1 min-h-[400px] border border-border resize-none mb-4"
    />
    <div className="mb-4">
      <Label htmlFor="job-name">Job Name</Label>
      <Input
        id="job-name"
        type="text"
        value={jobName}
        onChange={(e) => setJobName(e.target.value)}
        className="w-full mt-2 border border-border"
        placeholder="Enter job name"
      />
    </div>
    <div className="mb-4">
      <Label htmlFor="company-name">Company Name</Label>
      <Input
        id="company-name"
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full mt-2 border-border"
        placeholder="Enter company name"
      />
    </div>
    <Label htmlFor="resume">Upload Resume</Label>
    <Input id="resume" type="file" accept=".pdf" onChange={(e) => setResume(e.target.files?.[0] || null)} className="w-full border border-border mt-2" />
    <Button onClick={onGenerate} disabled={loading} className="mt-4 w-full">
      {loading ? "Generating..." : "Generate Cover Letter"}
    </Button>
  </div>
);


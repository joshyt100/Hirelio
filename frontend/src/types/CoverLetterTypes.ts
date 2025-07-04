

export interface CoverLetterData {
  job_title: string,
  company_name: string,
  cover_letter: string,
}

export interface CoverLetterMetadataResponse {
  id: number,
  job_title: string,
  company_name: string,
  cover_letter_file_path: string,
  created_at: string,
}
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PagedCoverLettersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CoverLetterMetadataResponse[];
}


export interface CoverLetterResultProps {
  coverLetter: string | null;
  setCoverLetter: React.Dispatch<React.SetStateAction<string | null>>;
  onSave: () => void;
  isSaved: boolean;
  error: string | null;
  loading: boolean;
}

import axios from 'axios';
import { getCookie } from '../utils/csrfUtils';

const API_URL = "http://127.0.0.1:8000/cover/generate/";

// response cover letter
interface CoverLetterResponse {
  coverLetter: string,
}

export const generateCoverLetter = async (formData: FormData): Promise<CoverLetterResponse> => {
  try {
    const response = await axios.post<CoverLetterResponse>(API_URL, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": getCookie('csrftoken'),
      }
    })
    return {
      coverLetter: response.data.cover_letter
    };
  }
  catch (error) {
    console.log("error", error);
    throw new Error("Failed to generate cover letter");
  }
}


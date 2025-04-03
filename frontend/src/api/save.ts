import axios from "axios";
import { getCookie } from "../utils/csrfUtils";
import { CoverLetterData, CoverLetterMetadataResponse } from "../types/types";
import { PaginatedResponse } from "../types/types";

const API_URL = "http://127.0.0.1:8000/cover/save-cover-letter/";
const OTHER_API_URL = "http://127.0.0.1:8000/cover/get-cover-letters/";


export const saveCoverLetter = async (coverLetter: CoverLetterData): Promise<void> => {
  try {
    await axios.post(API_URL, coverLetter, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
  } catch (error) {
    console.error("Error saving cover letter", error);
    throw new Error("Failed to save cover letter");
  }
};

export const getCoverLetters = async (page: number): Promise<PaginatedResponse<CoverLetterMetadataResponse>> => {
  try {
    const response = await axios.get(`${OTHER_API_URL}?page=${page}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cover letters", error);
    throw new Error("Failed to get cover letters");
  }
};

export const getPresignedUrl = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/cover/get-cover-letter-url/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Extract and return the download URL from the response
    return response.data.download_url;
  } catch (error) {
    console.error("Error fetching presigned URL", error);
    throw new Error("Failed to get presigned url");
  }
};


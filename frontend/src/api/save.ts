import axios from "axios";
import { getCookie } from "../utils/csrfUtils";
import { CoverLetterData, CoverLetterMetadataResponse } from "../types/types";

// Define response type for cursor pagination
interface CursorPaginatedResponse<T> {
  results: T[];
  next_cursor: string | null;
}

const BASE_URL = "http://127.0.0.1:8000/cover";

export const saveCoverLetter = async (coverLetter: CoverLetterData): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/save-cover-letter/`, coverLetter, {
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

export const getCoverLetters = async (
  cursor?: string | null
): Promise<CursorPaginatedResponse<CoverLetterMetadataResponse>> => {
  try {
    const url = cursor
      ? `${BASE_URL}/get-cover-letters/?cursor=${encodeURIComponent(cursor)}`
      : `${BASE_URL}/get-cover-letters/`;

    const response = await axios.get(url, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const nextUrl = response.data.next;
    const nextCursor = nextUrl
      ? new URL(nextUrl).searchParams.get("cursor")
      : null;

    return {
      results: response.data.results,
      next_cursor: nextCursor,
    };
  } catch (error) {
    console.error("Error fetching cover letters", error);
    throw new Error("Failed to get cover letters");
  }
};

export const getPresignedUrl = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(`${BASE_URL}/get-cover-letter-url/${id}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.download_url;
  } catch (error) {
    console.error("Error fetching presigned URL", error);
    throw new Error("Failed to get presigned url");
  }
};


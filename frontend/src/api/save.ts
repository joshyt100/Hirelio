// src/api/save.ts

import axios from "axios";
import { getCookie } from "../utils/csrfUtils";
import { CoverLetterData, CoverLetterMetadataResponse } from "../types/types";

/**
 * Response shape for page‑number pagination
 */
export interface PagedCoverLettersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CoverLetterMetadataResponse[];
}

const BASE_URL = "http://127.0.0.1:8000/cover";

/**
 * Save a generated cover letter to the backend.
 */
export const saveCoverLetter = async (
  coverLetter: CoverLetterData
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/save-cover-letter/`,
      coverLetter,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );
  } catch (error) {
    console.error("Error saving cover letter", error);
    throw new Error("Failed to save cover letter");
  }
};

/**
 * Fetch a page of saved cover letters using page‑number pagination.
 * @param page – which page to fetch (1‑indexed)
 * @param page_size – how many items per page
 */
export const getCoverLetters = async (
  page: number = 1,
  page_size: number = 18
): Promise<PagedCoverLettersResponse> => {
  try {
    const response = await axios.get<PagedCoverLettersResponse>(
      `${BASE_URL}/get-cover-letters/`,
      {
        params: { page, page_size },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching cover letters", error);
    throw new Error("Failed to get cover letters");
  }
};

/**
 * Get a presigned download URL for a specific cover letter.
 */
export const getPresignedUrl = async (
  id: number
): Promise<string> => {
  try {
    const response = await axios.get<{ download_url: string }>(
      `${BASE_URL}/get-cover-letter-url/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.download_url;
  } catch (error) {
    console.error("Error fetching presigned URL", error);
    throw new Error("Failed to get presigned url");
  }
};


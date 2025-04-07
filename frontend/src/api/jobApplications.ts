import axios from "axios";
import type { JobApplication } from "@/types/JobApplicationTypes";
import type { AxiosResponse } from "axios";

const API_URL = "http://127.0.0.1:8000/api/job-applications";

// Fetch list of job applications
export async function fetchJobApplications(
  params: Record<string, any>
): Promise<AxiosResponse<JobApplication[]>> {
  return await axios.get(API_URL, { params, withCredentials: true });
}

// Create a job application
export async function createJobApplication(
  formData: FormData,
  csrfToken: string
): Promise<AxiosResponse<JobApplication>> {
  return await axios.post(API_URL + "/", formData, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
}

// Update a job application
export async function updateJobApplicationAPI(
  id: string,
  formData: FormData,
  csrfToken: string
): Promise<AxiosResponse<JobApplication>> {
  return await axios.put(`${API_URL}/${id}/`, formData, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
}

// Delete a job application
export async function deleteJobApplicationAPI(
  id: string,
  csrfToken: string
): Promise<AxiosResponse<void>> {
  return await axios.delete(`${API_URL}/${id}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
}

// Delete an attachment
export async function deleteAttachmentAPI(
  jobId: string,
  attachmentId: string,
  csrfToken: string
): Promise<AxiosResponse<void>> {
  return await axios.delete(`${API_URL}/${jobId}/attachments/${attachmentId}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
}


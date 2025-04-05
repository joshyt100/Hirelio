import axios from "axios";
import { getCookie } from "../utils/csrfUtils";

const API_URL = "http://127.0.0.1:8000/api/job-applications";

export const fetchJobApplications = async (params: any = {}) => {
  const response = await axios.get(API_URL, { params, withCredentials: true });
  return response.data;
};

export const createJobApplication = async (formData: FormData) => {
  const csrfToken = getCookie("csrftoken");
  return await axios.post(API_URL + "/", formData, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const updateJobApplication = async (id: string, formData: FormData) => {
  const csrfToken = getCookie("csrftoken");
  return await axios.put(`${API_URL}/${id}/`, formData, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const deleteJobApplication = async (id: string) => {
  const csrfToken = getCookie("csrftoken");
  return await axios.delete(`${API_URL}/${id}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const deleteAttachment = async (jobId: string, attachmentId: string) => {
  const csrfToken = getCookie("csrftoken");
  return await axios.delete(`${API_URL}/${jobId}/attachments/${attachmentId}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};


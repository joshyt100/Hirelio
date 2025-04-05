import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/job-applications";

export const getJobApplications = async (params: Record<string, any>) => {
  return axios.get(API_URL, { params, withCredentials: true });
};

export const createJobApplication = async (form: FormData, csrfToken: string) => {
  return axios.post(`${API_URL}/`, form, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const updateJobApplication = async (jobId: string, form: FormData, csrfToken: string) => {
  return axios.put(`${API_URL}/${jobId}/`, form, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const deleteJobApplication = async (jobId: string, csrfToken: string) => {
  return axios.delete(`${API_URL}/${jobId}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};

export const deleteAttachment = async (
  jobId: string,
  attachmentId: string,
  csrfToken: string
) => {
  return axios.delete(`${API_URL}/${jobId}/attachments/${attachmentId}/`, {
    headers: { "X-CSRFToken": csrfToken },
    withCredentials: true,
  });
};


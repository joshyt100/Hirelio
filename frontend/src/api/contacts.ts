// src/api/contacts.ts
import axios, { AxiosResponse } from "axios";
import type { Contact, Interaction, ContactFormData } from "@/types/ContactTypes";
import { getCookie } from "@/utils/csrfUtils";

const API_URL = "http://127.0.0.1:8000/api/contacts";

// Fetch a paginated list of contacts
export async function fetchContactsAPI(
  params: Record<string, any>
): Promise<AxiosResponse<{ results: Contact[]; count: number }>> {
  return axios.get(API_URL + "/", { params, withCredentials: true });
}

// Create a new contact
export async function createContactAPI(
  data: ContactFormData,
  tags: string[]
): Promise<AxiosResponse<Contact>> {
  return axios.post(
    API_URL + "/",
    { ...data, tags },
    {
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      withCredentials: true,
    }
  );
}

// Update an existing contact
export async function updateContactAPI(
  id: string,
  data: ContactFormData,
  tags: string[]
): Promise<AxiosResponse<Contact>> {
  return axios.put(
    `${API_URL}/${id}/`,
    { ...data, tags },
    {
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      withCredentials: true,
    }
  );
}

// Delete a contact
export async function deleteContactAPI(
  id: string
): Promise<AxiosResponse<void>> {
  return axios.delete(
    `${API_URL}/${id}/`,
    {
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      withCredentials: true,
    }
  );
}

// Add an interaction to a contact
export async function addInteractionAPI(
  contactId: string,
  interaction: Omit<Interaction, "id">
): Promise<AxiosResponse<Interaction>> {
  return axios.post(
    `${API_URL}/${contactId}/interactions/`,
    interaction,
    {
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      withCredentials: true,
    }
  );
}

// Toggle favorite status
export async function toggleFavoriteAPI(
  id: string,
  isFavorite: boolean
): Promise<AxiosResponse<Contact>> {
  return axios.patch(
    `${API_URL}/${id}/`,
    { isFavorite },
    {
      headers: { "X-CSRFToken": getCookie("csrftoken") },
      withCredentials: true,
    }
  );
}

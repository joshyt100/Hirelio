import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchJobApplications } from "@/api/jobApplications";

interface UseJobApplicationsParams {
  activeTab: string;
  searchTerm: string;
  sortOrder: "asc" | "desc";
}

export function useJobApplications({ activeTab, searchTerm, sortOrder }: UseJobApplicationsParams) {
  return useInfiniteQuery({
    queryKey: ["jobApplications", activeTab, searchTerm, sortOrder],
    queryFn: async ({ pageParam = null }) => {
      // Prepare query parameters based on filters
      const params: Record<string, any> = {};
      if (activeTab && activeTab !== "all") {
        params.status = activeTab;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      params.sortOrder = sortOrder;
      if (pageParam) {
        params.cursor = pageParam;
      }
      const response = await fetchJobApplications(params);
      return response.data;
    },
    // Return the next cursor if available
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get("cursor");
      }
      return undefined;
    },
  });
}


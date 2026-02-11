import { useQuery } from "@tanstack/react-query";

export function useManageArenas() {
  return useQuery({
    queryKey: ["manage-arenas"],
    queryFn: async () => {
      const res = await fetch("/api/manage");
      const data = await res.json();
      return data;
    },
  });
}

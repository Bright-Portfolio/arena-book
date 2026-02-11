import { ArenaCard } from "@/components/features/arena-card/arena-card";

export default function ManagePage() {
    const {data, isLoading} = useArena()

  return (
    <div>

      <ArenaCard />
    </div>
  );
}

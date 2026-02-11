import { ArenaCard } from "@/components/features/arena-card/arena-card";
import { useManageArenas } from "@/hooks/use-manage-arenas";

export default function ManagePage() {
  const { data, isLoading } = useManageArenas();

  return (
    <div>
      {/* Arena list */}
      {isLoading ? (
        <p className="text-gray-500">Loading arenas...</p>
      ) : !data?.data.length ? (
        <p className="text-gray-500">No arenas found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.data.map((arena) => (
            <ArenaCard
              key={arena.id}
              name={arena.name}
              category={arena.category}
              address={arena.address}
              price={arena.price}
              imageUrl={arena.imageUrls?.[0]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

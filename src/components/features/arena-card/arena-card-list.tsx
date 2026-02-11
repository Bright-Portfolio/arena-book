import { ArenaCard } from "./arena-card";

interface Arena {
  id: number;
  name: string;
  category: string;
  address: string;
  price: number;
  imageUrls?: string[];
}

interface ArenaCardListProps {
  arenas: Arena[];
  isLoading: boolean;
}

export const ArenaCardList = ({ arenas, isLoading }: ArenaCardListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] py-4">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!arenas.length) {
    return (
      <div className="flex justify-center items-center min-h-[200px] py-4">
        <p className="text-gray-500">No arenas found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {arenas.map((arena) => (
        <ArenaCard
          key={arena.id}
          id={arena.id}
          name={arena.name}
          category={arena.category}
          address={arena.address}
          price={arena.price}
          imageUrl={arena.imageUrls?.[0]}
        />
      ))}
    </div>
  );
};

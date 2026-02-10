import Image from "next/image";

interface ArenaCardProps {
  name: string;
  category: string;
  address: string;
  price: number;
  imageUrl?: string;
}

export const ArenaCard = ({
  name,
  category,
  address,
  price,
  imageUrl,
}: ArenaCardProps) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={imageUrl ?? "/placeholder-arena.png"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-sm">{address}</p>
        <p className="text-sm font-medium">฿{price}/hr</p>
      </div>
    </div>
  );
};

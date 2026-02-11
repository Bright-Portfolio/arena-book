import Image from "next/image";
import {
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";

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
  const handleBookClick = () => {};

  return (
    <div className="pb-1.5 border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 w-full bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill sizes="(min-width: 640px) 448px, 100vw" className="object-cover" />
        ) : (
          <div className="bg-gray-50 object-cover" />
        )}
      </div>
      <div className="flex flex-row justify-between items-end px-2">
        {/* Arena detail */}
        <div className="p-2.5 space-y-0.5">
          <h2 className="font-semibold text-base">{name}</h2>
          <p className="text-xs text-gray-500">{category}</p>
          <p className="text-xs">{address}</p>
          <p className="text-xs font-medium">฿{price}/hr</p>
        </div>

        {/* Booking button */}
        <button
          type="button"
          onClick={handleBookClick}
          className="inline-flex flex-row items-center gap-1.5 px-2 py-1 text-xs border border-gray-300 rounded-full text-white bg-black cursor-pointer"
        >
          Book Now
          <div className="p-1.5 rounded-full bg-white">
            <ArrowUpRightIcon className="w-2.5 h-2.5 stroke-2 text-black" />
          </div>
        </button>
      </div>
    </div>
  );
};

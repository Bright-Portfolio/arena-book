import Image from "next/image";
import {
  ArrowUpRightIcon,
  EllipsisVerticalIcon,
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
    <div className="pb-2 border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 w-full bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="bg-gray-50 object-cover" />
        )}
      </div>
      <div className="flex flex-row justify-between items-end px-2">
        {/* Arena detail */}
        <div className="p-4 space-y-1">
          <h2 className="font-semibold text-lg">{name}</h2>
          <p className="text-sm text-gray-500">{category}</p>
          <p className="text-sm">{address}</p>
          <p className="text-sm font-medium">฿{price}/hr</p>
        </div>

        {/* Booking button */}
        <button
          type="button"
          onClick={handleBookClick}
          className="inline-flex flex-row items-center gap-2 px-2 py-1.5 border border-gray-300 rounded-full text-white bg-black cursor-pointer"
        >
          Book Now
          <div className="p-2 rounded-full bg-white">
            <ArrowUpRightIcon className="w-3 h-3 stroke-2 text-black" />
          </div>
        </button>
      </div>
    </div>
  );
};

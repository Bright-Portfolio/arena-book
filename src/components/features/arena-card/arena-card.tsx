import Image from "next/image";
import {
  ArrowUpRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface ArenaCardProps {
  id: number;
  name: string;
  category: string;
  address: string;
  price: number;
  capacity?: number;
  imageUrl?: string;
  onDelete?: (id: number) => void;
}

export const ArenaCard = ({
  id,
  name,
  category,
  address,
  price,
  capacity,
  imageUrl,
  onDelete,
}: ArenaCardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const showEditButton = pathname.includes("/manage");

  const handleBookClick = () => router.push(`/arena/${id}`);

  return (
    <div className="pb-1.5 border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative z-0 h-32 w-full rounded-sm bg-gray-100 overflow-hidden">
        {showEditButton && (
          <Menu as="div" className="relative flex justify-end">
            <MenuButton className="z-50 cursor-pointer p-1 outline-none">
              <EllipsisVerticalIcon className="size-6 stroke-2 text-gray-300" />
            </MenuButton>
            <MenuItems
              anchor="bottom end"
              className="mt-1 w-32 rounded-md border bg-white p-1 shadow-lg"
            >
              <MenuItem>
                <button
                  type="button"
                  onClick={() => router.push(`/arena/edit/${id}`)}
                  className="w-full rounded-sm px-2 py-1.5 text-left text-sm data-focus:bg-gray-100"
                >
                  Edit
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={() => onDelete?.(id)}
                  className="w-full rounded-sm px-2 py-1.5 text-left text-sm text-red-600 data-focus:bg-gray-100"
                >
                  Delete
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        )}

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 640px) 448px, 100vw"
            className="object-cover"
          />
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
          {capacity && (
            <p className="text-xs text-gray-500">Up to {capacity} people</p>
          )}
          <p className="text-xs font-medium">฿{price}/hr</p>
        </div>

        {/* Booking button */}
        <button
          type="button"
          onClick={handleBookClick}
          className="inline-flex flex-row items-center gap-1.5 px-1.5 py-1 text-xs border border-gray-300 rounded-full text-white bg-black cursor-pointer"
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

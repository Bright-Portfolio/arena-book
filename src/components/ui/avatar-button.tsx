import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";

export const AvatarButton = () => {
  const { data: session } = useSession();

  return (
    <Menu>
      <MenuButton className="flex flex-row justify-center items-center gap-1 px-1.5 py-1 border border-gray-300 rounded-full cursor-pointer">
        <span className="text-sm text-nowrap">{session?.user?.name}</span>
        <div className="relative flex justify-center items-center w-6 h-6 border border-gray-300 rounded-full overflow-hidden">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="profile-avatar"
              fill
              sizes="24px"
              className="object-cover"
            />
          ) : (
            <UserIcon className="w-4 h-4" />
          )}
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        className="flex flex-col mt-1 gap-0.5 p-1 text-sm border boredr-gray-400 rounded-md bg-white"
      >
        <MenuItem>
          <Link
            href="/bookings"
            className="w-full px-2 py-1 rounded-md data-focus:bg-gray-200"
          >
            My Bookings
          </Link>
        </MenuItem>

        {session?.user?.role === "owner" && (
          <>
            <MenuItem>
              <Link
                href="/manage"
                className="w-full px-2 py-1 rounded-md data-focus:bg-gray-200"
              >
                Manage arena
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                href="/manage/bookings"
                className="w-full px-2 py-1 rounded-md data-focus:bg-gray-200"
              >
                Manage Bookings
              </Link>
            </MenuItem>
          </>
        )}

        <MenuItem>
          <button
            onClick={() =>
              signOut({
                redirectTo: "/",
              })
            }
            className="w-full px-2 py-1 text-start rounded-md data-focus:bg-gray-200"
          >
            Sign out
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

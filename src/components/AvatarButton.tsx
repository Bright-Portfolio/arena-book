import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export const AvatarButton = () => {
  const { data: session } = useSession();

  return (
    <button className="flex flex-row justify-center items-center gap-1 px-1.5 py-1 border border-gray-300 rounded-full cursor-pointer">
      <span className="text-sm">{session?.user?.name}</span>
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
    </button>
  );
};

import { UserIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export const AvatarButton = () => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-row justify-center items-center gap-1 p-2 border border-black rounded-full">
      {session ? <span>{session.user?.name}</span> : null}
      <div className="flex justify-center items-center w-8 h-8 border border-black rounded-full bg-gray-200">
        <UserIcon className="w-4 h-4" />
      </div>
    </div>
  );
};

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBox = () => {
  return (
    <div className="flex flex-row justify-between items-center gap-2 w-full h-12 max-w-4xl px-5 py-2 border border-gray-300 rounded-full text-base text-white bg-gray-300/40">
      <input
        type="text"
        placeholder="What do you feel like playing today?"
        className="w-full border-r border-gray-300 text-base text-white outline-none"
      />
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" />
    </div>
  );
};

export default SearchBox;

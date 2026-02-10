"use client";

import { FC, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
}

export const SearchBox: FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (onSearch) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-4xl px-3 py-2 border border-gray-300 rounded-full bg-gray-300/40">
      <Input
        type="text"
        placeholder="What do you feel like playing today?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 border-none bg-transparent text-white placeholder:text-gray-300 shadow-none focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearch}
        className="shrink-0 text-gray-300 hover:text-white hover:bg-transparent"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

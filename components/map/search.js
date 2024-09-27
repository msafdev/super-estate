"use client";

import { SearchIcon } from "@/devlink-demo";

const Search = ({ search, setSearch }) => {
  return (
    <div className="absolute top-24 left-0 right-0 z-10 flex items-center justify-center p-4">
      <div className="mx-auto border-[hsla(0,0%,100%,1)] bg-[rgba(255,255,255,0.77)] shadow-[0_0_60px_0_rgba(0,0,0,0.16)] backdrop-blur-sm outline outline-[hsla(0,0%,0%,0.08)] outline-offset-0 outline-1 outline-solid transition-colors duration-200 ease-in text-base cursor-text hover:bg-[hsla(0,0%,100%,0.88)] w-full max-w-lg overflow-hidden focus:outline-none focus:ring-0  rounded-full px-3 py-2 flex items-center">
        <SearchIcon className="size-5 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search with AI"
          className="input-search bg-transparent focus:outline-none h-9"
        />
      </div>
    </div>
  );
};

export default Search;

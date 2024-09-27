"use client";

import { useState } from "react";
import { Loader2, Plane, SearchIcon } from "lucide-react";
import { getPositions } from "@/utils/actions";

const Search = ({ onSearchSuccess }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { positions } = await getPositions(input);
      const position = positions.positions[0];

      if (position) {
        onSearchSuccess({
          lat: position.latitude,
          lng: position.longitude,
        });
      } else {
        setError("No positions found.");
        setTimeout(() => setError(null), 2000);
      }
    } catch (error) {
      setError("An error occurred while fetching positions.");
      setTimeout(() => setError(null), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-0 md:bottom-auto md:top-16 left-0 right-0 z-10 flex flex-col items-center justify-center p-4 pointer-events-none">
      <form
        className="w-full max-w-md pointer-events-auto"
        onSubmit={handleSubmit}
      >
        <div className="mx-auto border-[hsla(0,0%,100%,1)] bg-[rgba(255,255,255,0.77)] shadow-[0_0_60px_0_rgba(0,0,0,0.16)] backdrop-blur-sm outline outline-[hsla(0,0%,0%,0.08)] outline-offset-0 outline-1 outline-solid transition-colors duration-200 ease-in text-base cursor-text hover:bg-[hsla(0,0%,100%,0.88)] w-full overflow-hidden focus:outline-none focus:ring-0 rounded-full pl-6 pr-1 py-[4px] flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Where do you want to go?"
            className="input-search bg-transparent text-black font-medium focus:outline-none h-9 flex-grow"
          />
          <div className="bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 rounded-full p-[1px]">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white px-3 bg-black hover:bg-zinc-700 py-2 rounded-full transition-colors duration-200 ease-in"
            >
              {!isLoading ? <Plane /> : <Loader2 className="animate-spin" />}
            </button>
          </div>
        </div>
      </form>
      {error && (
        <p className="text-red-500 rounded-full bg-red-500/20 px-4 py-2 mt-3 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default Search;

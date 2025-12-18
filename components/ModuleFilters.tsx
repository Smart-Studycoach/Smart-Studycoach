"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SELECT_DROPDOWN_SVG = `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`;

const SELECT_STYLES = {
  backgroundImage: SELECT_DROPDOWN_SVG,
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.5em 1.5em",
  paddingRight: "2.5rem",
};

interface ModuleFiltersProps {
  levels?: string[];
  studyCredits?: string[];
  locations?: string[];
  difficulties?: string[];
}

export function ModuleFilters({
  levels = [],
  studyCredits = [],
  locations = [],
  difficulties = [],
}: ModuleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const [studyCredit, setStudyCredit] = useState(
    searchParams.get("studyCredit") || ""
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (level) params.set("level", level);
    if (studyCredit) params.set("studyCredit", studyCredit);
    if (location) params.set("location", location);
    if (difficulty) params.set("difficulty", difficulty);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const selectClassName =
    "px-6 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold focus:outline-none focus:border-[#C6002A] transition-colors cursor-pointer appearance-none";

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 border border-zinc-800">
      {/* Name Input */}
      <input
        type="text"
        placeholder="Naam"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-6 px-6 py-3 bg-transparent border-2 border-white rounded-full text-white placeholder-gray-400 font-semibold focus:outline-none focus:border-[#C6002A] transition-colors"
      />

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Level */}
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={selectClassName}
          style={SELECT_STYLES}
        >
          <option value="">Level</option>
          {levels.map((lv) => (
            <option key={lv} value={lv}>
              {lv}
            </option>
          ))}
        </select>

        {/* Study Credit */}
        <select
          value={studyCredit}
          onChange={(e) => setStudyCredit(e.target.value)}
          className={selectClassName}
          style={SELECT_STYLES}
        >
          <option value="">Study credit</option>
          {studyCredits.map((sc) => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={selectClassName}
          style={SELECT_STYLES}
        >
          <option value="">Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={selectClassName}
          style={SELECT_STYLES}
        >
          <option value="">Difficulty</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSearch}
          className="px-12 py-3 bg-[#C6002A] text-white font-bold rounded-full hover:bg-[#a00020] transition-colors"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}

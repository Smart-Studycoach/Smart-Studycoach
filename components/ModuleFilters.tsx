"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    "px-6 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold focus:outline-none focus:border-[#C6002A] transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27white%27%20stroke-width=%272%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em] pr-10";

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
        >
          <option value="" className="text-black bg-white">Level</option>
          {levels.map((lv) => (
            <option key={lv} value={lv} className="text-black bg-white">
              {lv}
            </option>
          ))}
        </select>

        {/* Study Credit */}
        <select
          value={studyCredit}
          onChange={(e) => setStudyCredit(e.target.value)}
          className={selectClassName}
        >
          <option value="" className="text-black bg-white">Study credit</option>
          {studyCredits.map((sc) => (
            <option key={sc} value={sc} className="text-black bg-white">
              {sc}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={selectClassName}
        >
          <option value="" className="text-black bg-white">Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc} className="text-black bg-white">
              {loc}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={selectClassName}
        >
          <option value="" className="text-black bg-white">Difficulty</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff} className="text-black bg-white">
              {diff}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSearch}
          className="px-12 py-3 bg-[#C6002A] text-white font-bold rounded-full hover:bg-[#a00020] transition-colors cursor-pointer"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Auto-expand if any filter is active
    Promise.resolve().then(() => {
      if (name || level || studyCredit || location || difficulty) {
        setIsExpanded(true);
      }
    });
  }, [name, level, studyCredit, location, difficulty]);

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

  const handleClear = () => {
    setName("");
    setLevel("");
    setStudyCredit("");
    setLocation("");
    setDifficulty("");
    router.push("?page=1");
  };

  const hasActiveFilters = name || level || studyCredit || location || difficulty;

  const inputClassName =
    "w-full px-4 py-2.5 bg-[#1F1F1F] border border-zinc-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C6002A] focus:ring-1 focus:ring-[#C6002A] transition-all";

  const selectClassName =
    "w-full px-4 py-2.5 bg-[#1F1F1F] border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#C6002A] focus:ring-1 focus:ring-[#C6002A] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27rgb(113,113,122)%27%20stroke-width=%272%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em] pr-10";

  return (
    <div className="mb-8">
      {/* Compact Header */}
      <div className="bg-[#1F1F1F] border border-zinc-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#252525] transition-colors"
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span className="text-white font-semibold">Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-[#C6002A] text-white text-xs font-bold rounded-full">
                Active
              </span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Expanded Filter Content */}
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-zinc-800">
            {/* Search Input */}
            <div className="mt-4 mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Zoek op naam
              </label>
              <input
                type="text"
                placeholder="Typ modulenaam..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={inputClassName}
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Niveau
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Alle niveaus</option>
                  {levels.map((lv) => (
                    <option key={lv} value={lv}>
                      {lv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Study Credit */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Studiepunten
                </label>
                <select
                  value={studyCredit}
                  onChange={(e) => setStudyCredit(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Alle punten</option>
                  {studyCredits.map((sc) => (
                    <option key={sc} value={sc}>
                      {sc} ECTS
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Locatie
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">Alle locaties</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              {difficulties.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Moeilijkheid
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="">Alle moeilijkheden</option>
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 px-6 py-2.5 bg-[#C6002A] text-white font-semibold rounded-lg hover:bg-[#a00020] transition-colors text-sm"
              >
                Filters Toepassen
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 bg-transparent border border-zinc-700 text-gray-300 font-semibold rounded-lg hover:bg-[#252525] transition-colors text-sm"
                >
                  Wissen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

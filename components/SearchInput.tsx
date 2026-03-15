"use client";
 
import { useState } from "react";
 
type Props = {
  placeholder?: string;
  onSearch: (value: string) => void;
};
 
export default function SearchInput({ placeholder, onSearch }: Props) {
 
  const [value, setValue] = useState("");
 
  const handleSearch = () => {
    onSearch(value);
  };
 
  return (
 
    <div className="flex gap-2">
 
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="border rounded px-3 py-2 w-full"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
 
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar
      </button>
 
    </div>
 
  );
 
}
 
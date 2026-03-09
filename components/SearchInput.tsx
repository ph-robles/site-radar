"use client";
import { useState } from "react";

export default function SearchInput({
  placeholder,
  onSearch,
  buttonText = "Buscar",
}: {
  placeholder: string;
  onSearch: (value: string) => void;
  buttonText?: string;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        onClick={() => onSearch(value.trim())}
        className="rounded-md bg-emerald-600 text-white px-4 hover:bg-emerald-700"
      >
        {buttonText}
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
}

export default function SearchInput({ onSearch }: Props) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch(value.trim());
    }
  }

  return (
    <input
      type="text"
      placeholder="Digite a sigla..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className="w-full p-3 border rounded-xl"
    />
  );
}
"use client"
 
export default function SearchInput({ onSearch }: any) {
  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      onSearch(e.target.value)
    }
  }
 
  return (
    <input
      type="text"
      placeholder="Digite a sigla..."
      onKeyDown={handleKeyDown}
      className="w-full p-3 border rounded-xl"
    />
  )
}
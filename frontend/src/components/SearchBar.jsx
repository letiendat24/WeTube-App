import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Mic, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useDebounce from "@/hooks/useDebounce";
import { fetchSuggestions } from "@/api/youtube";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(debouncedQuery).then((data) => {
      setSuggestions(data[1] || []);
      setOpen(true);
    });
  }, [debouncedQuery]);

  const goSearch = (value) => {
    if (!value.trim()) return;
    navigate(`/search?query=${value}`);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") goSearch(query);
  };
  return (
    <div className="flex items-center justify-center flex-1 max-w-xl px-4">
      <div className="flex w-full max-w-[600px]">
        <Input
          type="text"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-10 rounded-l-full border border-[#ccc] bg-white placeholder:text-[#606060] text-[#0f0f0f] focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          onClick={()=>goSearch(query)}
          size="icon"
          variant="secondary"
          className="rounded-r-full border border-l-0 border-[#ccc] bg-[#f8f8f8] hover:bg-[#e5e5e5] h-10 w-16 flex items-center justify-center cursor-pointer"
        >
          <Search className="h-5 w-5 text-[#0f0f0f]" />
        </Button>
      </div>
    </div>
  );
}

export default SearchBar;

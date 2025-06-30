import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Search } from "lucide-react"

interface SearchFormProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  defaultValue?: string
}

export function SearchForm({
  placeholder = "Search...",
  onSearch,
  className,
  defaultValue = "",
}: SearchFormProps) {
  const [query, setQuery] = React.useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleSearch = () => {
    onSearch?.(query)
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit" onClick={handleSearch}>
        Search
      </Button>
    </form>
  )
} 
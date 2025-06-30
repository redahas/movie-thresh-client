import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SearchForm } from "../SearchForm";

describe("SearchForm", () => {
  it("renders search input", () => {
    render(<SearchForm />);
    const searchInput = screen.getByPlaceholderText(/type to search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("renders search container with search role", () => {
    render(<SearchForm />);
    const searchContainer = screen.getByRole("search");
    expect(searchContainer).toBeInTheDocument();
  });
});

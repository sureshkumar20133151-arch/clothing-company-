"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { api } from "../../lib/api";
import { formatINR } from "../../lib/utils";

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  category?: string;
  categoryName?: string;
  image?: string;
  thumbnail?: string;
  price: number;
}

interface SearchBarProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function SearchBar({ onClose, isModal = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch live suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    api
      .get<SearchSuggestion[]>("/search/suggestions", { q: debouncedQuery })
      .then((res) => {
        if (isMounted) {
          setSuggestions(res.data || []);
        }
      })
      .catch(() => {
        if (isMounted) setSuggestions([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (slug: string) => {
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/product/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onClose) onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search handloom shirts, jamdani kurtas, cotton sarees..."
          className="w-full pl-10 pr-10 py-2.5 bg-kora-50/80 border border-kora-300 rounded-full text-xs font-medium text-indigo-950 placeholder:text-indigo-900/40 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:bg-white transition"
          autoFocus={isModal}
        />
        <Search className="w-4 h-4 text-indigo-900/60 absolute left-3.5 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 text-indigo-900/40 hover:text-indigo-950 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Live Suggestions Dropdown */}
      {isOpen && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-kora-300 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="py-6 flex items-center justify-center gap-2 text-indigo-900/60 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-terracotta-500" />
              <span>Searching handloom weaves...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-900/50 flex items-center gap-1.5 border-b border-kora-100">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Artisanal Matches
              </div>
              <ul className="divide-y divide-kora-100 max-h-80 overflow-y-auto">
                {suggestions.map((item) => {
                  const imgUrl = item.thumbnail || item.image;
                  const categoryLabel = item.categoryName || item.category || "Handloom";
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(item.slug)}
                        className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-kora-50 transition group"
                      >
                        {imgUrl ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-kora-100 shrink-0 border border-kora-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-900 flex items-center justify-center text-xs font-bold shrink-0">
                            IT
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-indigo-950 truncate group-hover:text-terracotta-600 transition">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-indigo-900/50 flex items-center gap-2 mt-0.5">
                            <span className="truncate">{categoryLabel}</span>
                            <span>•</span>
                            <span className="font-semibold text-indigo-950">
                              {formatINR(item.price)}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-900/30 group-hover:text-indigo-950 group-hover:translate-x-0.5 transition shrink-0" />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* View all search results link */}
              <div className="border-t border-kora-200 p-2 bg-kora-50/50">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 px-3 text-center text-xs font-semibold text-indigo-950 hover:bg-white rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>See all matching results for &ldquo;{debouncedQuery}&rdquo;</span>
                  <ArrowRight className="w-3 h-3 text-terracotta-500" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 text-center">
              <p className="text-xs font-medium text-indigo-950 mb-1">
                No matching garments found for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <p className="text-[11px] text-indigo-900/50">
                Try searching for &ldquo;indigo&rdquo;, &ldquo;jamdani&rdquo;, &ldquo;salem&rdquo;, or &ldquo;saree&rdquo;.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

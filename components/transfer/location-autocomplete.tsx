"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  place_name: string;
  lon: number;
  lat: number;
  relevance: number;
  place_type: string[];
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, location?: Location) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Enter location...',
  label,
  className = '',
}) => {
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [userInput, setUserInput] = useState('');
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search - only run when user has typed something
  useEffect(() => {
    // Only search if the user has actually typed (userInput is not empty)
    if (userInput.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      if (userInput.trim().length >= 2) {
        searchLocations(userInput);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userInput]);

  const searchLocations = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/location-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Location search error response:', errorData);
        throw new Error(errorData.details || 'Search failed');
      }

      const data = await response.json();
      setSuggestions(data.results || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location: Location) => {
    onChange(location.place_name, location);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectLocation(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-muted-foreground mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={inputRef as any}
          rows={1}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            setUserInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
            handleKeyDown(e as any);
          }}
          placeholder={placeholder}
          className={`flex min-h-[40px] w-full rounded-md border border-input bg-white dark:bg-input/30 px-10 py-2.5 text-[13px] md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/50 dark:text-white dark:border-input resize-none overflow-hidden ${className}`}
          autoComplete="off"
          style={{ height: 'auto', minHeight: '40px' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <MapPin className="absolute left-3 top-[13px] w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 z-50">
          Searching...
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((location, index) => (
            <button
              key={location.id}
              onClick={() => handleSelectLocation(location)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-900 dark:text-pink-200'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
              } border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">{location.place_name.split(',')[0]}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {location.place_name.substring(location.place_name.indexOf(',') + 1)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && userInput.trim().length >= 2 && suggestions.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-[#000000] border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 z-50">
          No locations found
        </div>
      )}
    </div>
  );
};

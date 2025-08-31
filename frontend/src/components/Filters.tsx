import { useState, useRef, useEffect } from 'react'
import { statusOptions } from '../utils/productUtils'
import {
    MagnifyingGlassIcon,
    XMarkIcon,
    ClockIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline'

interface FiltersProps {
    search: string
    setSearch: (value: string) => void
    status: string
    setStatus: (value: string) => void
    warehouse: string
    setWarehouse: (value: string) => void
    warehouseCodes: string[]
    loading?: boolean
}

export function Filters({
    search,
    setSearch,
    status,
    setStatus,
    warehouse,
    setWarehouse,
    warehouseCodes,
    loading = false,
}: FiltersProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const searchRef = useRef<HTMLInputElement>(null)

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('inventory-recent-searches')
        if (saved) {
            setRecentSearches(JSON.parse(saved) as string[])
        }
    }, [])

    // Save search to recent searches
    const saveSearch = (searchTerm: string) => {
        if (searchTerm.trim() && !recentSearches.includes(searchTerm)) {
            const updated = [searchTerm, ...recentSearches.slice(0, 4)]
            setRecentSearches(updated)
            localStorage.setItem(
                'inventory-recent-searches',
                JSON.stringify(updated),
            )
        }
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        if (value.length > 0) {
            setShowSuggestions(true)
        }
    }

    const handleSearchSubmit = () => {
        if (search.trim()) {
            saveSearch(search.trim())
            setShowSuggestions(false)
            searchRef.current?.blur()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
            searchRef.current?.blur()
        }
    }

    const clearSearch = () => {
        setSearch('')
        setShowSuggestions(false)
        searchRef.current?.focus()
    }

    const selectRecentSearch = (searchTerm: string) => {
        setSearch(searchTerm)
        setShowSuggestions(false)
        searchRef.current?.blur()
    }

    const clearRecentSearches = () => {
        setRecentSearches([])
        localStorage.removeItem('inventory-recent-searches')
    }

    // Smart suggestions based on common search patterns
    const smartSuggestions = [
        'critical stock',
        'low inventory',
        'warehouse A',
        'high demand',
        'surplus items',
    ]

    const filteredSuggestions = smartSuggestions.filter(
        (suggestion) =>
            suggestion.toLowerCase().includes(search.toLowerCase()) &&
            suggestion !== search,
    )

    return (
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/50 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Enhanced Search Bar */}
                <div className="relative flex-1">
                    <div className="relative">
                        {/* Search Icon */}
                        <div
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
                                isFocused
                                    ? 'text-indigo-500 scale-110'
                                    : 'text-gray-400'
                            }`}
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </div>

                        {/* Search Input */}
                        <input
                            ref={searchRef}
                            value={search}
                            onChange={(e) => { handleSearchChange(e.target.value); }}
                            onFocus={() => {
                                setIsFocused(true)
                                if (search.length > 0 || recentSearches.length > 0) {
                                    setShowSuggestions(true)
                                }
                            }}
                            onBlur={() => {
                                setIsFocused(false)
                                setTimeout(() => { setShowSuggestions(false); }, 150)
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="🔍 Search products, SKUs, or try 'critical stock'..."
                            className={`glass-input w-full pl-12 pr-12 py-4 text-gray-900 placeholder-gray-500 ${
                                isFocused ? 'transform scale-[1.02]' : ''
                            }`}
                        />

                        {/* Clear Button */}
                        {search && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions &&
                            (isFocused || search.length > 0) && (
                                <div className="search-dropdown animate-in">
                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div className="p-4 border-b border-gray-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-2">
                                                    <ClockIcon className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-600">
                                                        Recent Searches
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearRecentSearches
                                                    }
                                                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                {recentSearches.map((recent) => (
                                                    <button
                                                        type="button"
                                                        key={`recent-${recent}`}
                                                        onClick={() => {
                                                            selectRecentSearch(recent)
                                                        }}
                                                        className="suggestion-item"
                                                    >
                                                        {recent}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Smart Suggestions */}
                                    {filteredSuggestions.length > 0 && (
                                        <div className="p-4">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <SparklesIcon className="h-4 w-4 text-indigo-500" />
                                                <span className="text-sm font-medium text-gray-600">
                                                    Smart Suggestions
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                {filteredSuggestions.map((suggestion) => (
                                                    <button
                                                        type="button"
                                                        key={`suggestion-${suggestion}`}
                                                        onClick={() => {
                                                            selectRecentSearch(suggestion)
                                                        }}
                                                        className="suggestion-item hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                                                    >
                                                        <span className="font-medium">{suggestion}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No suggestions */}
                                    {recentSearches.length === 0 &&
                                        filteredSuggestions.length === 0 &&
                                        search.length === 0 && (
                                            <div className="p-6 text-center text-gray-500">
                                                <SparklesIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">
                                                    Start typing to see
                                                    suggestions
                                                </p>
                                            </div>
                                        )}
                                </div>
                            )}
                    </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value) }}
                            className="form-select w-full sm:w-44"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
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
                        </div>
                    </div>

                    <div className="relative">
                        <select
                            value={warehouse}
                            onChange={(e) => { setWarehouse(e.target.value) }}
                            disabled={loading}
                            className={`form-select w-full sm:w-44 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="">All Warehouses</option>
                            {warehouseCodes.map((code) => (
                                <option key={code} value={code}>
                                    Warehouse {code}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

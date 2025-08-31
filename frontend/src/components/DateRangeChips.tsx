import { useDateRange, DateRange } from '../hooks/useDateRange'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface DateRangeChipsProps {
    compact?: boolean
}

export function DateRangeChips({ compact = false }: DateRangeChipsProps) {
    const { dateRange, setDateRange, getRangeInfo } = useDateRange()
    const rangeInfo = getRangeInfo()

    const ranges: { value: DateRange; label: string; shortLabel: string }[] = [
        { value: '7d', label: '7 Days', shortLabel: '7d' },
        { value: '14d', label: '14 Days', shortLabel: '14d' },
        { value: '30d', label: '30 Days', shortLabel: '30d' },
    ]

    if (compact) {
        return (
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                        Range:
                    </span>
                </div>
                <div className="flex gap-1">
                    {ranges.map((range) => (
                        <button
                            type="button"
                            key={range.value}
                            onClick={() => {
                                setDateRange(range.value)
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                                dateRange === range.value
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                                    : 'bg-white/70 text-gray-600 hover:bg-white hover:text-indigo-600 border border-gray-200/50'
                            }`}
                        >
                            {range.shortLabel}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <CalendarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Time Range
                        </h3>
                        <p className="text-sm text-gray-600">
                            {rangeInfo.description}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">
                        {rangeInfo.days}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                        days selected
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {ranges.map((range) => (
                    <button
                        type="button"
                        key={range.value}
                        onClick={() => {
                            setDateRange(range.value)
                        }}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            dateRange === range.value
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white/50 text-gray-700 hover:bg-white/80 hover:text-indigo-600 border border-gray-200/50'
                        }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-indigo-700 font-medium">
                        Analyzing data from:
                    </span>
                    <span className="text-indigo-600">
                        {new Date(
                            Date.now() - rangeInfo.days * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString()}{' '}
                        - {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

import { useState, createContext, useMemo, useContext, ReactNode } from 'react'

export type DateRange = '7d' | '14d' | '30d'

interface DateRangeContextType {
    dateRange: DateRange
    setDateRange: (range: DateRange) => void
    getRangeInfo: () => {
        label: string
        days: number
        description: string
    }
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
    undefined,
)

export function DateRangeProvider({ children }: { children: ReactNode }) {
    const [dateRange, setDateRange] = useState<DateRange>('7d')

    const getRangeInfo = () => {
        switch (dateRange) {
            case '7d':
                return {
                    label: '7 Days',
                    days: 7,
                    description: 'Last week trends and patterns',
                }
            case '14d':
                return {
                    label: '14 Days',
                    days: 14,
                    description: 'Two week performance overview',
                }
            case '30d':
                return {
                    label: '30 Days',
                    days: 30,
                    description: 'Monthly inventory analysis',
                }
            default:
                return {
                    label: '7 Days',
                    days: 7,
                    description: 'Last week trends and patterns',
                }
        }
    }

    const value = useMemo(
        () => ({ dateRange, setDateRange, getRangeInfo }),
        [dateRange],
    )

    return (
        <DateRangeContext value={value}>
            {children}
        </DateRangeContext>
    )
}

export function useDateRange() {
    const context = useContext(DateRangeContext)
    if (context === undefined) {
        throw new Error('useDateRange must be used within a DateRangeProvider')
    }
    return context
}

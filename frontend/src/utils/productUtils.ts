import { Product, ProductStatus } from '../types/product'

export function getProductStatus(product: Product): ProductStatus {
    if (product.stock < product.demand) {
        return { label: 'Critical', color: 'red' }
    }
    if (product.stock > product.demand) {
        return { label: 'Healthy', color: 'green' }
    }
    return { label: 'Low', color: 'yellow' }
}

export const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Critical', value: 'critical' },
    { label: 'Low', value: 'low' },
    { label: 'Healthy', value: 'healthy' },
]

export function getDateRangeDescription(range: string): string {
    switch (range) {
        case '7d':
            return 'Last 7 days - Recent trends and daily fluctuations'
        case '14d':
            return 'Last 14 days - Two-week patterns and weekly cycles'
        case '30d':
            return 'Last 30 days - Monthly trends and seasonal patterns'
        default:
            return 'Custom date range analysis'
    }
}

export function formatDateRange(days: number): { start: string; end: string } {
    const end = new Date()
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const formatOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: end.getFullYear() !== start.getFullYear() ? 'numeric' : undefined,
    }

    return {
        start: start.toLocaleDateString('en-US', formatOptions),
        end: end.toLocaleDateString('en-US', formatOptions),
    }
}

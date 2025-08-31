import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { KPIS_QUERY } from '../graphql/queries'
import { useDateRange } from '../hooks/useDateRange'


interface KPI {
    date: string
    stock: number
    demand: number
}

interface ChartDimensions {
    width: number
    height: number
    padding: { top: number; right: number; bottom: number; left: number }
    chartWidth: number
    chartHeight: number
}

interface ScaleConfig {
    maxValue: number
    minValue: number
    valueRange: number
}

export function StockDemandChart(): JSX.Element {
    const [hoveredPoint, setHoveredPoint] = useState<{
        x: number
        y: number
        data: KPI
    } | null>(null)
    const { dateRange, getRangeInfo } = useDateRange()
    const rangeInfo = getRangeInfo()

    const { data, loading, error } = useQuery(KPIS_QUERY, {
        variables: { range: dateRange },
    })

    const kpis: KPI[] = data?.kpis ?? []

    // Chart configuration
    const chartDimensions: ChartDimensions = {
        width: 600,
        height: 200,
        padding: { top: 20, right: 40, bottom: 40, left: 60 },
        get chartWidth() {
            return this.width - this.padding.left - this.padding.right
        },
        get chartHeight() {
            return this.height - this.padding.top - this.padding.bottom
        },
    }

    const getScaleConfig = (data: KPI[]): ScaleConfig => {
        const allValues = data.flatMap((d) => [d.stock, d.demand])
        const maxValue = Math.max(...allValues)
        const minValue = Math.min(...allValues)
        return {
            maxValue,
            minValue,
            valueRange: maxValue - minValue,
        }
    }

    const createScaleFunctions = (
        scaleConfig: ScaleConfig,
        dimensions: ChartDimensions,
    ) => {
        const yScale = (value: number) =>
            dimensions.chartHeight -
            ((value - scaleConfig.minValue) / scaleConfig.valueRange) *
                dimensions.chartHeight

        const xScale = (index: number, dataLength: number) =>
            (index / (dataLength - 1)) * dimensions.chartWidth

        return { yScale, xScale }
    }

    const createPath = (
        data: KPI[],
        dataKey: 'stock' | 'demand',
        xScale: (index: number, dataLength: number) => number,
        yScale: (value: number) => number,
    ) => {
        return data
            .map((d, i) => {
                const x = xScale(i, data.length)
                const y = yScale(d[dataKey])
                return `${i === 0 ? 'M' : 'L'} ${String(x)} ${String(y)}`
            })
            .join(' ')
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    }

    const formatTooltipDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        })
    }

    const handlePointHover = (event: React.MouseEvent, data: KPI) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setHoveredPoint({
            x: rect.left + rect.width / 2,
            y: rect.top,
            data,
        })
    }

    const renderLoadingState = () => (
        <div className="chart-container">
            <div className="flex items-center justify-center h-64">
                <div className="relative">
                    <div className="spinner"></div>
                    <div className="spinner-overlay"></div>
                </div>
            </div>
        </div>
    )

    const renderErrorState = () => (
        <div className="chart-container">
            <div className="chart-header">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
                    <p className="text-sm text-gray-600">Daily inventory levels over time</p>
                </div>
            </div>
            <div className="h-64 flex flex-col items-center justify-center text-red-600">
                <div className="text-red-500 text-4xl mb-2">⚠️</div>
                <p className="font-medium">Error loading chart data</p>
                <p className="text-sm text-gray-600 mt-1">{error?.message}</p>
            </div>
        </div>
    )

    const renderEmptyState = () => (
        <div className="chart-container">
            <div className="chart-header">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
                    <p className="text-sm text-gray-600">Daily inventory levels over time</p>
                </div>
            </div>
            <div className="h-64 flex items-center justify-center text-gray-500">
                No data available for the selected range
            </div>
        </div>
    )

    if (loading) return renderLoadingState()
    if (error) return renderErrorState()
    if (kpis.length === 0) return renderEmptyState()

    const scaleConfig = getScaleConfig(kpis)
    const { yScale, xScale } = createScaleFunctions(
        scaleConfig,
        chartDimensions,
    )

    const stockPath = createPath(kpis, 'stock', xScale, yScale)
    const demandPath = createPath(kpis, 'demand', xScale, yScale)

    const renderYAxisTicks = () => {
        return [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const value = scaleConfig.minValue + scaleConfig.valueRange * ratio
            const y =
                chartDimensions.padding.top +
                chartDimensions.chartHeight -
                ratio * chartDimensions.chartHeight
            return (
                <g key={ratio}>
                    <line
                        x1={chartDimensions.padding.left - 5}
                        y1={y}
                        x2={chartDimensions.padding.left}
                        y2={y}
                        stroke="#64748b"
                    />
                    <text
                        x={chartDimensions.padding.left - 10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="12"
                        fill="#64748b"
                    >
                        {Math.round(value).toLocaleString()}
                    </text>
                </g>
            )
        })
    }

    const renderXAxisTicks = () => {
        return kpis.map((d, i) => {
            if (i % Math.ceil(kpis.length / 5) === 0 || i === kpis.length - 1) {
                const x = chartDimensions.padding.left + xScale(i, kpis.length)
                return (
                    <g key={i}>
                        <line
                            x1={x}
                            y1={
                                chartDimensions.padding.top +
                                chartDimensions.chartHeight
                            }
                            x2={x}
                            y2={
                                chartDimensions.padding.top +
                                chartDimensions.chartHeight +
                                5
                            }
                            stroke="#64748b"
                        />
                        <text
                            x={x}
                            y={
                                chartDimensions.padding.top +
                                chartDimensions.chartHeight +
                                20
                            }
                            textAnchor="middle"
                            fontSize="12"
                            fill="#64748b"
                        >
                            {formatDate(d.date)}
                        </text>
                    </g>
                )
            }
            return null
        })
    }

    const renderDataPoints = () => {
        return kpis.map((d, i) => {
            const x = xScale(i, kpis.length)
            const stockY = yScale(d.stock)
            const demandY = yScale(d.demand)

            return (
                <g key={i}>
                    <circle
                        cx={x}
                        cy={stockY}
                        r="4"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={(e) => { handlePointHover(e, d); }}
                        onMouseLeave={() => { setHoveredPoint(null); }}
                    />
                    <circle
                        cx={x}
                        cy={demandY}
                        r="4"
                        fill="#8b5cf6"
                        stroke="white"
                        strokeWidth="2"
                        className="cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={(e) => { handlePointHover(e, d); }}
                        onMouseLeave={() => { setHoveredPoint(null); }}
                    />
                </g>
            )
        })
    }

    const renderTooltip = () => {
        if (!hoveredPoint) return null

        return (
            <div
                className="absolute z-10 bg-white/95 backdrop-blur-sm border border-white/30 rounded-lg p-3 shadow-lg pointer-events-none"
                style={{
                    left: hoveredPoint.x - 100,
                    top: hoveredPoint.y - 80,
                }}
            >
                <div className="text-sm font-medium text-gray-900 mb-1">
                    {formatTooltipDate(hoveredPoint.data.date)}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                            Stock: {hoveredPoint.data.stock.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                            Demand: {hoveredPoint.data.demand.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    const renderLegend = () => (
        <div className="chart-legend">
            <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">Stock</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-purple-500"></div>
                <span className="text-sm font-medium text-gray-700">Demand</span>
            </div>
        </div>
    )

    return (
        <div className="chart-container">
            <div className="chart-header">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Stock vs Demand Trend</h3>
                    <p className="text-sm text-gray-600">
                        Daily inventory levels over {rangeInfo.label.toLowerCase()}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-indigo-600">{rangeInfo.label}</div>
                    <div className="text-xs text-gray-500">{kpis.length} data points</div>
                </div>
            </div>

            <div className="relative">
                <svg
                    width="100%"
                    viewBox={`0 0 ${String(chartDimensions.width)} ${String(chartDimensions.height)}`}
                    className="overflow-visible"
                >
                    <defs>
                        <pattern
                            id="grid"
                            width="40"
                            height="40"
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d="M 40 0 L 0 0 0 40"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="1"
                                opacity="0.5"
                            />
                        </pattern>
                    </defs>

                    <rect
                        x={chartDimensions.padding.left}
                        y={chartDimensions.padding.top}
                        width={chartDimensions.chartWidth}
                        height={chartDimensions.chartHeight}
                        fill="white"
                    />
                    <rect
                        x={chartDimensions.padding.left}
                        y={chartDimensions.padding.top}
                        width={chartDimensions.chartWidth}
                        height={chartDimensions.chartHeight}
                        fill="url(#grid)"
                    />

                    {renderYAxisTicks()}
                    {renderXAxisTicks()}

                    <g
                        transform={`translate(${String(chartDimensions.padding.left)}, ${String(chartDimensions.padding.top)})`}
                    >
                        <path
                            d={stockPath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        <path
                            d={demandPath}
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {renderDataPoints()}
                    </g>
                </svg>

                {renderTooltip()}
            </div>

            {renderLegend()}
        </div>
    )
}

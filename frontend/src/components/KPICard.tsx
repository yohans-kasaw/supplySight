import { ReactNode } from 'react'

interface KPICardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
    color: 'blue' | 'green' | 'purple' | 'amber'
}

export function KPICard({
    title,
    value,
    subtitle,
    icon,
    trend,
    color,
}: KPICardProps) {
    const colorMap = {
        blue: {
            gradient: 'from-blue-500 to-cyan-500',
            bg: 'bg-blue-50/80',
            text: 'text-blue-700',
            iconBg: 'from-blue-500 to-cyan-600',
            shine: 'from-blue-400/20 to-cyan-400/20',
        },
        green: {
            gradient: 'from-emerald-500 to-green-500',
            bg: 'bg-emerald-50/80',
            text: 'text-emerald-700',
            iconBg: 'from-emerald-500 to-green-600',
            shine: 'from-emerald-400/20 to-green-400/20',
        },
        purple: {
            gradient: 'from-purple-500 to-indigo-500',
            bg: 'bg-purple-50/80',
            text: 'text-purple-700',
            iconBg: 'from-purple-500 to-indigo-600',
            shine: 'from-purple-400/20 to-indigo-400/20',
        },
        amber: {
            gradient: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50/80',
            text: 'text-amber-700',
            iconBg: 'from-amber-500 to-orange-600',
            shine: 'from-amber-400/20 to-orange-400/20',
        },
    }

    const colors = colorMap[color]

    return (
        <div className="relative group">
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${colors.shine} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                    className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300 -z-10`}
                />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`p-3 bg-gradient-to-br ${colors.iconBg} rounded-xl shadow-lg`}
                        >
                            <div className="w-6 h-6 text-white">{icon}</div>
                        </div>
                        {trend && (
                            <div
                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    trend.isPositive
                                        ? 'bg-green-100/80 text-green-700'
                                        : 'bg-red-100/80 text-red-700'
                                }`}
                            >
                                <span>{trend.isPositive ? '↗' : '↘'}</span>
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            {title}
                        </h3>
                        <div
                            className={`text-3xl font-bold ${colors.text} bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
                        >
                            {value}
                        </div>
                        {subtitle && (
                            <p className="text-sm text-gray-500 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </div>
        </div>
    )
}

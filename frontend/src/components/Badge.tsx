interface BadgeProps {
    children: string
    color: 'yellow' | 'green' | 'red'
    size?: 'sm' | 'md'
}

export function Badge({ children, color, size = 'sm' }: BadgeProps) {
    const colorMap = {
        yellow: 'bg-yellow-100 text-yellow-800 ring-yellow-600/20',
        green: 'bg-green-100 text-green-800 ring-green-600/20',
        red: 'bg-red-100 text-red-800 ring-red-600/20',
    } as const

    const sizeMap = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    } as const

    return (
        <span
            className={`inline-flex items-center rounded font-medium ring-1 ring-inset ${colorMap[color]} ${sizeMap[size]}`}
        >
            {children}
        </span>
    )
}

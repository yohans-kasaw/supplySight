import { ArchiveBoxIcon, CubeIcon } from '@heroicons/react/24/outline'
import { DateRangeChips } from './DateRangeChips'

interface AppHeaderProps {
    totalProducts: number
}

export function AppHeader({ totalProducts }: AppHeaderProps) {
    return (
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 sticky top-0 z-40 shadow-lg shadow-indigo-100/20">
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="mx-auto max-w-7xl px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-4 group">
                            <div className="relative">
                                <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                                    <ArchiveBoxIcon className="h-7 w-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent tracking-tight">
                                    SupplySight
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                    <p className="text-sm text-gray-600 font-semibold tracking-wide">
                                        Smart Warehouse Management
                                    </p>
                                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex flex-grow justify-center">
                        <DateRangeChips compact />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="lg:hidden">
                            <DateRangeChips compact />
                        </div>

                        <div className="flex items-center space-x-4">
                            {totalProducts > 0 && (
                                <div className="group relative">
                                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 text-indigo-700 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
                                        <div className="flex items-center space-x-2">
                                            <CubeIcon className="h-4 w-4" />
                                            <span>
                                                {totalProducts.toLocaleString()}
                                            </span>
                                            <span className="text-indigo-500">
                                                products
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                        Total inventory items
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
        </header>
    )
}

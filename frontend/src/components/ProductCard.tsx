import { Product } from '../types/product'
import { getProductStatus } from '../utils/productUtils'
import { Badge } from './Badge'
import { ArrowRightIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'

interface ProductCardProps {
    product: Product
    onClick: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const status = getProductStatus(product)
    const stockRatio = product.stock / Math.max(1, product.demand)
    const stockPercentage = Math.min(100, Math.round(stockRatio * 100))
    const isOverstocked = product.stock > product.demand
    const isUnderstocked = product.stock < product.demand

    const cardClass = status.color === 'red' ? 'product-card product-card-critical' : 'product-card product-card-normal'
    
    const indicatorColor = {
        green: 'bg-green-400',
        yellow: 'bg-yellow-400',
        red: 'bg-red-400',
    }[status.color]

    const progressBarColor = {
        green: 'bg-gradient-to-r from-green-400 to-emerald-500',
        yellow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        red: 'bg-gradient-to-r from-red-400 to-red-600',
    }[status.color]

    return (
        <div className={cardClass} onClick={() => onClick(product)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative">
                        <div className="product-icon">
                            <ArchiveBoxIcon className="w-6 h-6" />
                        </div>
                        <div className={`status-indicator ${indicatorColor}`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                {product.name}
                            </h3>
                            <Badge color={status.color} size="sm">
                                {status.label}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium">SKU: {product.sku}</span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center space-x-1">
                                <span>📍</span>
                                <span className="font-medium">Warehouse {product.warehouse}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <div className="metric-box bg-blue-100/50 border-blue-200/50">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-blue-600">{product.stock}</div>
                                    <div className="text-xs text-blue-500 font-medium">Stock</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex items-center space-x-2">
                                {isOverstocked && <span className="text-green-500 text-lg">📈</span>}
                                {isUnderstocked && <span className="text-red-500 text-lg">📉</span>}
                                {!isOverstocked && !isUnderstocked && <span className="text-yellow-500 text-lg">⚖️</span>}
                                <div className="text-xs font-medium text-gray-500">
                                    {isOverstocked ? 'Surplus' : isUnderstocked ? 'Shortage' : 'Balanced'}
                                </div>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className={`progress-fill ${progressBarColor}`}
                                    style={{ width: `${String(stockPercentage)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs font-bold text-gray-700">{stockPercentage}%</div>
                        </div>

                        <div className="text-center">
                            <div className="metric-box bg-emerald-100/50 border-emerald-200/50">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-emerald-600">{product.demand}</div>
                                    <div className="text-xs text-emerald-500 font-medium">Demand</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-indigo-500 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                        <ArrowRightIcon className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}

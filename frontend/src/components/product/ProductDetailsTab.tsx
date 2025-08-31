import { Product, ProductStatus } from '../../types/product'
import { Badge } from '../Badge'

interface ProductDetailsTabProps {
    product: Product
    status: ProductStatus
    stockPercentage: number
}

export function ProductDetailsTab({
    product,
    status,
    stockPercentage,
}: ProductDetailsTabProps) {
    const progressBarColor = {
        green: 'bg-gradient-to-r from-green-400 to-green-600',
        yellow: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        red: 'bg-gradient-to-r from-red-400 to-red-600',
    }[status.color]

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <Badge color={status.color}>{status.label}</Badge>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    ID: {product.id}
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {product.sku}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Warehouse
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {product.warehouse}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Stock
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {product.stock}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">
                            Demand
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {product.demand}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">
                        Stock Level
                    </span>
                    <span className="font-bold text-gray-900">
                        {stockPercentage}%
                    </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${progressBarColor}`}
                        style={{
                            width: `${stockPercentage}%`,
                        }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import { Product } from '../../types/product'

interface ProductDemandTabProps {
    product: Product
    onUpdateDemand: (id: string, demand: number) => Promise<void>
    busy?: boolean
}

export function ProductDemandTab({
    product,
    onUpdateDemand,
    busy,
}: ProductDemandTabProps) {
    const [demand, setDemand] = useState<number | ''>('')
    const [demandError, setDemandError] = useState<string>('')

    useEffect(() => {
        if (product) {
            setDemand(product.demand)
            setDemandError('')
        }
    }, [product])

    const validateDemand = (value: number | ''): string => {
        if (value === '') return ''
        if (!Number.isInteger(value)) return 'Demand must be a whole number'
        if (value < 0) return 'Demand cannot be negative'
        return ''
    }

    const handleDemandChange = (value: number | '') => {
        setDemand(value)
        setDemandError(validateDemand(value))
    }

    const isDemandValid =
        demand !== '' &&
        demand >= 0 &&
        Number.isInteger(demand) &&
        demandError === ''

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-blue-100/30 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {product.demand}
                        </div>
                        <div className="text-xs text-blue-500 font-medium">
                            Current Demand
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {product.stock}
                        </div>
                        <div className="text-xs text-green-500 font-medium">
                            Current Stock
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        New Demand Level
                    </label>
                    <input
                        type="number"
                        value={demand}
                        min={0}
                        step={1}
                        onChange={(e) =>
                            handleDemandChange(
                                e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                            )
                        }
                        className={`input-base ${
                            demandError ? 'input-error' : 'input-default'
                        }`}
                    />
                    {demandError && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                            ⚠️ {demandError}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    disabled={
                        busy || demand === product.demand || !isDemandValid
                    }
                    onClick={() => {
                        void onUpdateDemand(product.id, demand as number)
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                    {busy ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                        </div>
                    ) : (
                        'Update Demand'
                    )}
                </button>
            </div>
        </div>
    )
}

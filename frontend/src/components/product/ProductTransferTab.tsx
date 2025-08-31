import { useState, useEffect } from 'react'
import { Product, TransferInput } from '../../types/product'
import { TruckIcon } from '@heroicons/react/24/outline'

interface ProductTransferTabProps {
    product: Product
    allWarehouses: string[]
    onTransfer: (input: TransferInput) => Promise<void>
    busy?: boolean
}

export function ProductTransferTab({
    product,
    allWarehouses,
    onTransfer,
    busy,
}: ProductTransferTabProps) {
    const [to, setTo] = useState<string>('')
    const [qty, setQty] = useState<number | ''>('')
    const [transferError, setTransferError] = useState<string>('')

    useEffect(() => {
        if (product) {
            setTo('')
            setQty('')
            setTransferError('')
        }
    }, [product])

    const validateTransfer = (
        toWarehouse: string,
        quantity: number | '',
    ): string => {
        if (!product) return 'Product not available'
        if (!toWarehouse) return 'Please select a destination warehouse'
        if (quantity === '') return 'Please enter a quantity'
        if (!Number.isInteger(quantity))
            return 'Quantity must be a whole number'
        if (quantity <= 0) return 'Quantity must be greater than 0'
        if (quantity > product.stock)
            return `Cannot transfer more than available stock (${product.stock})`
        return ''
    }

    const handleTransferChange = (
        toWarehouse: string,
        quantity: number | '',
    ) => {
        setTo(toWarehouse)
        setQty(quantity)
        setTransferError(validateTransfer(toWarehouse, quantity))
    }

    const isTransferValid =
        product &&
        to &&
        qty !== '' &&
        qty > 0 &&
        qty <= product.stock &&
        Number.isInteger(qty) &&
        transferError === ''

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-100/30 backdrop-blur-sm p-4 rounded-2xl border border-emerald-200/50">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-700">
                        Available Stock
                    </span>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-lg font-bold text-emerald-600">
                            {product.stock}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        From Warehouse
                    </label>
                    <input
                        value={`Warehouse ${product.warehouse}`}
                        disabled
                        className="w-full rounded-xl border border-gray-200/50 bg-white/30 py-3 px-4 text-gray-600 font-medium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        To Warehouse
                    </label>
                    <div className="relative">
                        <select
                            value={to}
                            onChange={(e) =>
                                handleTransferChange(e.target.value, qty)
                            }
                            className={`input-base appearance-none cursor-pointer ${
                                transferError && !to
                                    ? 'input-error'
                                    : 'input-default'
                            }`}
                        >
                            <option value="">
                                Select destination warehouse
                            </option>
                            {allWarehouses
                                .filter((w) => w !== product.warehouse)
                                .map((w) => (
                                    <option key={w} value={w}>
                                        Warehouse {w}
                                    </option>
                                ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Quantity to Transfer
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={product.stock}
                        step={1}
                        value={qty}
                        onChange={(e) =>
                            handleTransferChange(
                                to,
                                e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                            )
                        }
                        className={`input-base ${
                            transferError && qty !== ''
                                ? 'input-error'
                                : 'input-default'
                        }`}
                        placeholder="Enter quantity"
                    />
                    {transferError && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                            ⚠️ {transferError}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    disabled={busy || !isTransferValid}
                    className={`w-full py-3 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl ${
                        busy || !isTransferValid
                            ? 'bg-gray-400 cursor-not-allowed opacity-60'
                            : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                    onClick={() => {
                        void onTransfer({
                            id: product.id,
                            from: product.warehouse,
                            to,
                            qty: qty as number,
                        })
                    }}
                >
                    {busy ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing Transfer...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2">
                            <TruckIcon className="w-5 h-5" />
                            <span>Transfer Stock</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}

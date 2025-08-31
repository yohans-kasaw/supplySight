import { useState, useEffect, Fragment } from 'react'
import {
    Dialog,
    Transition,
    TransitionChild,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react'
import { Product, TransferInput } from '../types/product'
import { getProductStatus } from '../utils/productUtils'
import {
    XMarkIcon,
    ChartBarIcon,
    ArchiveBoxIcon,
    TruckIcon,
} from '@heroicons/react/24/outline'
import { ProductDetailsTab } from './product/ProductDetailsTab'
import { ProductDemandTab } from './product/ProductDemandTab'
import { ProductTransferTab } from './product/ProductTransferTab'

interface ProductDrawerProps {
    product: Product | null
    isOpen: boolean
    onClose: () => void
    allWarehouses: string[]
    onUpdateDemand: (id: string, demand: number) => Promise<void>
    onTransfer: (input: TransferInput) => Promise<void>
    busy?: boolean
}

export function ProductDrawer({
    product,
    isOpen,
    onClose,
    allWarehouses,
    onUpdateDemand,
    onTransfer,
    busy,
}: ProductDrawerProps) {
    const [activeTab, setActiveTab] = useState<
        'details' | 'demand' | 'transfer'
    >('details')

    useEffect(() => {
        if (product) {
            setActiveTab('details')
        }
    }, [product])

    if (!product) return null

    const status = getProductStatus(product)
    const stockRatio = product.stock / Math.max(1, product.demand)
    const stockPercentage = Math.min(100, Math.round(stockRatio * 100))

    const tabs = [
        { id: 'details', label: 'Details', icon: ArchiveBoxIcon },
        { id: 'demand', label: 'Demand', icon: ChartBarIcon },
        { id: 'transfer', label: 'Transfer', icon: TruckIcon },
    ]

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-xs" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto w-screen sm:w-[480px]">
                                    <div className="drawer-panel">
                                        <div className="drawer-header">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                                                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                    {product.name}
                                                </DialogTitle>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="p-2 hover:bg-gray-100/80 rounded-xl text-gray-500 hover:text-gray-700 transition-all"
                                            >
                                                <XMarkIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="drawer-tabs">
                                            {tabs.map((tab) => (
                                                <button
                                                    type="button"
                                                    key={tab.id}
                                                    className={`drawer-tab ${
                                                        activeTab === tab.id ? 'drawer-tab-active' : 'drawer-tab-inactive'
                                                    }`}
                                                    onClick={() =>
                                                        { setActiveTab(tab.id as 'details' | 'demand' | 'transfer'); }
                                                    }
                                                >
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <tab.icon className="w-5 h-5" />
                                                        <span>{tab.label}</span>
                                                    </div>
                                                    {activeTab === tab.id && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6">
                                            {activeTab === 'details' && (
                                                <ProductDetailsTab
                                                    product={product}
                                                    status={status}
                                                    stockPercentage={
                                                        stockPercentage
                                                    }
                                                />
                                            )}

                                            {activeTab === 'demand' && (
                                                <ProductDemandTab
                                                    product={product}
                                                    onUpdateDemand={
                                                        onUpdateDemand
                                                    }
                                                    busy={busy}
                                                />
                                            )}

                                            {activeTab === 'transfer' && (
                                                <ProductTransferTab
                                                    product={product}
                                                    allWarehouses={
                                                        allWarehouses
                                                    }
                                                    onTransfer={onTransfer}
                                                    busy={busy}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

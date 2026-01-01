'use client';

import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Order } from '@/types';
import {
    Eye,
    Search,
    Filter,
    Loader2,
    X,
    CheckCircle2,
    Clock,
    Truck,
    Package,
    XCircle
} from 'lucide-react';

const ORDER_STATUSES = ['pending', 'preparing', 'delivering', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            setOrders(response.documents as unknown as Order[]);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        if (!confirm(`Change order status to ${newStatus}?`)) return;

        setUpdatingStatus(true);
        try {
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                orderId,
                {
                    order_status: newStatus,
                    // Auto-update payment status if delivered? Maybe not, keep separate.
                    // But if cancelled, maybe payment status -> failed/refunded?
                }
            );

            // Update local state
            setOrders(prev => prev.map(o => o.$id === orderId ? { ...o, order_status: newStatus } : o));

            if (selectedOrder && selectedOrder.$id === orderId) {
                setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status.');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'preparing': return 'bg-blue-100 text-blue-700';
            case 'delivering': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === 'All' || (order.order_status || 'pending') === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const openDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-[#181C2E] mb-8">Order Management</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search order # or user ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] bg-white min-w-[150px]"
                    >
                        <option value="All">All Statuses</option>
                        {ORDER_STATUSES.map(status => (
                            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-500 text-sm">Order #</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Date</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Customer</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Total</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Status</th>
                                <th className="p-4 font-medium text-gray-500 text-sm">Payment</th>
                                <th className="p-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map(order => (
                                <tr key={order.$id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-[#181C2E]">{order.order_number}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        {new Date(order.$createdAt).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 max-w-[150px] truncate" title={order.user_id}>
                                        {order.user_id}
                                    </td>
                                    <td className="p-4 font-bold text-[#181C2E]">{order.total.toLocaleString('vi-VN')}đ</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${order.order_status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                            order.order_status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                                order.order_status === 'delivering' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    order.order_status === 'preparing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {order.order_status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold uppercase ${order.payment_status === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>
                                                {order.payment_status}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium">{order.payment_method}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => openDetails(order)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <div>
                                <h2 className="text-xl font-bold text-[#181C2E]">Order Details</h2>
                                <p className="text-sm text-gray-500">#{selectedOrder.order_number}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Control */}
                            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Current Status</p>
                                    <span className={`px-3 py-1 rounded-lg font-bold text-sm ${getStatusColor(selectedOrder.order_status || 'pending')}`}>
                                        {(selectedOrder.order_status || 'pending').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Change to:</span>
                                    <select
                                        value={selectedOrder.order_status || 'pending'}
                                        onChange={(e) => handleUpdateStatus(selectedOrder.$id, e.target.value)}
                                        disabled={updatingStatus}
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE8C00] bg-white text-sm"
                                    >
                                        {ORDER_STATUSES.map(s => (
                                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Customer & Delivery */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-[#181C2E] mb-3 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-400" /> Delivery Info
                                    </h3>
                                    <div className="bg-white border border-gray-100 p-4 rounded-xl text-sm space-y-2">
                                        <p><span className="text-gray-500">Address:</span> <br />{selectedOrder.delivery_address}</p>
                                        <p><span className="text-gray-500">User ID:</span> <br /><span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{selectedOrder.user_id}</span></p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#181C2E] mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" /> Timeline
                                    </h3>
                                    <div className="bg-white border border-gray-100 p-4 rounded-xl text-sm space-y-2">
                                        <p><span className="text-gray-500">Created:</span> <br />{new Date(selectedOrder.$createdAt).toLocaleString()}</p>
                                        <p><span className="text-gray-500">Updated:</span> <br />{new Date(selectedOrder.$updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-[#181C2E] mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-400" /> Order Items
                                </h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 font-medium text-gray-500">Item</th>
                                                <th className="p-3 font-medium text-gray-500">Qty</th>
                                                <th className="p-3 font-medium text-gray-500 text-right">Price</th>
                                                <th className="p-3 font-medium text-gray-500 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {JSON.parse(selectedOrder.items).map((item: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                                <img src={item.image_url} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="font-medium text-[#181C2E]">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">{item.price.toLocaleString('vi-VN')}đ</td>
                                                    <td className="p-3 text-right font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 font-bold text-[#181C2E]">
                                            <tr>
                                                <td colSpan={3} className="p-3 text-right">Total Amount</td>
                                                <td className="p-3 text-right text-[#FE8C00] text-lg">
                                                    {selectedOrder.total.toLocaleString('vi-VN')}đ
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

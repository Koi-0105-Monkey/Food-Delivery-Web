'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { Order, Address } from '@/types';
import { LogOut, Package, MapPin, Loader2, Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [newAddress, setNewAddress] = useState('');
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchOrders(user.$id);
            fetchAddresses(user.$id);
        }
    }, [user, loading, router]);

    const fetchOrders = async (userId: string) => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                [
                    Query.equal('user_id', userId),
                    Query.orderDesc('$createdAt')
                ]
            );
            setOrders(response.documents as unknown as Order[]);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const fetchAddresses = async (userId: string) => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.addressesCollectionId,
                [Query.equal('user_id', userId)]
            );
            setAddresses(response.documents as unknown as Address[]);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newAddress.trim()) return;

        try {
            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.addressesCollectionId,
                ID.unique(),
                {
                    user_id: user.$id,
                    fullAddress: newAddress,
                    isDefault: addresses.length === 0 // First address is default
                }
            );
            setAddresses([...addresses, response as unknown as Address]);
            setNewAddress('');
            setIsAddingAddress(false);
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.addressesCollectionId,
                addressId
            );
            setAddresses(addresses.filter(a => a.$id !== addressId));
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
                <Loader2 className="w-8 h-8 text-[#FE8C00] animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-[#F3F4F6] py-12">
            <div className="container-custom">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-[#FFF5E6] rounded-full flex items-center justify-center text-4xl">
                                {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#181C2E] mb-2">{user.name}</h1>
                                <p className="text-[#878787] flex items-center gap-2">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                            <h2 className="text-xl font-bold text-[#181C2E] mb-6">Account Stats</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center">
                                            <Package className="w-5 h-5 text-[#FE8C00]" />
                                        </div>
                                        <span className="font-medium text-[#181C2E]">Total Orders</span>
                                    </div>
                                    <span className="text-lg font-bold text-[#181C2E]">{orders.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#E6F7FF] rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-[#1890FF]" />
                                        </div>
                                        <span className="font-medium text-[#181C2E]">Addresses</span>
                                    </div>
                                    <span className="text-lg font-bold text-[#181C2E]">{addresses.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address Management Sidebar */}
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#181C2E]">Saved Addresses</h2>
                                <button
                                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                                    className="text-[#FE8C00] hover:text-[#E67D00] text-sm font-medium"
                                >
                                    {isAddingAddress ? 'Cancel' : '+ Add New'}
                                </button>
                            </div>

                            {isAddingAddress && (
                                <form onSubmit={handleAddAddress} className="mb-6">
                                    <textarea
                                        value={newAddress}
                                        onChange={(e) => setNewAddress(e.target.value)}
                                        placeholder="Enter full address..."
                                        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FE8C00] mb-3 resize-none"
                                        rows={3}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-[#FE8C00] text-white rounded-lg text-sm font-semibold hover:bg-[#E67D00] transition-colors"
                                    >
                                        Save Address
                                    </button>
                                </form>
                            )}

                            {loadingAddresses ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="w-6 h-6 text-[#FE8C00] animate-spin" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <p className="text-[#878787] text-sm text-center py-4">No saved addresses yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div key={addr.$id} className="p-3 bg-[#F8F9FA] rounded-xl relative group">
                                            <p className="text-[#181C2E] text-sm pr-6">{addr.fullAddress}</p>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.$id)}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] min-h-[500px]">
                            <h2 className="text-xl font-bold text-[#181C2E] mb-6">Order History</h2>

                            {loadingOrders ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-[#FE8C00] animate-spin" />
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#181C2E] mb-2">No orders yet</h3>
                                    <p className="text-[#878787]">Looks like you haven't ordered anything yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.$id} className="border border-gray-100 rounded-2xl p-4 hover:border-[#FE8C00]/30 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-[#FFF5E6] rounded-xl flex items-center justify-center">
                                                        <span className="text-xl">🍔</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#181C2E] mb-1">Order #{order.$id.substring(0, 8)}</h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-[#878787]">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(order.$createdAt).toLocaleDateString()}
                                                            </span>
                                                            <span className="hidden sm:flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(order.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-[#FE8C00] text-lg">
                                                        {order.total.toLocaleString('vi-VN')}đ
                                                    </div>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-600' :
                                                        order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {order.payment_status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-sm">
                                                <p className="text-[#878787] line-clamp-1 max-w-[60%] sm:max-w-[70%]">
                                                    Address: {order.delivery_address}
                                                </p>
                                                <Link
                                                    href={`/orders/${order.$id}`}
                                                    className="flex items-center gap-1 text-[#FE8C00] font-medium hover:text-[#E67D00] transition-colors"
                                                >
                                                    Details
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

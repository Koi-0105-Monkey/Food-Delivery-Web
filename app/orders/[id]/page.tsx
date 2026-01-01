'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Order, CartItem } from '@/types';
import { ArrowLeft, MapPin, Clock, Package, CheckCircle, Loader2 } from 'lucide-react';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await databases.getDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.ordersCollectionId,
                    params.id as string
                );
                setOrder(response as unknown as Order);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
                <Loader2 className="w-8 h-8 text-[#FE8C00] animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] gap-4">
                <p className="text-xl text-[#181C2E] font-medium">Order not found</p>
                <button
                    onClick={() => router.push('/profile')}
                    className="text-[#FE8C00] hover:underline"
                >
                    Back to Profile
                </button>
            </div>
        );
    }

    const items: CartItem[] = JSON.parse(order.items);

    return (
        <main className="min-h-screen bg-[#F3F4F6] py-12">
            <div className="container-custom max-w-3xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#878787] hover:text-[#FE8C00] mb-6 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>

                <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-[#181C2E] mb-2">Order #{order.$id.substring(0, 8)}</h1>
                            <div className="flex items-center gap-4 text-sm text-[#878787]">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(order.$createdAt).toLocaleString()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 mb-1 justify-end">
                                <span className="text-[#878787]">Status:</span>
                                <span className="font-bold text-[#FE8C00] capitalize">Pending</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-[#FE8C00] mt-1" />
                            <div>
                                <h3 className="font-semibold text-[#181C2E]">Delivery Address</h3>
                                <p className="text-[#878787]">{order.delivery_address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-[#181C2E]">Order Items</h3>
                        {items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[#181C2E]">{item.name}</p>
                                        <p className="text-sm text-[#878787]">x{item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-medium text-[#181C2E]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-100 py-6 space-y-2">
                        <div className="flex justify-between items-center text-[#878787]">
                            <span>Subtotal</span>
                            <span>{order.total.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between items-center text-[#878787]">
                            <span>Delivery Fee</span>
                            <span>0đ</span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-xl font-bold text-[#181C2E]">Total</span>
                            <span className="text-2xl font-bold text-[#FE8C00]">{order.total.toLocaleString('vi-VN')}đ</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

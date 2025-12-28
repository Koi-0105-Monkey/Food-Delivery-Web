'use client';

import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            // Create order document in Appwrite
            const order = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                'unique()', // let Appwrite generate ID
                {
                    user_id: 'placeholder-user-id', // replace with real user ID from session
                    items: JSON.stringify(cartItems),
                    total,
                    payment_method: 'COD',
                    payment_status: 'pending',
                    delivery_address: 'placeholder-address',
                }
            );
            console.log('Order created', order);
            clearCart();
            // Redirect to order confirmation page (placeholder)
            window.location.href = `/orders/${order.$id}`;
        } catch (e) {
            console.error(e);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <main className="py-12">
                <section className="container-custom text-center">
                    <h1 className="text-3xl font-bold text-[#181C2E] mb-6">Your Cart is Empty</h1>
                    <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all">
                        Browse Menu
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="py-12">
            <section className="container-custom max-w-2xl mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#181C2E] hover:text-[#FE8C00] mb-6"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Cart
                </button>
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <h2 className="text-2xl font-bold text-[#181C2E] mb-4">Checkout</h2>
                    <ul className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                            <li key={item.menu_id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span className="text-[#FE8C00]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-semibold text-[#181C2E]">Total</span>
                        <span className="text-xl font-bold text-[#FE8C00]">{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full px-6 py-3 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </section>
        </main>
    );
}

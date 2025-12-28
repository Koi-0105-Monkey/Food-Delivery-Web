'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/components/CartContext';

export default function CartPage() {
    const { cartItems, updateQuantity, removeItem, clearCart } = useCart();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartItems.length === 0) {
        return (
            <main className="py-12">
                <section className="container-custom text-center">
                    <h1 className="text-3xl font-bold text-[#181C2E] mb-6">Your Cart is Empty</h1>
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all"
                    >
                        Browse Menu
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="py-12">
            <section className="container-custom max-w-4xl mx-auto">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-[#181C2E] hover:text-[#FE8C00] mb-6"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Menu
                </button>
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <h2 className="text-2xl font-bold text-[#181C2E] mb-4">Your Cart</h2>
                    <ul className="space-y-4">
                        {cartItems.map((item) => (
                            <li key={item.menu_id} className="flex items-center gap-4">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#D1D5DB]">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[#181C2E]">{item.name}</h3>
                                    <p className="text-sm text-[#878787]">{item.price.toLocaleString('vi-VN')}đ each</p>
                                    <div className="flex items-center mt-2 gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.menu_id, item.quantity - 1)}
                                            className="w-8 h-8 bg-[#FFF5E6] text-[#181C2E] rounded-full flex items-center justify-center"
                                        >-</button>
                                        <span className="px-2">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.menu_id, item.quantity + 1)}
                                            className="w-8 h-8 bg-[#FE8C00] text-white rounded-full flex items-center justify-center"
                                        >+</button>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-bold text-[#FE8C00]">
                                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.menu_id)}
                                        className="mt-2 text-[#FE8C00] hover:text-[#E67D00]"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t pt-4 mt-6 flex justify-between items-center">
                        <span className="text-2xl font-bold text-[#181C2E]">Total:</span>
                        <span className="text-2xl font-bold text-[#FE8C00]">{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={clearCart}
                            className="px-6 py-2 bg-[#FFF5E6] text-[#181C2E] rounded-full font-semibold hover:bg-[#E0E0E0] transition-colors"
                        >
                            Clear Cart
                        </button>
                        <Link
                            href="/checkout"
                            className="px-6 py-2 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-colors"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

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
            <main className="py-24 bg-[#F3F4F6] min-h-screen flex items-center justify-center">
                <section className="container-custom text-center">
                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] animate-bounce-slow">
                        <span className="text-6xl">🛒</span>
                    </div>
                    <h1 className="text-4xl font-bold text-[#181C2E] mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                        Looks like you haven't added any delicious food yet. Explore our menu and satisfy your cravings!
                    </p>
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 px-10 py-5 bg-[#FE8C00] text-white rounded-[20px] font-bold text-lg hover:bg-[#E67D00] hover:scale-105 hover:shadow-orange-200 hover:shadow-xl transition-all duration-300"
                    >
                        Browse Menu <ArrowLeft className="w-5 h-5 rotate-180" />
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="py-12 bg-[#F3F4F6] min-h-screen">
            <section className="container-custom">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-[#FE8C00] hover:text-[#FE8C00] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-[#181C2E]">Your Cart <span className="text-gray-400 text-lg font-normal ml-2">({cartItems.length} items)</span></h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.menu_id} className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow flex flex-col sm:flex-row gap-6 group">
                                {/* Image */}
                                <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                    <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Info & Controls */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#181C2E] mb-1">{item.name}</h3>
                                            <p className="text-[#FE8C00] font-bold text-lg">{item.price.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.menu_id)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.menu_id, item.quantity - 1)}
                                                className="w-8 h-8 bg-white text-[#181C2E] rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-gray-100 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span className="w-6 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.menu_id, item.quantity + 1)}
                                                className="w-8 h-8 bg-[#FE8C00] text-white rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-[#E67D00] transition-colors"
                                            >+</button>
                                        </div>
                                        <p className="font-bold text-[#181C2E] text-xl">
                                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between items-center mt-4 px-2">
                            <button
                                onClick={clearCart}
                                className="text-red-500 font-medium hover:text-red-700 hover:underline transition-all flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] sticky top-24 border border-gray-100">
                            <h2 className="text-2xl font-bold text-[#181C2E] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#181C2E]">{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-500 font-medium">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-xl font-bold text-[#181C2E]">Total</span>
                                <span className="text-3xl font-black text-[#FE8C00]">{total.toLocaleString('vi-VN')}đ</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full block text-center py-4 bg-[#181C2E] text-white rounded-2xl font-bold text-lg hover:bg-[#FE8C00] hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-1 transition-all duration-300"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                🔒 Secure Checkout · 100% Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

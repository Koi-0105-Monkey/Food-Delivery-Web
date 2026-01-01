'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { MenuItem } from '@/types';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';

export default function MenuItemDetail() {
    const router = useRouter();
    const pathname = usePathname();
    const itemId = pathname.split('/').pop() || '';
    const { addItem } = useCart();

    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await databases.getDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    itemId
                );
                setItem(response as unknown as MenuItem);
            } catch (err) {
                console.error('Failed to fetch menu item', err);
            } finally {
                setLoading(false);
            }
        };
        if (itemId) fetchItem();
    }, [itemId]);

    const handleAddToCart = () => {
        if (!item) return;
        addItem({
            menu_id: item.$id,
            name: item.name,
            price: item.price,
            quantity: quantity,
            image_url: item.image_url
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F3F4F6]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#FE8C00] border-t-transparent rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <main className="py-12 bg-[#F3F4F6] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#181C2E] text-xl font-bold mb-4">Item not found.</p>
                    <Link href="/menu" className="text-[#FE8C00] hover:underline">
                        Back to Menu
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="py-12 bg-[#F3F4F6] min-h-screen">
            <section className="container-custom max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#181C2E] hover:text-[#FE8C00] mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#D1D5DB]">
                            <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#181C2E] mb-4">{item.name}</h1>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[#FE8C00] text-lg">★</span>
                                <span className="font-semibold text-[#181C2E] text-lg">{item.rating}</span>
                                <span className="text-[#878787] text-sm">(120+ reviews)</span>
                            </div>

                            <p className="text-[#878787] mb-8 leading-relaxed max-w-md">{item.description}</p>

                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-2xl">
                                    <span className="text-sm font-medium text-[#181C2E]">Quantity</span>
                                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-[#181C2E] hover:text-[#FE8C00]"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-[#181C2E] hover:text-[#FE8C00]"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-[#878787]">Total Price</span>
                                        <span className="text-3xl font-bold text-[#FE8C00]">
                                            {(item.price * quantity).toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={added}
                                        className={`flex-1 py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${added
                                            ? 'bg-green-500 text-white shadow-green-200'
                                            : 'bg-[#FE8C00] text-white hover:bg-[#E67D00] shadow-[0_4px_20px_rgba(254,140,0,0.3)] hover:shadow-[0_8px_30px_rgba(254,140,0,0.4)]'
                                            }`}
                                    >
                                        {added ? (
                                            <>Added to Cart ✓</>
                                        ) : (
                                            <>
                                                Add to Cart
                                                <ShoppingCart className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

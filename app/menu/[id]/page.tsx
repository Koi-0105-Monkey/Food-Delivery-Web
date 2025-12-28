'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { MenuItem } from '@/types';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function MenuItemDetail() {
    const router = useRouter();
    const pathname = usePathname();
    // Extract the item id from the URL, assuming format /menu/[id]
    const itemId = pathname.split('/').pop() || '';

    const [item, setItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="text-center mt-8">
                <p className="text-[#FE8C00]">Item not found.</p>
                <Link href="/menu" className="text-[#181C2E] underline mt-4 inline-block">
                    Back to Menu
                </Link>
            </div>
        );
    }

    return (
        <main className="py-12">
            <section className="container-custom max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-[#181C2E] hover:text-[#FE8C00] mb-6"
                >
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-[#D1D5DB]">
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-[#181C2E] mb-4">{item.name}</h1>
                    <p className="text-[#878787] mb-4">{item.description}</p>
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-[#FE8C00]">
                            {item.price.toLocaleString('vi-VN')}đ
                        </span>
                        <button className="w-12 h-12 bg-[#FE8C00] text-white rounded-full flex items-center justify-center hover:bg-[#E67D00] transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all"
                        >
                            Back to Menu
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

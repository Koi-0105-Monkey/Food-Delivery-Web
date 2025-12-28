'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { MenuItem } from '@/types';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          [Query.orderDesc('rating')]
        );
        setMenuItems(response.documents as unknown as MenuItem[]);
      } catch (err) {
        console.error('Failed to fetch menu items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <main className="py-12">
      <section className="container-custom">
        <h1 className="text-4xl font-bold text-[#181C2E] mb-8 text-center">
          Our Menu
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                <div className="w-full h-48 bg-[#D1D5DB] rounded-lg mb-4" />
                <div className="h-6 bg-[#D1D5DB] rounded mb-2" />
                <div className="h-4 bg-[#D1D5DB] rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.$id}
                href={`/menu/${item.$id}`}
                className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all group"
              >
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-[#D1D5DB]">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[#FE8C00]">★</span>
                  <span className="font-semibold text-[#181C2E]">{item.rating}</span>
                </div>
                <h3 className="text-lg font-bold text-[#181C2E] mb-2 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-sm text-[#878787] mb-4 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#FE8C00]">
                    {item.price.toLocaleString('vi-VN')}đ
                  </span>
                  <button className="w-10 h-10 bg-[#FE8C00] text-white rounded-full flex items-center justify-center hover:bg-[#E67D00] transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all"
          >
            Back to Home <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

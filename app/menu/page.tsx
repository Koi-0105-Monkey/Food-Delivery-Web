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
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchCategories(), fetchMenu()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, debouncedSearch]);

  const fetchCategories = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId
      );
      setCategories([{ $id: 'All', name: 'All' }, ...response.documents]);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      // Fallback categories if fetch fails
      setCategories([
        { $id: 'All', name: 'All' },
        { $id: 'burger', name: 'Burger' },
        { $id: 'pizza', name: 'Pizza' },
        { $id: 'drink', name: 'Drink' }
      ]);
    }
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const queries = [Query.orderDesc('rating')];

      if (selectedCategory !== 'All') {
        queries.push(Query.equal('categories', selectedCategory));
      }

      if (debouncedSearch) {
        queries.push(Query.search('name', debouncedSearch));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        queries
      );
      setMenuItems(response.documents as unknown as MenuItem[]);
    } catch (err) {
      console.error('Failed to fetch menu items', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 bg-[#F3F4F6] min-h-screen">
      <section className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#181C2E] mb-4">Our Menu</h1>
          <p className="text-[#878787] max-w-2xl mx-auto">
            Explore our wide range of delicious meals, prepared with love and fresh ingredients.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 sticky top-24 z-20 bg-[#F3F4F6]/80 backdrop-blur-sm p-4 rounded-3xl -mx-4 md:mx-0">
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-transparent focus:border-[#FE8C00]/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FE8C00]/10 transition-all shadow-sm group-hover:shadow-md"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-[#FE8C00] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar mask-gradient-right">
            {categories.map((category) => (
              <button
                key={category.$id}
                onClick={() => setSelectedCategory(category.name === 'All' ? 'All' : category.$id)}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 ${(selectedCategory === 'All' && category.name === 'All') || selectedCategory === category.$id
                  ? 'bg-[#FE8C00] text-white shadow-lg shadow-orange-200 ring-2 ring-orange-100'
                  : 'bg-white text-gray-500 hover:text-[#FE8C00] hover:bg-orange-50 border border-transparent hover:border-orange-100 shadow-sm'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 animate-pulse h-[380px]"></div>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="text-8xl mb-6 animate-bounce-slow">🔍</div>
            <h3 className="text-2xl font-bold text-[#181C2E] mb-2">No items found</h3>
            <p className="text-gray-500 max-w-sm text-center">
              We couldn't find any food matching your search. Try "Burger" or "Pizza"?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.$id}
                href={`/menu/${item.$id}`}
                className="group bg-white rounded-[2rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-[1.5rem] bg-gray-100">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-[#181C2E] shadow-sm flex items-center gap-1">
                    <span>⭐</span> {item.rating}
                  </div>
                </div>

                <div className="px-2 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[#181C2E] mb-2 line-clamp-1 group-hover:text-[#FE8C00] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div>
                      <span className="text-xs text-gray-400 font-medium display-block">Price</span>
                      <div className="text-xl font-black text-[#FE8C00]">
                        {item.price.toLocaleString('vi-VN')}
                        <span className="text-xs text-gray-400 font-medium ml-0.5">đ</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 bg-[#181C2E] text-white rounded-full flex items-center justify-center group-hover:bg-[#FE8C00] transition-colors shadow-lg group-hover:shadow-orange-200 group-hover:scale-110 duration-300">
                      <ShoppingCart className="w-5 h-5 -rotate-12 group-hover:rotate-0 transition-transform" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

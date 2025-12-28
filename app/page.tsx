'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Shield, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { MenuItem } from '@/types';

export default function Home() {
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPopularItems();
  }, []);

  const loadPopularItems = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.menuCollectionId,
        [Query.limit(8), Query.orderDesc('rating')]
      );
      setPopularItems(response.documents as any);
    } catch (error) {
      console.error('Failed to load popular items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-up">
              <div className="inline-block px-4 py-2 bg-[#FFF5E6] rounded-full mb-6">
                <span className="text-[#FE8C00] font-semibold text-sm">🎉 Free Delivery on First Order</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-[#181C2E] mb-6 leading-tight">
                Delicious Food <br />
                <span className="text-[#FE8C00]">Delivered</span> to Your <br />
                Doorstep
              </h1>

              <p className="text-xl text-[#878787] mb-8 max-w-lg">
                Order your favorite meals from the best restaurants in town.
                Fast delivery, fresh ingredients, always satisfying.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/menu" className="px-8 py-4 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all flex items-center justify-center gap-2 text-lg">
                  Order Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/menu" className="px-8 py-4 bg-white text-[#FE8C00] border-2 border-[#FE8C00] rounded-full font-semibold hover:bg-[#FFF5E6] transition-all flex items-center justify-center gap-2 text-lg">
                  View Menu
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <h3 className="text-3xl font-bold text-[#FE8C00]">500+</h3>
                  <p className="text-[#878787]">Menu Items</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#FE8C00]">10k+</h3>
                  <p className="text-[#878787]">Happy Customers</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-[#FE8C00]">4.8★</h3>
                  <p className="text-[#878787]">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] lg:h-[600px] animate-scale-in">
              <div className="absolute inset-0 bg-[#FE8C00]/10 rounded-full blur-3xl"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-9xl">🍔</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#181C2E] mb-4">Why Choose Us?</h2>
            <p className="text-lg text-[#878787] max-w-2xl mx-auto">
              We provide the best food delivery experience with quality service
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-[#FE8C00]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#181C2E] mb-4">Fast Delivery</h3>
              <p className="text-[#878787]">
                Get your food delivered in 30 minutes or less. Hot, fresh, and on time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#FE8C00]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#181C2E] mb-4">Fresh Ingredients</h3>
              <p className="text-[#878787]">
                We use only the freshest ingredients to ensure quality in every bite.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all">
              <div className="w-16 h-16 bg-[#FFF5E6] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#FE8C00]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#181C2E] mb-4">24/7 Service</h3>
              <p className="text-[#878787]">
                Order anytime, anywhere. We're always here to serve you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-16 md:py-24 bg-[#F3F4F6]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#181C2E] mb-2">Popular Items</h2>
              <p className="text-lg text-[#878787]">Our customers' favorite dishes</p>
            </div>
            <Link href="/menu" className="hidden md:flex items-center gap-2 px-6 py-3 bg-transparent text-[#181C2E] border-2 border-[#181C2E] rounded-full font-semibold hover:bg-[#181C2E] hover:text-white transition-all">
              View All Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-[#D1D5DB] rounded-lg mb-4"></div>
                  <div className="h-6 bg-[#D1D5DB] rounded mb-2"></div>
                  <div className="h-4 bg-[#D1D5DB] rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularItems.map((item) => (
                <Link
                  key={item.$id}
                  href={`/menu/${item.$id}`}
                  className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-[#D1D5DB]">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[#FE8C00]">★</span>
                    <span className="font-semibold text-[#181C2E]">{item.rating}</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-[#181C2E] mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#878787] mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#FE8C00]">
                      {item.price.toLocaleString('vi-VN')}đ
                    </span>
                    <button className="w-10 h-10 bg-[#FE8C00] text-white rounded-full flex items-center justify-center hover:bg-[#E67D00] transition-colors">
                      +
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="mt-8 text-center md:hidden">
            <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[#181C2E] border-2 border-[#181C2E] rounded-full font-semibold hover:bg-[#181C2E] hover:text-white transition-all">
              View All Menu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of satisfied customers and enjoy delicious food delivered to your door
          </p>
          <Link href="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FE8C00] rounded-full font-semibold hover:bg-gray-100 transition-all text-lg">
            Start Ordering Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}

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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-white to-[#FFF0E0] pt-24 pb-32 md:pt-32 md:pb-48">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#FE8C00]/5 to-transparent rounded-bl-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-[#FE8C00]/5 to-transparent rounded-tr-[100px] -z-10" />

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-slide-up space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-orange-100 rounded-full animate-bounce-slow">
                <span className="bg-[#FE8C00] text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                <span className="text-[#FE8C00] font-semibold text-sm">Free Delivery on First Order</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-[#181C2E] leading-[1.1] tracking-tight">
                Claim Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE8C00] to-[#FF5E00]">Craving</span> Now
              </h1>

              <p className="text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience the fastest delivery of fresh, hot, and delicious meals from top restaurants near you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/menu" className="group px-8 py-4 bg-[#FE8C00] text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(254,140,0,0.3)] hover:shadow-[0_15px_40px_rgba(254,140,0,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Order Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/menu" className="px-8 py-4 bg-white text-[#181C2E] border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-[#FE8C00] hover:text-[#FE8C00] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                  View Menu
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 border-t border-gray-100/50">
                <div>
                  <h3 className="text-3xl font-black text-[#181C2E]">500+</h3>
                  <p className="text-gray-400 font-medium">Menu Items</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <h3 className="text-3xl font-black text-[#181C2E]">10k+</h3>
                  <p className="text-gray-400 font-medium">Happy Users</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <h3 className="text-3xl font-black text-[#181C2E]">4.9★</h3>
                  <p className="text-gray-400 font-medium">Top Rated</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] lg:h-[650px] animate-scale-in hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#FE8C00]/20 to-transparent rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
              {/* Illustration using emoji for now, ideal place for a 3D burger render */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="text-[200px] animate-float drop-shadow-2xl filter hover:brightness-110 transition-all cursor-pointer">🍔</div>
                {/* Floating Elements */}
                <div className="absolute top-20 right-20 bg-white p-4 rounded-2xl shadow-xl animate-float-delayed flex items-center gap-3">
                  <span className="text-2xl">🍕</span>
                  <div>
                    <p className="font-bold text-[#181C2E]">Tasty Pizza</p>
                    <p className="text-xs text-gray-400">On the way</p>
                  </div>
                </div>
                <div className="absolute bottom-40 left-10 bg-white p-4 rounded-2xl shadow-xl animate-float flex items-center gap-3">
                  <span className="text-2xl">🥗</span>
                  <div>
                    <p className="font-bold text-[#181C2E]">Fresh Salad</p>
                    <p className="text-xs text-green-500 font-bold">Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-20 -mt-16 sm:-mt-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-[2rem] p-10 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-[#FE8C00]/20 hover:shadow-[0_20px_60px_-10px_rgba(254,140,0,0.15)] transition-all duration-500">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Truck className="w-10 h-10 text-[#FE8C00]" />
              </div>
              <h3 className="text-2xl font-bold text-[#181C2E] mb-3">Fast Delivery</h3>
              <p className="text-gray-500 leading-relaxed">
                Super fast delivery within 30 minutes to ensure your food is always fresh and hot.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-[2rem] p-10 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-green-500/20 hover:shadow-[0_20px_60px_-10px_rgba(34,197,94,0.15)] transition-all duration-500">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Shield className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#181C2E] mb-3">Fresh Ingredients</h3>
              <p className="text-gray-500 leading-relaxed">
                We work with top restaurants that use strictly fresh, locally sourced ingredients.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-[2rem] p-10 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-blue-500/20 hover:shadow-[0_20px_60px_-10px_rgba(59,130,246,0.15)] transition-all duration-500">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#181C2E] mb-3">24/7 Support</h3>
              <p className="text-gray-500 leading-relaxed">
                Our support team is available around the clock to assist you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#FE8C00] font-bold tracking-wider uppercase text-sm">Our Favorites</span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#181C2E] mt-2">Popular Items</h2>
            </div>
            <Link href="/menu" className="hidden md:flex items-center gap-2 group text-[#181C2E] font-bold hover:text-[#FE8C00] transition-colors">
              View Full Menu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-[2rem] p-6 animate-pulse h-[380px]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularItems.map((item) => (
                <Link
                  key={item.$id}
                  href={`/menu/${item.$id}`}
                  className="group bg-white rounded-[2rem] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  {/* Image Container */}
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

                  {/* Content */}
                  <div className="px-2 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-[#181C2E] mb-2 line-clamp-1 group-hover:text-[#FE8C00] transition-colors">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div>
                        <span className="text-xs text-gray-400 font-medium display-block">Price</span>
                        <div className="text-xl font-black text-[#FE8C00]">
                          {item.price.toLocaleString('vi-VN')}
                          <span className="text-xs text-gray-400 font-medium ml-0.5">đ</span>
                        </div>
                      </div>
                      <button className="w-12 h-12 bg-[#181C2E] text-white rounded-full flex items-center justify-center group-hover:bg-[#FE8C00] transition-colors shadow-lg group-hover:shadow-orange-200 group-hover:scale-110 duration-300">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                      </button>
                    </div>
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

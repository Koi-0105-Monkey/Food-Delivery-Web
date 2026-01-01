'use client';

import Image from 'next/image';
import { Truck, Shield, Clock, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="py-12 bg-white">
            {/* Hero Section */}
            <section className="container-custom mb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#181C2E] mb-6">
                        We deliver more than just <span className="text-[#FE8C00]">food</span>
                    </h1>
                    <p className="text-lg text-[#878787] mb-8">
                        Founded in 2024, FoodDelivery has been on a mission to bring delicious meals from the best local restaurants directly to your doorstep. We believe that good food brings people together, and we are here to make that happen, fast and fresh.
                    </p>
                </div>
                <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mt-12 bg-gray-100">
                    {/* Placeholder for a hero image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FFF5E6]">
                        <span className="text-6xl">🥘</span>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-[#F3F4F6] py-20">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#181C2E] mb-4">Our Core Values</h2>
                        <p className="text-[#878787]">What drives us every single day</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Truck, title: "Fast Delivery", desc: "We value your time. Our fleet ensures your food arrives hot and on schedule." },
                            { icon: Shield, title: "Quality Assurance", desc: "We partner only with restaurants that meet our high standards of hygiene and taste." },
                            { icon: Clock, title: "24/7 Service", desc: "Hunger doesn't have a schedule, and neither do we. Order anytime." },
                            { icon: Users, title: "Customer First", desc: "Your satisfaction is our priority. We are always here to listen and serve." }
                        ].map((value, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm hover:-translate-y-1 transition-transform">
                                <div className="w-12 h-12 bg-[#FFF5E6] rounded-full flex items-center justify-center mb-6">
                                    <value.icon className="w-6 h-6 text-[#FE8C00]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#181C2E] mb-3">{value.title}</h3>
                                <p className="text-[#878787] text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section (Optional/Placeholder) */}
            <section className="container-custom py-20">
                <div className="bg-[#FE8C00] rounded-3xl p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6">Join Our Journey</h2>
                    <p className="max-w-2xl mx-auto mb-8 text-white/90">
                        We are constantly growing and looking for passionate individuals to join our team. Whether you are a rider, a developer, or a food lover, there is a place for you here.
                    </p>
                    <button className="px-8 py-3 bg-white text-[#FE8C00] rounded-full font-bold hover:bg-gray-100 transition-colors">
                        Careers
                    </button>
                </div>
            </section>
        </main>
    );
}

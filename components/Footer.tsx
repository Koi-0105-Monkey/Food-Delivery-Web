'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="bg-[#181C2E] text-white">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-[#FE8C00] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">🍔</span>
                            </div>
                            <span className="text-2xl font-bold">
                                Food<span className="text-[#FE8C00]">Delivery</span>
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6">
                            Delicious food delivered to your doorstep. Fast, fresh, and always satisfying.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center hover:bg-[#FE8C00] transition-colors">
                                <Facebook className="w-5 h-5 text-[#FE8C00] hover:text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center hover:bg-[#FE8C00] transition-colors">
                                <Instagram className="w-5 h-5 text-[#FE8C00] hover:text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#FFF5E6] rounded-full flex items-center justify-center hover:bg-[#FE8C00] transition-colors">
                                <Twitter className="w-5 h-5 text-[#FE8C00] hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-[#FE8C00] transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/menu" className="text-gray-300 hover:text-[#FE8C00] transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-[#FE8C00] transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-300 hover:text-[#FE8C00] transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/faq" className="text-gray-300 hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-300 hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-300 hover:text-primary transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/help" className="text-gray-300 hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                                <span className="text-gray-300">
                                    123 Food Street, Hanoi, Vietnam
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="tel:+84123456789" className="text-gray-300 hover:text-primary transition-colors">
                                    +84 123 456 789
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                                <a href="mailto:info@fooddelivery.com" className="text-gray-300 hover:text-primary transition-colors">
                                    info@fooddelivery.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} FoodDelivery. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

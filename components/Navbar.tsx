'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#FE8C00] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">🍔</span>
                        </div>
                        <span className="text-2xl font-bold text-[#181C2E]">
                            Food<span className="text-[#FE8C00]">Delivery</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium">
                            Home
                        </Link>
                        <Link href="/menu" className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium">
                            Menu
                        </Link>
                        <Link href="/about" className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium">
                            About
                        </Link>
                        <Link href="/contact" className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative p-2 hover:bg-[#FFF5E6] rounded-full transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6 text-[#181C2E]" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FE8C00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {/* User */}
                        <Link
                            href="/auth/signin"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#FE8C00] text-white rounded-full hover:bg-[#E67D00] transition-colors font-medium"
                        >
                            <User className="w-5 h-5" />
                            Sign In
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-[#181C2E]" />
                            ) : (
                                <Menu className="w-6 h-6 text-[#181C2E]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t animate-slide-up">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/"
                                className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/menu"
                                className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Menu
                            </Link>
                            <Link
                                href="/about"
                                className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className="text-[#181C2E] hover:text-[#FE8C00] transition-colors font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <Link
                                href="/auth/signin"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FE8C00] text-white rounded-full hover:bg-[#E67D00] transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Menu as MenuIcon, Users, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Menu', href: '/admin/menu', icon: MenuIcon },
        { name: 'Customers', href: '/admin/customers', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 fixed h-full z-10 hidden md:block shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
                <div className="h-20 flex items-center px-8 border-b border-gray-100/50">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-tr from-[#FE8C00] to-[#FFA033] rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="text-xl font-bold text-[#181C2E] tracking-tight">
                            Admin<span className="text-[#FE8C00]">Panel</span>
                        </span>
                    </div>
                </div>
                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                    ? 'bg-[#FFF5E6] text-[#FE8C00]'
                                    : 'text-[#878787] hover:bg-gray-50 hover:text-[#181C2E]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors mt-8"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden sticky top-0 z-20">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button className="p-2 border rounded-lg">
                        <MenuIcon className="w-5 h-5" />
                    </button>
                </header>

                <main className="p-6 md:p-8 flex-1 overflow-y-auto bg-gray-50/50">
                    <div className="max-w-7xl mx-auto space-y-8 min-h-[calc(100vh-140px)]">
                        {children}
                    </div>

                    <footer className="mt-auto py-6 border-t border-gray-100 bg-white">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                            <p>&copy; {new Date().getFullYear()} FoodDelivery Admin Panel. All rights reserved.</p>
                            <div className="flex gap-4 mt-2 md:mt-0">
                                <span>v1.0.0</span>
                                <span>•</span>
                                <Link href="/" className="hover:text-[#FE8C00] transition-colors">Go to Storefront</Link>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

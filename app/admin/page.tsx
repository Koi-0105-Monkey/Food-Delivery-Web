'use client';

import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import {
    DollarSign,
    ShoppingBag,
    Users,
    TrendingUp,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        pendingOrders: 0,
        averageOrderValue: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Orders (Get last 100 for stats to avoid heavy load, ideally pagination/backend func in prod)
            const ordersResponse = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(100)
                ]
            );

            const orders = ordersResponse.documents;

            // Calculate Stats
            const paidOrders = orders.filter(o => o.payment_status === 'paid' || (o.payment_method === 'COD' && o.order_status === 'delivered'));
            const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
            const totalOrders = orders.length; // Actually total fetched, but good approximation for last 100

            // Pending
            const pending = orders.filter(o => o.order_status === 'pending' || o.payment_status === 'pending').length;

            // Unique Customers from orders (since we might not have direct user list access)
            const uniqueCustomers = new Set(orders.map(o => o.user_id)).size;

            // Chart Data: Group by Date (Last 7 days from fetched orders)
            const dailyRevenue: Record<string, number> = {};
            orders.forEach(order => {
                if (order.payment_status === 'paid' || (order.payment_method === 'COD' && order.order_status === 'delivered')) {
                    const date = new Date(order.$createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
                }
            });

            // Convert to array and reverse to chronological
            const chartData = Object.keys(dailyRevenue)
                .map(date => ({ date, revenue: dailyRevenue[date] }))
                .reverse();

            // Set State
            setStats({
                totalRevenue,
                totalOrders: ordersResponse.total, // Real total from DB
                totalCustomers: uniqueCustomers,
                pendingOrders: pending,
                averageOrderValue: totalOrders > 0 ? totalRevenue / paidOrders.length : 0
            });

            setRecentOrders(orders.slice(0, 5));
            setRevenueData(chartData.length > 0 ? chartData : [{ date: 'Today', revenue: 0 }]);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FE8C00]"></div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-[#181C2E] mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-inner">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100/80 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +12%
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                        <h3 className="text-3xl font-black text-[#181C2E] mt-2 tracking-tight">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-inner">
                                <ShoppingBag className="w-6 h-6 text-[#FE8C00]" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-100/80 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> +5%
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Total Orders</p>
                        <h3 className="text-3xl font-black text-[#181C2E] mt-2 tracking-tight">{stats.totalOrders}</h3>
                    </div>
                </div>

                {/* Customers Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-inner">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Active Customers</p>
                        <h3 className="text-3xl font-black text-[#181C2E] mt-2 tracking-tight">{stats.totalCustomers}</h3>
                    </div>
                </div>

                {/* Pending Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-inner">
                                <AlertCircle className="w-6 h-6 text-yellow-500" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Pending Orders</p>
                        <h3 className="text-3xl font-black text-[#181C2E] mt-2 tracking-tight">{stats.pendingOrders}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-[#181C2E]">Revenue Analytics</h2>
                            <p className="text-sm text-gray-400 mt-1">Income summary for current month</p>
                        </div>
                        <select className="px-4 py-2 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 border border-transparent hover:border-gray-200 outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FE8C00" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#FE8C00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px 16px' }}
                                    formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                                    cursor={{ stroke: '#FE8C00', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#FE8C00"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[#181C2E]">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm font-semibold text-[#FE8C00] hover:text-[#E67D00] hover:underline underline-offset-4">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {recentOrders.map((order) => (
                            <div key={order.$id} className="group flex items-center justify-between p-4 hover:bg-orange-50/50 rounded-2xl transition-all border border-transparent hover:border-orange-100 cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FE8C00] font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                                        {order.order_number?.slice(-2) || '00'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#181C2E] text-sm group-hover:text-[#FE8C00] transition-colors">{order.order_number}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3 h-3 text-gray-400" />
                                            <p className="text-xs text-gray-500 font-medium">
                                                {new Date(order.$createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-[#181C2E] mb-1">{formatCurrency(order.total)}</p>
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.payment_status)}`}>
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No recent orders found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

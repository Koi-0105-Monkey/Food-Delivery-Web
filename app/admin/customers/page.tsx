'use client';

import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { User } from '@/types';
import {
    Search,
    Loader2,
    Ban,
    CheckCircle2,
    Mail,
    Phone,
    User as UserIcon,
    Shield
} from 'lucide-react';

interface Customer extends User {
    isBanned?: boolean;
    $createdAt: string;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                [Query.limit(100), Query.orderDesc('$createdAt')]
            );
            setCustomers(response.documents as unknown as Customer[]);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            // Fallback for demo or if collection is empty/missing
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const toggleBan = async (customer: Customer) => {
        const action = customer.isBanned ? 'Unban' : 'Ban';
        if (!confirm(`Are you sure you want to ${action} ${customer.name}?`)) return;

        setProcessingId(customer.$id);
        try {
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                customer.$id,
                {
                    isBanned: !customer.isBanned
                }
            );

            setCustomers(prev => prev.map(c =>
                c.$id === customer.$id ? { ...c, isBanned: !c.isBanned } : c
            ));
        } catch (error) {
            console.error(`Failed to ${action} user:`, error);
            alert(`Failed to ${action} user.`);
        } finally {
            setProcessingId(null);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.phone && c.phone.includes(searchTerm))
    );

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-[#181C2E] mb-8">Customer Management</h1>

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wide">Customer</th>
                                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wide">Contact</th>
                                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wide">Role</th>
                                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wide">Joined</th>
                                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wide">Status</th>
                                <th className="p-5 font-semibold text-gray-500 text-sm text-right tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map(customer => (
                                <tr key={customer.$id} className="group hover:bg-orange-50/30 transition-all duration-200">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 overflow-hidden flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                                {customer.avatar ? (
                                                    <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-6 h-6 text-[#FE8C00]" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#181C2E] group-hover:text-[#FE8C00] transition-colors">{customer.name}</p>
                                                <p className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded mt-1 inline-block">ID: {customer.$id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 space-y-1.5">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                            <Mail className="w-3.5 h-3.5" />
                                            {customer.email}
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                                {customer.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${customer.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                            {customer.role === 'admin' && <Shield className="w-3 h-3 fill-current" />}
                                            {(customer.role || 'User').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm text-gray-500 font-medium">
                                        {new Date(customer.$createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-5">
                                        {customer.isBanned ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded-full">
                                                <Ban className="w-3 h-3" /> BANNED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-full">
                                                <CheckCircle2 className="w-3 h-3" /> ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => toggleBan(customer)}
                                            disabled={processingId === customer.$id}
                                            className={`p-2 rounded-lg transition-colors ${customer.isBanned
                                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                            title={customer.isBanned ? "Unban Customer" : "Ban Customer"}
                                        >
                                            {processingId === customer.$id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                customer.isBanned ? <CheckCircle2 className="w-4 h-4" /> : <Ban className="w-4 h-4" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No customers found. (Ensure 'users' collection is populated)
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

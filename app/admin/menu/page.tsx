'use client';

import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { MenuItem, Category } from '@/types';
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Loader2,
    X,
    Save
} from 'lucide-react';

export default function AdminMenuPage() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        calories: '',
        protein: '',
        rating: '4.5'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log('Fetching Menu Data... Config:', {
                db: appwriteConfig.databaseId,
                menu: appwriteConfig.menuCollectionId,
                cats: appwriteConfig.categoriesCollectionId
            });

            // Fetch Categories
            try {
                const catsRes = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.categoriesCollectionId
                );
                setCategories(catsRes.documents as unknown as Category[]);
            } catch (e) {
                console.error('Failed to fetch categories:', e);
            }

            // Fetch Menu Items
            try {
                const itemsRes = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    [Query.limit(100), Query.orderDesc('$createdAt')]
                );
                setMenuItems(itemsRes.documents as unknown as MenuItem[]);
            } catch (e) {
                console.error('Failed to fetch menu items:', e);
            }

        } catch (error) {
            console.error('General Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: MenuItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                description: item.description,
                price: item.price.toString(),
                image_url: item.image_url,
                category: item.categories, // Note: Schema calls it 'categories' (string id) or 'category'? Checking types... it says 'categories' (string)
                calories: item.calories.toString(),
                protein: item.protein.toString(),
                rating: item.rating.toString()
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                image_url: '',
                category: categories.length > 0 ? categories[0].$id : '',
                calories: '',
                protein: '',
                rating: '4.5'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const data = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                image_url: formData.image_url,
                categories: formData.category,
                calories: parseFloat(formData.calories) || 0,
                protein: parseFloat(formData.protein) || 0,
                rating: parseFloat(formData.rating) || 4.5
            };

            if (editingItem) {
                await databases.updateDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    editingItem.$id,
                    data
                );
            } else {
                await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    ID.unique(),
                    data
                );
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Failed to save item:', error);
            alert('Failed to save item. See console for details.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCollectionId,
                id
            );
            setMenuItems(prev => prev.filter(item => item.$id !== id));
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('Failed to delete item.');
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.categories === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-[#181C2E]">Menu Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-[#FE8C00] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#E67D00] transition-colors shadow-sm shadow-orange-200"
                >
                    <Plus className="w-5 h-5" />
                    Add New Item
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] focus:border-transparent transition-all"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-6 py-3 border border-gray-100 bg-gray-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] min-w-[200px] cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.$id} value={cat.$id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid Layout instead of Table for better visual appeal */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.$id} className="group bg-white rounded-3xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        {/* Image */}
                        <div className="aspect-[4/3] w-full bg-gray-100 rounded-2xl overflow-hidden relative mb-4">
                            {item.image_url ? (
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#181C2E] shadow-sm">
                                ⭐ {item.rating}
                            </div>
                        </div>

                        {/* Content */}
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#181C2E] text-lg leading-tight line-clamp-1 group-hover:text-[#FE8C00] transition-colors">{item.name}</h3>
                                <div className="flex gap-1 ml-2">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.$id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{item.description}</p>

                            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium uppercase tracking-wide">
                                    {categories.find(c => c.$id === item.categories)?.name || 'Unknown'}
                                </span>
                                <span className="font-black text-xl text-[#FE8C00]">
                                    {item.price.toLocaleString('vi-VN')}
                                    <span className="text-xs text-gray-400 font-medium ml-0.5">đ</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card (Empty State) */}
                <button
                    onClick={() => handleOpenModal()}
                    className="flex flex-col items-center justify-center h-full min-h-[320px] rounded-3xl border-2 border-dashed border-gray-200 hover:border-[#FE8C00] hover:bg-orange-50/10 transition-all group"
                >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#FE8C00]/10 transition-all">
                        <Plus className="w-8 h-8 text-gray-300 group-hover:text-[#FE8C00] transition-colors" />
                    </div>
                    <span className="font-bold text-gray-400 group-hover:text-[#FE8C00] transition-colors">Add New Item</span>
                </button>
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No items found matching your filters.
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                            <h2 className="text-xl font-bold text-[#181C2E]">
                                {editingItem ? 'Edit Item' : 'New Menu Item'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00]"
                                    placeholder="e.g. Beef Burger"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (VND)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00]"
                                        placeholder="50000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] bg-white"
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.$id} value={cat.$id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] h-24 resize-none"
                                    placeholder="Item description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-all"
                                        placeholder="https://..."
                                    />
                                </div>
                                {formData.image_url && (
                                    <div className="mt-2 w-full h-32 bg-gray-50 rounded-xl overflow-hidden">
                                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={e => setFormData({ ...formData, calories: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00]"
                                        placeholder="kcal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                                    <input
                                        type="number"
                                        value={formData.protein}
                                        onChange={e => setFormData({ ...formData, protein: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00]"
                                        placeholder="g"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00]"
                                        placeholder="4.5"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl bg-[#FE8C00] text-white font-medium hover:bg-[#E67D00] transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MenuItem } from '@/types';

type CartItem = {
    menu_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
    customizations?: {
        id: string;
        name: string;
        price: number;
    }[];
};

type CartContextType = {
    cartItems: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (menu_id: string) => void;
    updateQuantity: (menu_id: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart from localStorage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever cartItems changes
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addItem = (item: CartItem) => {
        setCartItems((prev) => {
            const existing = prev.find((i) => i.menu_id === item.menu_id);
            if (existing) {
                return prev.map((i) =>
                    i.menu_id === item.menu_id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    };

    const removeItem = (menu_id: string) => {
        setCartItems((prev) => prev.filter((i) => i.menu_id !== menu_id));
    };

    const updateQuantity = (menu_id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(menu_id);
            return;
        }
        setCartItems((prev) =>
            prev.map((i) => (i.menu_id === menu_id ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => setCartItems([]);

    // Prevent hydration mismatch by not rendering until initialized
    if (!isInitialized) {
        return null;
    }

    return (
        <CartContext.Provider
            value={{ cartItems, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

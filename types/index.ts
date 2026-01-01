// Type definitions for the Food Delivery Web App

export interface MenuItem {
    $id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    categories: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface Category {
    $id: string;
    name: string;
    description: string;
}

export interface Customization {
    $id: string;
    name: string;
    price: number;
    type: string;
}

export interface CartItem {
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
}

export interface User {
    $id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: string;
}

export interface Address {
    $id: string;
    user_id: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
    isDefault: boolean;
}

export interface Order {
    $id: string;
    order_number: string;
    user_id: string;
    items: string; // JSON string
    total: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    delivery_address: string;
    $createdAt: string;
    $updatedAt: string;
}

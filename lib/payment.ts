// lib/payment.ts

import { databases, appwriteConfig } from './appwrite';
import { ID } from 'appwrite';
import { generateSepayBIDVQR } from './sepay-bidv';
import { Order, CartItem } from '@/types';

// Type describing the params needed to create an order
export interface CreateOrderParams {
    items: CartItem[];
    total: number;
    payment_method: string;
    delivery_address: string;
    [key: string]: any; // Allow extra fields if needed
}

/**
 * ✅ Retry helper function
 */
async function retryAsync<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Don't retry on client errors (4xx) (except 429 too many requests if appwrite throws it as 4xx?)
            // Appwrite errors usually have .code
            if (error.code >= 400 && error.code < 500) {
                throw error;
            }

            // Wait before retry
            if (i < maxRetries - 1) {
                console.log(`⚠️ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}

/**
 * Generate unique order number
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

/**
 * ✅ CREATE QR PAYMENT - BIDV via Sepay
 */
export async function createQRPayment(
    orderNumber: string,
    amount: number
): Promise<{
    success: boolean;
    bidv?: any;
    message?: string;
    orderId?: string;
}> {
    try {
        if (amount < 1000) {
            return {
                success: false,
                message: 'Minimum amount is 1,000 VND',
            };
        }

        console.log('✅ Creating BIDV QR Payment');
        console.log('💰 Amount:', amount.toLocaleString('vi-VN') + '₫');
        console.log('📝 Order:', orderNumber);

        // Generate BIDV QR code
        const paymentData = generateSepayBIDVQR(amount, orderNumber);

        return {
            success: true,
            bidv: paymentData,
            orderId: orderNumber,
        };

    } catch (error: any) {
        console.error('❌ Payment error:', error);
        return {
            success: false,
            message: error.message || 'Unable to create payment',
        };
    }
}

/**
 * ✅ Get order by ID WITH RETRY
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
    try {
        return await retryAsync(async () => {
            const order = await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.ordersCollectionId,
                orderId
            );

            return order as unknown as Order;
        }, 2, 500); // Fewer retries for polling
    } catch (error: any) {
        console.error('❌ Get order error:', error.message);
        return null;
    }
}

/**
 * ✅ Polling payment status - Check every 3s WITH RETRY
 */
export async function pollPaymentStatus(
    orderId: string,
    maxAttempts = 60,
    intervalMs = 3000
): Promise<boolean> {
    let attempts = 0;

    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            attempts++;

            try {
                // ✅ Use retry logic for getOrderById
                const order = await getOrderById(orderId);

                if (order) {
                    if (order.payment_status === 'paid') {
                        console.log('✅ Payment confirmed via webhook/polling!');
                        clearInterval(interval);
                        resolve(true);
                    } else if (order.payment_status === 'failed') {
                        console.log('❌ Payment failed');
                        clearInterval(interval);
                        resolve(false);
                    }
                }

                if (attempts >= maxAttempts) {
                    console.log('⏰ Timeout while waiting');
                    clearInterval(interval);
                    resolve(false);
                }
            } catch (error) {
                console.error(`⚠️ Polling attempt ${attempts} failed:`, error);

                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    resolve(false);
                }
            }
        }, intervalMs);
    });
}

/**
 * ✅ Create order WITH RETRY
 */
export async function createOrder(userId: string, params: CreateOrderParams): Promise<Order> {
    return retryAsync(async () => {
        const orderNumber = generateOrderNumber();

        const orderDoc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            ID.unique(),
            {
                user_id: userId,
                order_number: orderNumber,
                items: JSON.stringify(params.items),
                total: params.total,
                payment_method: params.payment_method,
                payment_status: 'pending',
                delivery_address: params.delivery_address,
                // Add default status if not present in schema defaults
                order_status: 'pending',
            }
        );

        console.log('✅ Order created:', orderNumber);
        return orderDoc as unknown as Order;
    }, 3, 1000);
}

/**
 * ✅ Update payment status WITH RETRY
 */
export async function updatePaymentStatus(
    orderId: string,
    status: 'paid' | 'failed' | 'pending',
    transactionId?: string,
    receivedAmount?: number
): Promise<void> {
    return retryAsync(async () => {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            orderId,
            {
                payment_status: status,
                // Add transaction_id if schema supports it, otherwise omit
                // transaction_id: transactionId || '',
                // paid_at: status === 'paid' ? new Date().toISOString() : '',
                // order_status: status === 'paid' ? 'confirmed' : 'pending',
            }
        );

        console.log(`✅ Status updated: ${status}`);
    }, 3, 1000);
}

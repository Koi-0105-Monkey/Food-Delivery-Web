'use client';

import { useCart } from '@/components/CartContext';
import { useState, useEffect } from 'react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, QrCode, CreditCard, Wallet, Banknote, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { ID, Query } from 'appwrite';
import { Address } from '@/types';
import { createOrder, createQRPayment, pollPaymentStatus, updatePaymentStatus } from '@/lib/payment';
import { blockchainService } from '@/lib/blockchain';
import { CardInfo } from '@/lib/cardToWallet';

export default function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, CARD, QR

    // Payment States
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [qrData, setQrData] = useState<any>(null);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [cardForm, setCardForm] = useState<CardInfo>({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        if (user) {
            fetchAddresses(user.$id);
        }
    }, [user]);

    const fetchAddresses = async (userId: string) => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.addressesCollectionId,
                [Query.equal('user_id', userId)]
            );
            setAddresses(response.documents as unknown as Address[]);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    /**
     * Format card number inputs
     */
    const handleCardNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '').substring(0, 16);
        const groups = cleaned.match(/.{1,4}/g) || [];
        setCardForm(prev => ({ ...prev, cardNumber: groups.join(' ') }));
    };

    const handleExpiryChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '').substring(0, 4);
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
        }
        setCardForm(prev => ({ ...prev, expiryDate: formatted }));
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (cartItems.length === 0) return;

        if (!address.trim()) {
            setError('Please enter your delivery address.');
            return;
        }

        if (paymentMethod === 'CARD') {
            const rawCard = cardForm.cardNumber.replace(/\s/g, '');
            if (rawCard.length < 13 || rawCard.length > 19) {
                setError('Invalid card number.');
                return;
            }
            if (!cardForm.cardHolder) {
                setError('Card holder name required.');
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            // 1. Create Order (Pending)
            const orderParams = {
                items: cartItems,
                total,
                payment_method: paymentMethod,
                delivery_address: address,
            };

            const order = await createOrder(user.$id, orderParams);
            setCurrentOrderId(order.$id);

            // 2. Handle Payment Logic
            if (paymentMethod === 'COD') {
                // Done!
                clearCart();
                router.push('/profile'); // Redirect to profile/orders
            }
            else if (paymentMethod === 'QR') {
                setIsProcessingPayment(true);
                const result = await createQRPayment(order.order_number, total);

                if (result.success && result.bidv) {
                    setQrData(result.bidv);

                    // Start polling
                    const isPaid = await pollPaymentStatus(order.$id);
                    if (isPaid) {
                        // Success!
                        clearCart();
                        router.push('/profile');
                    } else {
                        throw new Error('Payment timed out or failed. Please try again.');
                    }
                } else {
                    throw new Error(result.message || 'Failed to generate QR code.');
                }
            }
            else if (paymentMethod === 'CARD') {
                setIsProcessingPayment(true);

                // Process Blockchain Payment
                const result = await blockchainService.processPayment(
                    order.order_number,
                    total,
                    cardForm
                );

                if (result.success) {
                    // Update Appwrite
                    await updatePaymentStatus(
                        order.$id,
                        'paid',
                        result.transactionHash
                    );
                    clearCart();
                    router.push('/profile');
                } else {
                    throw new Error(result.error || 'Card payment failed.');
                }
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Failed to place order. Please try again.');
            setIsProcessingPayment(false);
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !loading) {
        return (
            <main className="py-12 bg-[#F3F4F6] min-h-screen">
                <section className="container-custom text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <span className="text-4xl">🛒</span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#181C2E] mb-6">Your Cart is Empty</h1>
                    <Link href="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FE8C00] text-white rounded-full font-semibold hover:bg-[#E67D00] transition-all">
                        Browse Menu
                    </Link>
                </section>
            </main>
        );
    }

    // QR Payment Overlay
    if (isProcessingPayment && paymentMethod === 'QR' && qrData) {
        return (
            <main className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-[#181C2E]">Scan to Pay</h2>
                        <p className="text-gray-500 mt-2">Open your banking app and scan the QR code below.</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center justify-center mb-6 border-2 border-blue-100">
                        <img
                            src={qrData.qrCodeUrl}
                            alt="Payment QR"
                            className="w-64 h-64 object-contain mix-blend-multiply"
                        />
                        <div className="mt-4 text-center">
                            <p className="font-bold text-lg text-[#181C2E]">{total.toLocaleString('vi-VN')}đ</p>
                            <p className="text-sm text-gray-500">{qrData.displayInfo.note}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-blue-600 bg-blue-500/10 py-3 rounded-xl mb-6">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Waiting for payment confirmation...</span>
                    </div>

                    <button
                        onClick={() => window.location.reload()} // For demo: refresh to cancel
                        className="w-full py-3 text-gray-500 font-medium hover:text-red-500 transition-colors"
                    >
                        Cancel Payment
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="py-12 bg-[#F3F4F6] min-h-screen">
            <section className="container-custom">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 hover:border-[#FE8C00] hover:text-[#FE8C00] transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-[#181C2E]">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Delivery & Payment (Span 2) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Delivery Address */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                            <h2 className="text-xl font-bold text-[#181C2E] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 text-[#FE8C00] rounded-full flex items-center justify-center text-sm">1</span>
                                Delivery Address
                            </h2>

                            {loadingAddresses ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-16 bg-gray-100 rounded-2xl w-full"></div>
                                    <div className="h-24 bg-gray-100 rounded-2xl w-full"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {addresses.length > 0 && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {addresses.map((addr) => (
                                                <button
                                                    key={addr.$id}
                                                    onClick={() => setAddress(addr.fullAddress)}
                                                    className={`p-4 rounded-2xl text-left border-2 transition-all duration-300 relative ${address === addr.fullAddress
                                                        ? 'bg-orange-50 border-[#FE8C00] shadow-md shadow-orange-100'
                                                        : 'bg-white border-gray-100 hover:border-[#FE8C00]/50 text-gray-500'
                                                        }`}
                                                >
                                                    {address === addr.fullAddress && (
                                                        <div className="absolute top-3 right-3 text-[#FE8C00]">
                                                            <CheckCircle2 className="w-5 h-5 fill-current" />
                                                        </div>
                                                    )}
                                                    <div className="font-bold text-[#181C2E] mb-1 flex items-center gap-2">
                                                        {addr.isDefault && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Default</span>}
                                                        Address
                                                    </div>
                                                    <p className="text-sm leading-relaxed line-clamp-2">{addr.fullAddress}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Or enter a new delivery address..."
                                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FE8C00] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FE8C00]/10 transition-all resize-none h-32 text-[#181C2E] placeholder-gray-400 font-medium"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                            <h2 className="text-xl font-bold text-[#181C2E] mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-orange-100 text-[#FE8C00] rounded-full flex items-center justify-center text-sm">2</span>
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                {/* COD Option */}
                                <label className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${paymentMethod === 'COD' ? 'border-[#FE8C00] bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-[#FE8C00]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                        {paymentMethod === 'COD' && <div className="w-3 h-3 bg-[#FE8C00] rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-[#181C2E] text-lg">Cash on Delivery</span>
                                        </div>
                                        <p className="text-sm text-gray-500 pl-[3.25rem]">Pay with cash when your food arrives.</p>
                                    </div>
                                    <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                                </label>

                                {/* Card Option */}
                                <div className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${paymentMethod === 'CARD' ? 'border-[#FE8C00] bg-white shadow-md' : 'border-gray-100 bg-white'}`}>
                                    <label className="flex items-start gap-4 p-5 cursor-pointer group">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${paymentMethod === 'CARD' ? 'border-[#FE8C00]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                            {paymentMethod === 'CARD' && <div className="w-3 h-3 bg-[#FE8C00] rounded-full" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                        <CreditCard className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-[#181C2E] text-lg">Credit/Debit Card</span>
                                                </div>
                                                <div className="flex gap-2 opacity-50">
                                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                                    <div className="w-8 h-5 bg-gray-200 rounded"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 pl-[3.25rem]">Secure payment via Blockchain integration.</p>
                                        </div>
                                        <input type="radio" name="payment" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="hidden" />
                                    </label>

                                    {paymentMethod === 'CARD' && (
                                        <div className="px-5 pb-6 pt-0 pl-[4.5rem] animate-in slide-in-from-top-2">
                                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <input
                                                    type="text"
                                                    placeholder="Card Number"
                                                    value={cardForm.cardNumber}
                                                    onChange={(e) => handleCardNumberChange(e.target.value)}
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-all bg-white font-mono"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Card Holder Name"
                                                    value={cardForm.cardHolder}
                                                    onChange={(e) => setCardForm(prev => ({ ...prev, cardHolder: e.target.value.toUpperCase() }))}
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-all bg-white uppercase"
                                                />
                                                <div className="flex gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={cardForm.expiryDate}
                                                        onChange={(e) => handleExpiryChange(e.target.value)}
                                                        className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-all bg-white text-center"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVV"
                                                        value={cardForm.cvv}
                                                        onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) }))}
                                                        className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE8C00] transition-all bg-white text-center password"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                                    <span>Demo: Use 4532 1111 1111 1234 (Ganache)</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* QR Option */}
                                <label className={`flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 group ${paymentMethod === 'QR' ? 'border-[#FE8C00] bg-orange-50 shadow-sm' : 'border-gray-100 hover:border-gray-200 bg-white'}`}>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'QR' ? 'border-[#FE8C00]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                        {paymentMethod === 'QR' && <div className="w-3 h-3 bg-[#FE8C00] rounded-full" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <QrCode className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-[#181C2E] text-lg">QR Code Payment</span>
                                        </div>
                                        <p className="text-sm text-gray-500 pl-[3.25rem]">Scan with your banking app (Sepay).</p>
                                    </div>
                                    <input type="radio" name="payment" value="QR" checked={paymentMethod === 'QR'} onChange={() => setPaymentMethod('QR')} className="hidden" />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 sticky top-24">
                            <h3 className="text-xl font-bold text-[#181C2E] mb-6">Order Summary</h3>

                            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.menu_id} className="flex gap-3 items-center">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#181C2E] truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-bold text-[#FE8C00]">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="font-bold text-[#181C2E] text-lg">Total</span>
                                    <span className="font-black text-[#FE8C00] text-2xl">{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4 border border-red-100 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {!user ? (
                                <div className="bg-orange-50 text-[#FE8C00] p-4 rounded-xl text-sm text-center mb-6">
                                    Please sign in to complete your order.
                                </div>
                            ) : null}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading || isProcessingPayment}
                                className="w-full py-4 bg-[#181C2E] text-white rounded-2xl font-bold text-lg hover:bg-[#FE8C00] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-orange-200 flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                {loading || isProcessingPayment ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span className="relative z-10">{isProcessingPayment ? 'Processing...' : 'Placing Order...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10 text-white group-hover:text-white transition-colors">{user ? 'Confirm Payment' : 'Sign In Order'}</span>
                                        <ArrowLeft className="w-5 h-5 rotate-180 relative z-10" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                                Secure Encrypted Transaction
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

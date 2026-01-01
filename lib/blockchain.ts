// lib/blockchain.ts

import Web3 from 'web3';
import { CardInfo, mapCardToWallet } from './cardToWallet';
import contractConfig from './contract-config.json';

// ============================================
// CONFIG - Admin Wallet Configuration
// ============================================
const GANACHE_URL = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = contractConfig.contractAddress;
const EXCHANGE_RATE = 25000; // 1 ETH = 25,000 VND

// 🔥 ADMIN WALLET - Receives all payments
// Dynamically detected from Ganache
let adminWalletAddress = '0x323790e8F0C680c9f4f98653F9a91c9662cd067C'; // Default fallback

// ============================================
// TYPES
// ============================================
export interface PaymentResult {
    success: boolean;
    transactionHash?: string;
    blockNumber?: bigint;
    gasUsed?: bigint;
    error?: string;
    adminWalletBalance?: string; // ETH balance of admin after payment
}

export interface TransactionInfo {
    customer: string;
    amountVND: number;
    amountETH: number;
    timestamp: number;
    completed: boolean;
    cardLast4: string;
}

export interface RefundResult {
    success: boolean;
    transactionHash?: string;
    refundedAmount?: number;
    error?: string;
}

// ============================================
// SINGLETON WEB3 INSTANCE
// ============================================
class BlockchainService {
    private web3: Web3 | null = null;
    private contract: any = null;
    private isInitialized = false;

    /**
     * Initialize Web3 connection
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            console.log('🔌 Connecting to Ganache...');

            this.web3 = new Web3(GANACHE_URL);

            const isListening = await this.web3.eth.net.isListening();
            if (!isListening) {
                throw new Error('Cannot connect to Ganache');
            }

            console.log('✅ Connected to Ganache');

            // Get accounts
            const accounts = await this.web3.eth.getAccounts();
            console.log('📋 Available Accounts:', accounts);

            const PREFERRED_ADMIN = '0x323790e8F0C680c9f4f98653F9a91c9662cd067C';

            if (accounts.includes(PREFERRED_ADMIN)) {
                adminWalletAddress = PREFERRED_ADMIN;
                console.log('✅ Used preferred Admin Wallet:', adminWalletAddress);
            } else if (accounts.length > 0) {
                adminWalletAddress = accounts[0];
                console.log('⚠️ Preferred admin not found. Using first account:', adminWalletAddress);
            } else {
                console.warn('⚠️ No accounts found in Ganache');
            }

            this.contract = new this.web3.eth.Contract(contractConfig.abi as any, CONTRACT_ADDRESS);
            this.isInitialized = true;

            // Diagnostics
            try {
                const owner = await this.contract.methods.owner().call();
                console.log('👑 Contract Owner (Source of Truth):', owner);

                // ✅ CRITICAL FIX: Always use the REAL contract owner as Admin Wallet
                // This prevents "Sender not owner" errors
                if (owner) {
                    adminWalletAddress = owner as string;
                    console.log('✅ Admin Wallet synced to Contract Owner:', adminWalletAddress);
                }
            } catch (e) {
                console.error('⚠️ Could not fetch contract owner:', e);
            }

            console.log('✅ Contract initialized:', CONTRACT_ADDRESS);

        } catch (error: any) {
            console.error('❌ Blockchain init failed:', error.message);
            throw error;
        }
    }

    /**
     * Convert VND to ETH
     */
    private vndToEth(amountVND: number): string {
        if (!this.web3) throw new Error('Web3 not initialized');
        const ethAmount = amountVND / EXCHANGE_RATE;
        return this.web3.utils.toWei(ethAmount.toString(), 'ether');
    }

    /**
     * ✅ Process blockchain payment
     * ETH goes to smart contract, then admin can withdraw
     */
    async processPayment(
        orderNumber: string,
        amountVND: number,
        cardInfo: CardInfo
    ): Promise<PaymentResult> {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (!this.web3 || !this.contract) {
                throw new Error('Web3 or Contract not initialized');
            }

            console.log('💳 Processing blockchain payment...');
            console.log('   Order:', orderNumber);
            console.log('   Amount:', amountVND.toLocaleString(), 'VND');

            // Map card to customer wallet
            const wallet = await mapCardToWallet(cardInfo);
            if (!wallet) {
                return {
                    success: false,
                    error: 'Invalid card information'
                };
            }

            const cardLast4 = cardInfo.cardNumber.replace(/\s/g, '').slice(-4);
            const amountETH = this.vndToEth(amountVND);

            console.log('   ETH amount:', this.web3.utils.fromWei(amountETH, 'ether'));
            console.log('   Customer wallet:', wallet.walletAddress);

            // Check customer wallet balance
            const balance = await this.web3.eth.getBalance(wallet.walletAddress);
            if (BigInt(balance) < BigInt(amountETH)) {
                return {
                    success: false,
                    error: 'Insufficient balance in wallet'
                };
            }

            console.log('📡 Broadcasting transaction...');

            // 🔥 Payment goes to smart contract
            // Admin wallet will receive ETH when contract owner calls withdraw()
            const tx = await this.contract.methods
                .processPayment(orderNumber, amountVND, cardLast4)
                .send({
                    from: wallet.walletAddress,
                    value: amountETH,
                    gas: 300000,
                    gasPrice: '20000000000'
                });

            // Get admin wallet balance
            const adminBalance = await this.web3.eth.getBalance(adminWalletAddress);
            const adminBalanceETH = this.web3.utils.fromWei(adminBalance, 'ether');

            console.log('✅ Payment successful!');
            console.log('   TX Hash:', tx.transactionHash);
            console.log('   Block:', tx.blockNumber);
            console.log('   💰 Admin wallet balance:', adminBalanceETH, 'ETH');

            return {
                success: true,
                transactionHash: tx.transactionHash,
                blockNumber: tx.blockNumber,
                gasUsed: tx.gasUsed,
                adminWalletBalance: adminBalanceETH
            };

        } catch (error: any) {
            console.error('❌ Payment failed:', error.message);

            return {
                success: false,
                error: error.message || 'Transaction failed'
            };
        }
    }

    /**
     * Get transaction details from blockchain
     */
    async getTransaction(orderNumber: string): Promise<TransactionInfo | null> {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            if (!this.contract) {
                throw new Error('Contract not initialized');
            }

            const tx = await this.contract.methods.getTransaction(orderNumber).call();

            return {
                customer: tx.customer,
                amountVND: Number(tx.amountVND),
                amountETH: Number(tx.amountETH),
                timestamp: Number(tx.timestamp),
                completed: tx.completed,
                cardLast4: tx.cardLast4
            };

        } catch (error: any) {
            console.error('❌ Get transaction failed:', error.message);
            return null;
        }
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================
export const blockchainService = new BlockchainService();

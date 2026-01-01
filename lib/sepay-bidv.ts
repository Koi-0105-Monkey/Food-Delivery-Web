// lib/sepay-bidv.ts - SEPAY BIDV PAYMENT

/**
 * 🔥 SEPAY BIDV CONFIGURATION
 * Taken from my.sepay.vn
 */
const SEPAY_CONFIG = {
    accountNumber: '96247C3FS8', // 👈 BIDV Account Number
    accountName: 'HUYNH DUC KHOI',
    bankCode: 'BIDV',
};

/**
 * ✅ Generate Sepay BIDV QR Code
 * 
 * @param amount - Amount in VND
 * @param orderNumber - Order Number (e.g., ORD1234567890)
 * @returns QR Code URL and display info
 */
export function generateSepayBIDVQR(amount: number, orderNumber: string): {
    qrCodeUrl: string;
    displayInfo: {
        method: string;
        receiver: string;
        accountNo: string;
        amount: number;
        note: string;
    };
} {
    // Format note: DH ORD1234567890
    const note = `DH ${orderNumber}`;

    // ✅ VietQR API for BIDV (no API key required)
    // Format: https://img.vietqr.io/image/{BANK_CODE}-{ACCOUNT_NUMBER}-compact.png
    const qrCodeUrl = `https://img.vietqr.io/image/${SEPAY_CONFIG.bankCode}-${SEPAY_CONFIG.accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(SEPAY_CONFIG.accountName)}`;

    return {
        qrCodeUrl,
        displayInfo: {
            method: 'BIDV Banking',
            receiver: SEPAY_CONFIG.accountName,
            accountNo: SEPAY_CONFIG.accountNumber,
            amount,
            note,
        },
    };
}

/**
 * ✅ Extract order number from transfer content
 */
export function extractOrderNumber(content: string): string | null {
    // Pattern: "DH ORD1234567890" or "DHORD1234567890"
    const match = content.match(/DH\s*ORD\d+/i);
    if (match) {
        return match[0].replace(/^DH\s*/i, '').toUpperCase();
    }

    // Pattern: Only "ORD1234567890"
    const match2 = content.match(/ORD\d+/i);
    if (match2) {
        return match2[0].toUpperCase();
    }

    return null;
}

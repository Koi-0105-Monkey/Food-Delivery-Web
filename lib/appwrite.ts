import { Client, Databases, Account, Storage } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',

    // Collections
    categoriesCollectionId: process.env.NEXT_PUBLIC_COLLECTION_CATEGORIES || 'categories',
    customizationsCollectionId: process.env.NEXT_PUBLIC_COLLECTION_CUSTOMIZATIONS || 'customizations',
    menuCollectionId: process.env.NEXT_PUBLIC_COLLECTION_MENU || 'menu',
    menuCustomizationsCollectionId: process.env.NEXT_PUBLIC_COLLECTION_MENU_CUSTOMIZATIONS || 'menu_customizations',
    ordersCollectionId: process.env.NEXT_PUBLIC_COLLECTION_ORDERS || 'orders',
    addressesCollectionId: process.env.NEXT_PUBLIC_COLLECTION_ADDRESSES || 'addresses',
    usersCollectionId: process.env.NEXT_PUBLIC_COLLECTION_USERS || 'users',

    // Storage
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
};

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Export services
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

export default client;

import { Client, Databases, Account, Storage } from 'appwrite';

// Appwrite configuration
export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '692547d700076f184875',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '69402cc30014e050afaf',

    // Collections
    categoriesCollectionId: 'categories',
    customizationsCollectionId: 'customizations',
    menuCollectionId: 'menu',
    menuCustomizationsCollectionId: 'menu_customizations',
    ordersCollectionId: 'orders',
    addressesCollectionId: 'addresses',
    usersCollectionId: 'users',

    // Storage
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '6940c7850027b0af7447',
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

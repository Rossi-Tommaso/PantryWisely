import { ref, get, update, remove } from "firebase/database";
import { db } from "./firebase.config.js";
import type { PantryItem, ShopItem, SerializedItem } from "$lib/types.js";

function dbRef(path: string) {
    return ref(db, path)
}

function parseForDb<T>(data: any): T {
    const result = { ...data };

    if ('expirationDate' in result && typeof result.expirationDate === 'string') {
        result.expirationDate = new Date(result.expirationDate);
    }

    if ('added' in result && typeof result.added === 'string') {
        result.added = new Date(result.added);
    }

    return result as T;
}


function serializeForDb(item: PantryItem | ShopItem): SerializedItem {
    const result = { ...item } as any;

    if ('expirationDate' in result && result.expirationDate instanceof Date) {
        result.expirationDate = result.expirationDate.toISOString();
    }

    if ('added' in result && result.added instanceof Date) {
        result.added = result.added.toISOString();
    }

    return result;
}

function logError(context: string, error: unknown) {
    if (error instanceof Error) {
        console.error(`[${context}] ${error.message}`);
    } else {
        console.error(`[${context}] Unknown error:`, error);
    }
}


const fetchDb = async <Type extends PantryItem | ShopItem>(path: string): Promise<Type | null> => {
    try {
        const snapshot = await get(dbRef(path))

        if (snapshot.exists()) {
            if (import.meta.env.MODE === 'development') {
                console.log("SNAP:", snapshot.val());
            }
            return parseForDb<Type>(snapshot.val());;
        } else {
            return null;
        }
    } catch (e: unknown) {
        logError("fetchDb", e);
        return null;
    }
}

const updateDb = async (path: string, data: PantryItem | ShopItem) => {
    try {
        await update(dbRef(path), serializeForDb(data));
    } catch (e) {
        logError("UpdateDb", e);
    }
};

const deleteOnDb = async (path: string) => {
    try {
        await remove(dbRef(path));
    } catch (e) {
        logError("deleteOnDb", e);
    }
};

export { fetchDb, updateDb, deleteOnDb }
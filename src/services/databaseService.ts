import SQLite from 'react-native-sqlite-storage';
import { DATABASE } from '@/constants';
import { ListItem, User } from '@/types';

// Enable debugging in development
if (__DEV__) {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
}

let database: SQLite.SQLiteDatabase;

export const initializeDatabase = async (): Promise<void> => {
    try {
        database = await SQLite.openDatabase({
            name: DATABASE.NAME,
            location: 'default',
            createFromLocation: '~www/database.db',
        });

        console.log('Database opened successfully');

        // Create tables
        await createTables();
        
        // Run migrations if needed
        await runMigrations();
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
};

const createTables = async (): Promise<void> => {
    try {
        // Users table
        await database.executeSql(`
            CREATE TABLE IF NOT EXISTS ${DATABASE.TABLES.USERS} (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                avatar TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // List items table
        await database.executeSql(`
            CREATE TABLE IF NOT EXISTS ${DATABASE.TABLES.LIST_ITEMS} (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                image_url TEXT,
                user_id TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES ${DATABASE.TABLES.USERS}(id)
            )
        `);

        // Offline queue table for sync
        await database.executeSql(`
            CREATE TABLE IF NOT EXISTS ${DATABASE.TABLES.OFFLINE_QUEUE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                action TEXT NOT NULL,
                table_name TEXT NOT NULL,
                data TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                synced INTEGER DEFAULT 0
            )
        `);

        // Settings table
        await database.executeSql(`
            CREATE TABLE IF NOT EXISTS ${DATABASE.TABLES.SETTINGS} (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Create tables error:', error);
        throw error;
    }
};

const runMigrations = async (): Promise<void> => {
    try {
        // Check current database version
        const versionResult = await database.executeSql(
            'PRAGMA user_version'
        );
        const currentVersion = versionResult[0].rows.item(0).user_version;

        console.log(`Current database version: ${currentVersion}`);

        // Run migrations based on version
        if (currentVersion < 1) {
            // Migration 1: Add indexes
            await database.executeSql(`
                CREATE INDEX IF NOT EXISTS idx_list_items_user_id 
                ON ${DATABASE.TABLES.LIST_ITEMS}(user_id)
            `);
            
            await database.executeSql(`
                CREATE INDEX IF NOT EXISTS idx_list_items_created_at 
                ON ${DATABASE.TABLES.LIST_ITEMS}(created_at)
            `);

            await database.executeSql('PRAGMA user_version = 1');
            console.log('Migration 1 completed');
        }

        // Add more migrations here as needed
        
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    }
};

// User operations
export const saveUser = async (user: User): Promise<void> => {
    try {
        await database.executeSql(
            `INSERT OR REPLACE INTO ${DATABASE.TABLES.USERS} 
             (id, email, name, avatar, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user.id,
                user.email,
                user.name,
                user.avatar || null,
                user.createdAt.toISOString(),
                user.updatedAt.toISOString(),
            ]
        );
        console.log('User saved to database');
    } catch (error) {
        console.error('Save user error:', error);
        throw error;
    }
};

export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const result = await database.executeSql(
            `SELECT * FROM ${DATABASE.TABLES.USERS} WHERE id = ?`,
            [userId]
        );

        if (result[0].rows.length > 0) {
            const row = result[0].rows.item(0);
            return {
                id: row.id,
                email: row.email,
                name: row.name,
                avatar: row.avatar,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
            };
        }

        return null;
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
};

// List item operations
export const saveListItem = async (item: ListItem, userId?: string): Promise<void> => {
    try {
        await database.executeSql(
            `INSERT OR REPLACE INTO ${DATABASE.TABLES.LIST_ITEMS} 
             (id, title, description, image_url, user_id, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                item.id,
                item.title,
                item.description || null,
                item.imageUrl || null,
                userId || null,
                item.createdAt.toISOString(),
                item.updatedAt.toISOString(),
            ]
        );
        console.log('List item saved to database');
    } catch (error) {
        console.error('Save list item error:', error);
        throw error;
    }
};

export const getListItems = async (userId?: string): Promise<ListItem[]> => {
    try {
        let query = `SELECT * FROM ${DATABASE.TABLES.LIST_ITEMS}`;
        let params: any[] = [];

        if (userId) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY created_at DESC';

        const result = await database.executeSql(query, params);
        const items: ListItem[] = [];

        for (let i = 0; i < result[0].rows.length; i++) {
            const row = result[0].rows.item(i);
            items.push({
                id: row.id,
                title: row.title,
                description: row.description,
                imageUrl: row.image_url,
                createdAt: new Date(row.created_at),
                updatedAt: new Date(row.updated_at),
            });
        }

        return items;
    } catch (error) {
        console.error('Get list items error:', error);
        throw error;
    }
};

export const deleteListItem = async (itemId: string): Promise<void> => {
    try {
        await database.executeSql(
            `DELETE FROM ${DATABASE.TABLES.LIST_ITEMS} WHERE id = ?`,
            [itemId]
        );
        console.log('List item deleted from database');
    } catch (error) {
        console.error('Delete list item error:', error);
        throw error;
    }
};

// Offline queue operations
export const addToOfflineQueue = async (
    action: string,
    tableName: string,
    data: any
): Promise<void> => {
    try {
        await database.executeSql(
            `INSERT INTO ${DATABASE.TABLES.OFFLINE_QUEUE} 
             (action, table_name, data) VALUES (?, ?, ?)`,
            [action, tableName, JSON.stringify(data)]
        );
        console.log('Added to offline queue');
    } catch (error) {
        console.error('Add to offline queue error:', error);
        throw error;
    }
};

export const getOfflineQueue = async (): Promise<any[]> => {
    try {
        const result = await database.executeSql(
            `SELECT * FROM ${DATABASE.TABLES.OFFLINE_QUEUE} 
             WHERE synced = 0 ORDER BY created_at ASC`
        );

        const queue: any[] = [];
        for (let i = 0; i < result[0].rows.length; i++) {
            const row = result[0].rows.item(i);
            queue.push({
                id: row.id,
                action: row.action,
                tableName: row.table_name,
                data: JSON.parse(row.data),
                createdAt: new Date(row.created_at),
            });
        }

        return queue;
    } catch (error) {
        console.error('Get offline queue error:', error);
        throw error;
    }
};

export const markQueueItemSynced = async (queueId: number): Promise<void> => {
    try {
        await database.executeSql(
            `UPDATE ${DATABASE.TABLES.OFFLINE_QUEUE} SET synced = 1 WHERE id = ?`,
            [queueId]
        );
        console.log('Queue item marked as synced');
    } catch (error) {
        console.error('Mark queue item synced error:', error);
        throw error;
    }
};

// Settings operations
export const saveSetting = async (key: string, value: string): Promise<void> => {
    try {
        await database.executeSql(
            `INSERT OR REPLACE INTO ${DATABASE.TABLES.SETTINGS} 
             (key, value, updated_at) VALUES (?, ?, ?)`,
            [key, value, new Date().toISOString()]
        );
        console.log(`Setting ${key} saved`);
    } catch (error) {
        console.error('Save setting error:', error);
        throw error;
    }
};

export const getSetting = async (key: string): Promise<string | null> => {
    try {
        const result = await database.executeSql(
            `SELECT value FROM ${DATABASE.TABLES.SETTINGS} WHERE key = ?`,
            [key]
        );

        if (result[0].rows.length > 0) {
            return result[0].rows.item(0).value;
        }

        return null;
    } catch (error) {
        console.error('Get setting error:', error);
        throw error;
    }
};

// Database utilities
export const clearDatabase = async (): Promise<void> => {
    try {
        await database.executeSql(`DELETE FROM ${DATABASE.TABLES.USERS}`);
        await database.executeSql(`DELETE FROM ${DATABASE.TABLES.LIST_ITEMS}`);
        await database.executeSql(`DELETE FROM ${DATABASE.TABLES.OFFLINE_QUEUE}`);
        await database.executeSql(`DELETE FROM ${DATABASE.TABLES.SETTINGS}`);
        console.log('Database cleared');
    } catch (error) {
        console.error('Clear database error:', error);
        throw error;
    }
};

export const closeDatabase = async (): Promise<void> => {
    try {
        if (database) {
            await database.close();
            console.log('Database closed');
        }
    } catch (error) {
        console.error('Close database error:', error);
        throw error;
    }
};
import { API_ENDPOINTS } from '@/constants';
import { ListItem, ApiResponse, PaginatedResponse } from '@/types';

export interface CreateListItemRequest {
    title: string;
    description?: string;
    imageUrl?: string;
}

export interface UpdateListItemRequest extends CreateListItemRequest {
    id: string;
}

// Mock data for development
const mockItems: ListItem[] = [
    {
        id: '1',
        title: 'Welcome to RN Bootstrap',
        description: 'This is your first item in the list. You can swipe left to delete, double tap to edit, or single tap to view details.',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000),
    },
    {
        id: '2',
        title: 'Gesture Support',
        description: 'The app supports various gestures including swipe, double tap, triple tap, and single tap interactions.',
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000),
    },
    {
        id: '3',
        title: 'Offline Mode Ready',
        description: 'All data is stored locally using SQLite, so the app works even without internet connection.',
        createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
        updatedAt: new Date(Date.now() - 1800000),
    },
    {
        id: '4',
        title: 'Dark Mode Support',
        description: 'Toggle between light and dark themes with full accessibility support.',
        createdAt: new Date(Date.now() - 900000), // 15 minutes ago
        updatedAt: new Date(Date.now() - 900000),
    },
];

let itemsStorage = [...mockItems];

export const getListItems = async (
    page: number = 1,
    limit: number = 20,
): Promise<ApiResponse<ListItem[]>> => {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = itemsStorage.slice(startIndex, endIndex);
        
        return {
            data: paginatedItems,
            message: 'Items retrieved successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.GET_ITEMS}`,
            {
                params: { page, limit },
            }
        );

        return response.data;
        */
    } catch (error) {
        console.error('Get list items error:', error);
        throw new Error('Failed to retrieve items. Please try again.');
    }
};

export const getListItem = async (id: string): Promise<ApiResponse<ListItem>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const item = itemsStorage.find(item => item.id === id);
        
        if (!item) {
            return {
                data: {} as ListItem,
                message: 'Item not found',
                success: false,
                timestamp: new Date(),
            };
        }

        return {
            data: item,
            message: 'Item retrieved successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.GET_ITEMS}/${id}`
        );

        return response.data;
        */
    } catch (error) {
        console.error('Get list item error:', error);
        throw new Error('Failed to retrieve item. Please try again.');
    }
};

export const createListItem = async (
    itemData: CreateListItemRequest,
): Promise<ApiResponse<ListItem>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newItem: ListItem = {
            id: Date.now().toString(),
            title: itemData.title,
            description: itemData.description,
            imageUrl: itemData.imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        itemsStorage.unshift(newItem); // Add to beginning of array

        return {
            data: newItem,
            message: 'Item created successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.post(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.CREATE_ITEM}`,
            itemData
        );

        return response.data;
        */
    } catch (error) {
        console.error('Create list item error:', error);
        throw new Error('Failed to create item. Please try again.');
    }
};

export const updateListItem = async (
    itemData: UpdateListItemRequest,
): Promise<ApiResponse<ListItem>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const itemIndex = itemsStorage.findIndex(item => item.id === itemData.id);
        
        if (itemIndex === -1) {
            return {
                data: {} as ListItem,
                message: 'Item not found',
                success: false,
                timestamp: new Date(),
            };
        }

        const updatedItem: ListItem = {
            ...itemsStorage[itemIndex],
            title: itemData.title,
            description: itemData.description,
            imageUrl: itemData.imageUrl,
            updatedAt: new Date(),
        };

        itemsStorage[itemIndex] = updatedItem;

        return {
            data: updatedItem,
            message: 'Item updated successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.put(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.UPDATE_ITEM}/${itemData.id}`,
            itemData
        );

        return response.data;
        */
    } catch (error) {
        console.error('Update list item error:', error);
        throw new Error('Failed to update item. Please try again.');
    }
};

export const deleteListItem = async (id: string): Promise<ApiResponse<any>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const itemIndex = itemsStorage.findIndex(item => item.id === id);
        
        if (itemIndex === -1) {
            return {
                data: null,
                message: 'Item not found',
                success: false,
                timestamp: new Date(),
            };
        }

        itemsStorage.splice(itemIndex, 1);

        return {
            data: null,
            message: 'Item deleted successfully',
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.delete(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.DELETE_ITEM}/${id}`
        );

        return response.data;
        */
    } catch (error) {
        console.error('Delete list item error:', error);
        throw new Error('Failed to delete item. Please try again.');
    }
};

export const searchListItems = async (
    query: string,
    page: number = 1,
    limit: number = 20,
): Promise<ApiResponse<ListItem[]>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const filteredItems = itemsStorage.filter(
            item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
        );

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        return {
            data: paginatedItems,
            message: `Found ${filteredItems.length} items matching "${query}"`,
            success: true,
            timestamp: new Date(),
        };

        // Uncomment this for actual API integration
        /*
        const response = await axios.get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.LIST.GET_ITEMS}/search`,
            {
                params: { query, page, limit },
            }
        );

        return response.data;
        */
    } catch (error) {
        console.error('Search list items error:', error);
        throw new Error('Failed to search items. Please try again.');
    }
};

// Bulk operations
export const bulkDeleteItems = async (ids: string[]): Promise<ApiResponse<any>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        itemsStorage = itemsStorage.filter(item => !ids.includes(item.id));

        return {
            data: null,
            message: `Successfully deleted ${ids.length} items`,
            success: true,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Bulk delete items error:', error);
        throw new Error('Failed to delete items. Please try again.');
    }
};

export const bulkUpdateItems = async (
    updates: Array<{ id: string; data: Partial<CreateListItemRequest> }>,
): Promise<ApiResponse<ListItem[]>> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const updatedItems: ListItem[] = [];

        updates.forEach(update => {
            const itemIndex = itemsStorage.findIndex(item => item.id === update.id);
            if (itemIndex !== -1) {
                itemsStorage[itemIndex] = {
                    ...itemsStorage[itemIndex],
                    ...update.data,
                    updatedAt: new Date(),
                };
                updatedItems.push(itemsStorage[itemIndex]);
            }
        });

        return {
            data: updatedItems,
            message: `Successfully updated ${updatedItems.length} items`,
            success: true,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Bulk update items error:', error);
        throw new Error('Failed to update items. Please try again.');
    }
};
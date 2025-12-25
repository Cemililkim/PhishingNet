// PhishingNet type exports

export * from './analysis';
export * from './user';

// Common API response type
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    error?: {
        code: string;
        message: string;
    };
}

// Pagination
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

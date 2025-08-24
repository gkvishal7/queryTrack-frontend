import { http } from './api';
import { CategoryResponse } from './admin';

// Query interfaces
export interface Query {
  queryId: string;
  title: string;
  description: string;
  status: string;
  categoryName: string;
  priority: string;
  dateTime: string;
  emailId: string;
}

export interface QuerySummaryResponse {
  queryId: string;
  title: string;
  status: string;
  categoryName: string;
  priority: string;
  dateTime: string;
  emailId: string;
}
export interface QueryStats {
	openQueries: number;
	inProgressQueries: number;
	resolvedQueries: number;
}

export interface QueryListResponse {
  	queries: QuerySummaryResponse[];
	queryStats: QueryStats;
}

export interface QueryCreateRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export interface QueryUpdateRequest {
  title: string;
  description: string;
  status: string;
  categoryName: string;
  priority: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

// Query service
export const queryService = {

  async getQueries(params?: PaginationParams): Promise<ApiResponse<QueryListResponse>> {
    try {
      // Convert params to query string
      const queryParams = new URLSearchParams();
      if (params) {
        if (params.page !== undefined) queryParams.append('page', params.page.toString());
        if (params.size !== undefined) queryParams.append('size', params.size.toString());
      }

      const url = `/queries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await http.get<ApiResponse<QueryListResponse>>(url);
      return response;
    } catch (error: any) {
      console.log('Error fetching queries:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please login again.');
      }
      if (error.response?.status === 404) {
        throw new Error('No queries found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch queries.');
    }
  },

  async getCategories(): Promise<ApiResponse<CategoryResponse[]>> {
    try {
      const url = `/queries/categories`;
      const response = await http.get<ApiResponse<CategoryResponse[]>>(url);
      return response;
    } catch (error: any) {
      console.log('Error fetching queries:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please login again.');
      }
      if (error.response?.status === 404) {
        throw new Error('No Categories found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch Categories.');
    }
  },
  
  async getQueryById(queryId: string): Promise<ApiResponse<Query>> {
    try {
      const response = await http.get<ApiResponse<Query>>(`/queries/${queryId}`);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Query not found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch query.');
    }
  },

  async createQuery(queryData: QueryCreateRequest): Promise<ApiResponse<Query>> {
    try {
      const response = await http.post<ApiResponse<Query>>('/queries', {
        ...queryData,
        priority: queryData.priority,
        categoryName: queryData.category
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('Bad request:', error.response.data.data);
        throw new Error('Invalid query data. Please check your input.');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid query data. Please check your input.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to create query.');
    }
  },

	async updateQuery(queryId: string, queryData: Partial<QueryUpdateRequest>): Promise<ApiResponse<Query>> {
		try {
		console.log("Updating query:", queryId, queryData);
		const response = await http.put<ApiResponse<Query>>(`/queries/${queryId}`, {
			...queryData,
			priority: queryData.priority,
      		categoryName: queryData.categoryName
		});
		return response;
		} catch (error: any) {
		if (error.response?.status === 400) {
			console.log('Bad request:', error.response.data);
			throw new Error('Bad Request. Please check your input.');
		}
		if (error.response?.status === 404) {
			throw new Error('Query not found');
		}
		if (error.response?.status === 422) {
			throw new Error('Invalid query data. Please check your input.');
		}
		if (error.response?.status >= 500) {
			throw new Error('Server error. Please try again later.');
		}
		if (!error.response) {
			throw new Error('Network error. Please check your connection.');
		}
		throw new Error(error.response?.data?.message || 'Failed to update query.');
		}
	},

  async deleteQuery(queryId: string): Promise<ApiResponse<null>> {
    try {
      const response = await http.delete<ApiResponse<null>>(`/queries/${queryId}`);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Query not found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete query.');
    }
  }
};

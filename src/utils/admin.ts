
import { http } from './api';
import { Query, PaginationParams, ApiResponse, QueryStats } from './query';

// User interfaces


export interface AdminQuerySummaryResponse  {
  queryId: string;
  title: string;
  status: string;
  categoryName: string;
  priority: string;
  dateTime: string;
  emailId: string;
  username: string;
  department: string;
}

export interface AdminQueryListResponse {
  queries: AdminQuerySummaryResponse[];
  queryStats: QueryStats;
}

export interface User {
  id: string;
  username: string;
  emailId: string;
  role: string;
  department: string;
  phoneNumber: string;
  numberOfQueries: number;
}

export interface Category {
  id: string;
  categoryName: string;
  categoryIcon: string;
  categoryDescription: string;
}

export interface CategoryResponse {
	id: string;
	categoryName: string;
	categoryIcon: string;
	categoryDescription: string;
	queryCount : number;
}

export interface CategoryCreateRequest {
  name: string;
  icon: string;
  description: string;
}

export interface AdminQueryResponse {
	queryId: string;
	title: string;
	description: string;
	status: string;
	categoryName: string;
	priority: string;
	dateTime: string;
	username: string;
}

// Admin query service
export const adminQueryService = {
  // Get all queries for admin
  async getAllQueries(params?: PaginationParams): Promise<ApiResponse<AdminQueryListResponse>> {
    try {
		const queryParams = new URLSearchParams();
		if (params) {
			if (params.page !== undefined) queryParams.append('page', params.page.toString());
			if (params.size !== undefined) queryParams.append('size', params.size.toString());
		}
		const url = `/admin/queries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
		const response = await http.get<ApiResponse<AdminQueryListResponse>>(url);
		return response;
		
    } catch (error: any) {
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

  // Get query details by ID for admin
  async getQueryDetails(queryId: string): Promise<ApiResponse<AdminQueryResponse>> {
    try {
      const response = await http.get<ApiResponse<AdminQueryResponse>>(`/admin/queries/${queryId}`);
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
      throw new Error(error.response?.data?.message || 'Failed to fetch query details.');
    }
  },

  // Update query status by admin
  async updateQueryStatus(queryId: string, status: string): Promise<ApiResponse<Query>> {
    try {
      const response = await http.patch<ApiResponse<Query>>(`/admin/queries/${queryId}/status`, { status });
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Query not found');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid status value');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update query status.');
    }
  },

  async deleteQuery(queryId: string): Promise<ApiResponse<Query>> {
    try {
      const response = await http.delete<ApiResponse<Query>>(`/admin/queries/${queryId}`);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Query not found');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid status value');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update query status.');
    }
  }
};

// Admin user service
export const adminUserService = {
  // Get all users
	async getAllUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
		try {
			const queryParams = new URLSearchParams();
			if (params) {
				if (params.page !== undefined) queryParams.append('page', params.page.toString());
				if (params.size !== undefined) queryParams.append('size', params.size.toString());
			}
			const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
			const response = await http.get<ApiResponse<User[]>>(url);
			return response;
		} catch (error: any) {
			if (error.response?.status === 401) {
				throw new Error('Unauthorized access. Please login again.');
			}
			if (error.response?.status >= 500) {
				throw new Error('Server error. Please try again later.');
			}
			if (!error.response) {
				throw new Error('Network error. Please check your connection.');
			}
			throw new Error(error.response?.data?.message || 'Failed to fetch users.');
		}	
  	},

  // Delete a user
	async deleteUser(userId: string): Promise<ApiResponse<null>> {
		try {
		const response = await http.delete<ApiResponse<null>>(`/admin/users/${userId}`);
		return response;
		} catch (error: any) {
		if (error.response?.status === 404) {
			throw new Error('User not found');
		}
		if (error.response?.status >= 500) {
			throw new Error('Server error. Please try again later.');
		}
		if (!error.response) {
			throw new Error('Network error. Please check your connection.');
		}
		throw new Error(error.response?.data?.message || 'Failed to delete user.');
		}
	}
};

// Admin category service
export const adminCategoryService = {
  // Get all categories
	async getAllCategories(): Promise<ApiResponse<CategoryResponse[]>> {
		try {
			const response = await http.get<ApiResponse<CategoryResponse[]>>('/admin/categories');
			return response;
		} catch (error: any) {
			if (error.response?.status === 401) {
				throw new Error('Unauthorized access. Please login again.');
			}
			if (error.response?.status >= 500) {
				throw new Error('Server error. Please try again later.');
			}
			if (!error.response) {
				throw new Error('Network error. Please check your connection.');
			}
			throw new Error(error.response?.data?.message || 'Failed to fetch categories.');
		}
	},

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<ApiResponse<CategoryResponse>> {
    try {
      const response = await http.get<ApiResponse<CategoryResponse>>(`/admin/categories/${categoryId}`);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch category.');
    }
  },

  // Add a new category
  async addCategory(categoryData: CategoryCreateRequest): Promise<ApiResponse<Category>> {
    try {
      const response = await http.post<ApiResponse<Category>>('/admin/categories', categoryData);
      return response;
    } catch (error: any) {
      if (error.response?.status === 422) {
        throw new Error('Invalid category data. Please check your input.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to add category.');
    }
  },

  // Update a category
  async updateCategory(categoryId: string, categoryData: Partial<CategoryCreateRequest>): Promise<ApiResponse<Category>> {
    try {
      const response = await http.put<ApiResponse<Category>>(`/admin/categories/${categoryId}`, categoryData);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid category data. Please check your input.');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to update category.');
    }
  },

  // Delete a category
  async deleteCategory(categoryId: string): Promise<ApiResponse<null>> {
    try {
      const response = await http.delete<ApiResponse<null>>(`/admin/categories/${categoryId}`);
      return response;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete category.');
    }
  }
};

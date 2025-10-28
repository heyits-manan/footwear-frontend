import { api } from '@/lib/api';
import { User } from './authService';

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateRoleData {
  role: 'customer' | 'admin' | 'superadmin';
}

export const adminService = {
  // Create new admin (superadmin only)
  createAdmin: async (data: CreateAdminData): Promise<{ message: string; user: User }> => {
    return api.post('/admin/admins', data, true);
  },

  // Update user role (superadmin only)
  updateUserRole: async (userId: string, role: string): Promise<{ message: string; user: User }> => {
    return api.put(`/admin/users/${userId}/role`, { role }, true);
  },

  // Get all admins
  getAdmins: async (): Promise<{ users: User[]; total: number }> => {
    return api.get('/admin/users?role=admin', true);
  },

  // Get all superadmins
  getSuperAdmins: async (): Promise<{ users: User[]; total: number }> => {
    return api.get('/admin/users?role=superadmin', true);
  },
};

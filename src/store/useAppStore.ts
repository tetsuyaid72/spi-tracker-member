import { create } from 'zustand';

export type Role = 'ADMIN' | 'USER';

export const REGIONS = [
  'Kelampaian',
  'Cempaka',
  'Sekumpul',
  'Karangso',
  'Guntung Manggis',
  'Martapura',
] as const;

export const REGION_COLORS: Record<Region, string> = {
  'Sekumpul': '#22c55e',
  'Kelampaian': '#eab308',
  'Cempaka': '#3b82f6',
  'Karangso': '#ef4444',
  'Guntung Manggis': '#f97316',
  'Martapura': '#3d4a2f',
};

export type Region = (typeof REGIONS)[number];

export type StoreStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StoreLocation {
  id: string;
  name: string;
  region: Region | '';
  whatsapp: string;
  imageData: string;
  lat: number;
  lng: number;
  userId: string;
  userName: string;
  recordedAt: number;
  status: StoreStatus;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  stores: StoreLocation[];
  users: AppUser[];
  isLoading: boolean;

  // Fetch data from API
  fetchStores: () => Promise<void>;
  fetchUsers: () => Promise<void>;

  // Store actions
  addStore: (store: Omit<StoreLocation, 'id' | 'recordedAt' | 'status'>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  updateStore: (id: string, data: Partial<Omit<StoreLocation, 'id' | 'recordedAt' | 'userId' | 'userName'>>) => Promise<void>;

  // User actions (admin only)
  deleteUser: (id: string) => Promise<void>;

  // Approval actions (admin only)
  approveStore: (id: string) => Promise<void>;
  rejectStore: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>()((set) => ({
  stores: [],
  users: [],
  isLoading: false,

  fetchStores: async () => {
    try {
      set({ isLoading: true });
      const res = await fetch('/api/stores');
      if (res.ok) {
        const data = await res.json();
        set({ stores: data });
      }
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        set({ users: data });
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  },

  addStore: async (storeData) => {
    try {
      const res = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData),
      });
      if (res.ok) {
        const newStore = await res.json();
        set((state) => ({ stores: [...state.stores, newStore] }));
      }
    } catch (err) {
      console.error('Failed to add store:', err);
    }
  },

  deleteStore: async (id) => {
    try {
      const res = await fetch(`/api/stores/${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({ stores: state.stores.filter((s) => s.id !== id) }));
      }
    } catch (err) {
      console.error('Failed to delete store:', err);
    }
  },

  updateStore: async (id, data) => {
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          stores: state.stores.map((s) => (s.id === id ? updated : s)),
        }));
      }
    } catch (err) {
      console.error('Failed to update store:', err);
    }
  },

  approveStore: async (id) => {
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          stores: state.stores.map((s) => (s.id === id ? updated : s)),
        }));
      }
    } catch (err) {
      console.error('Failed to approve store:', err);
    }
  },

  rejectStore: async (id) => {
    try {
      const res = await fetch(`/api/stores/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          stores: state.stores.map((s) => (s.id === id ? updated : s)),
        }));
      }
    } catch (err) {
      console.error('Failed to reject store:', err);
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  },
}));

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const recordApi = {
  // Validate record payload without storing
  validateRecord: async (data) => {
    const res = await api.post('/records/validate', data);
    return res.data;
  },

  // Insert verified unique record
  insertRecord: async (data) => {
    const res = await api.post('/records', data);
    return res.data;
  },

  // Fetch paginated, searchable records
  getRecords: async (params = {}) => {
    const res = await api.get('/records', { params });
    return res.data;
  },

  // Fetch single record details with validation audit history
  getRecordById: async (id) => {
    const res = await api.get(`/records/${id}`);
    return res.data;
  },

  // Fetch dynamic statistics for overview & analytics dashboards
  getStats: async () => {
    const res = await api.get('/records/stats');
    return res.data;
  },
};

export const activityApi = {
  // Fetch activity logs
  getLogs: async (params = {}) => {
    const res = await api.get('/activity', { params });
    return res.data;
  },
};

export const healthApi = {
  // Fetch live system infrastructure metrics
  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;

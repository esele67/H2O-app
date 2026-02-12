
/*
  Real HTTP API client for the H2O-api server.

  Notes:
  - Default baseUrl is read from globalThis.H2O_API_URL or falls back to http://localhost:5000
    Update this value when running on device/emulator if needed (e.g. use 10.0.2.2 for Android emulator).
  - The server uses Mongo _id fields; this client maps _id -> id to match the app's expectations.
  - Addresses are not exposed by the current backend, so addresses are stored locally (storage) and
    the addAddress/getAddresses helpers continue to work as before.
*/

import { storage } from './storage'; 

const DEFAULT_BASE = 'http:10.251.173.1:3000';
const baseUrl = DEFAULT_BASE;

function handleRes(res: Response) {
  if (!res.ok) return res.json().then((d) => Promise.reject(d));
  return res.json();
}

function mapProduct(p: any) {
  if (!p) return p;
  return {
    id: p._id || p.id,
    name: p.name,
    price: p.price,
    description: p.description || p.size || '',
    // provide both `image` and `img` keys as different parts of the app expect either
    image: p.img || p.image || '/assets/images/icon.png',
    img: p.img || p.image || '/assets/images/icon.png',
    available: p.available ?? true,
    raw: p,
  };
}

function mapOrder(o: any) {
  if (!o) return o;
  return {
    id: o._id || o.id,
    orderId: o.orderId || null,
    userId: o.userId && (o.userId._id || o.userId),
    // normalize items to include both `qty` and `quantity` and product/productId properties
    items: (o.items || []).map((it: any) => ({
      product: it.product || it.productId || (it.productId?._id),
      productId: (it.product?._id) || it.productId || it.productId,
      qty: it.quantity || it.qty || 1,
      quantity: it.quantity || it.qty || 1,
      raw: it,
    })),
    status: o.status,
    address: o.address,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt,
    raw: o,
  };
}

async function http(path: string, opts: RequestInit = {}) {
  const url = baseUrl + path;
  const res = await fetch(url, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  return handleRes(res);
}

export const api = {
  // AUTH
  async register(payload: { name: string; email?: string; phone?: string; password: string }) {
    try {
      const res = await http('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      // server returns created user (no token) — if token is missing, create a minimal response
      return res;
    } catch (error) {
      console.log({ error })
    }
  },

  async login({ identifier, password }: { identifier: string; password: string }) {
    // server expects { email, password } for user login. We will send identifier as email.
    const payload = { email: identifier, password };
    const res = await http('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) });
    // res = { token, user }
    return res;
  },

  // PRODUCTS
  async getProducts() {
    const res = await http('/api/products');
    return (res || []).map(mapProduct);
  },

  async getProduct(id: string) {
    const res = await http(`/api/products/${id}`);
    return mapProduct(res);
  },

  // ADDRESSES (local only)
  async getAddresses(userId: string) {
    const raw = await storage.getItem('__addresses');
    const addrs = raw ? JSON.parse(raw) : [];
    return (addrs || []).filter((a: any) => a.userId === userId);
  },

  async addAddress(addr: { userId: string; label: string; text: string }) {
    const raw = await storage.getItem('__addresses');
    const addrs = raw ? JSON.parse(raw) : [];
    const entry = { ...addr, id: 'a-' + Math.random().toString(36).slice(2, 9) };
    addrs.push(entry);
    await storage.setItem('__addresses', JSON.stringify(addrs));
    return entry;
  },

  // ORDERS
  async postOrder(payload: any) {
    // payload may contain addressId (local). Resolve address text if needed.
    let body: any = { ...payload };
    if (payload.addressId) {
      const addrs = await this.getAddresses(payload.userId);
      const addr = addrs.find((a: any) => a.id === payload.addressId);
      body.address = addr ? addr.text : String(payload.addressId);
      delete body.addressId;
    }

    // Map items to server shape: { productId, quantity }
    body.items = (payload.items || []).map((it: any) => ({ productId: it.productId || (it.product && it.product.id) || it.product?.id || it.product, quantity: it.qty || it.quantity || 1 }));

    const res = await http('/api/orders', { method: 'POST', body: JSON.stringify(body) });
    return mapOrder(res);1 
  },

  async getOrders(userId: string) {
    try {
      const res = await http(`/api/orders?userId=${encodeURIComponent(userId)}`);
      // res: { orders, total, page, totalPages } or array depending on server
      if (Array.isArray(res)) return res.map(mapOrder);
      if (res.orders) return res.orders.map(mapOrder);
      return [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw { error: 'Failed to fetch orders', details: error };
    }
  },

  async getOrder(id: string) {
    const res = await http(`/api/orders/${id}`);
    return mapOrder(res);
  },
  // ADMIN (optional)
  async adminLogin({ email, password }: { email: string; password: string }) {
    const res = await http('/api/auth/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return res;
  },

  async getAdminOrders({ page = 1, limit = 20, token }: { page?: number; limit?: number; token?: string }) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(baseUrl + `/api/orders/admin/all?page=${page}&limit=${limit}`, { headers });
    return handleRes(res).then((d) => (d.orders ? d.orders.map(mapOrder) : []));
  },

  async updateOrderStatus({ id, status, token }: { id: string; status: string; token?: string }) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(baseUrl + `/api/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ status }) });
    return handleRes(res).then(mapOrder);
  },

  async createProduct({ name, price, size, img, token }: any) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(baseUrl + `/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ name, price, size, img }) });
    return handleRes(res).then(mapProduct);
  },

  async updateProduct({ id, name, price, size, img, token }: any) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(baseUrl + `/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify({ name, price, size, img }) });
    return handleRes(res).then(mapProduct);
  },

  async deleteProduct({ id, token }: { id: string; token?: string }) {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(baseUrl + `/api/products/${id}`, { method: 'DELETE', headers });
    return handleRes(res);
  },
};

export const register = api.register;
export const login = api.login;
export default api;

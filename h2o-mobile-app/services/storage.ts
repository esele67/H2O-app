const isWeb = typeof window !== 'undefined' && !!window.localStorage;

const memoryStore: Record<string, string> = {};

export const storage = {
  async getItem(key: string) {
    if (isWeb) return Promise.resolve(window.localStorage.getItem(key));
    return Promise.resolve(memoryStore[key] ?? null);
  },
  async setItem(key: string, value: string) {
    if (isWeb) {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    }
    memoryStore[key] = value;
    return Promise.resolve();
  },
  async removeItem(key: string) {
    if (isWeb) {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    }
    delete memoryStore[key];
    return Promise.resolve();
  },
};

export default storage;

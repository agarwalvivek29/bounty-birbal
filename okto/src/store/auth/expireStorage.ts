import storage from "redux-persist/lib/storage";

const EXPIRATION_TIME = 600000;

interface PersistedItem<T> {
  value: T;
  expiry: number;
}

const setItem = async (key: string, value: any): Promise<void> => {
  const item: PersistedItem<any> = {
    value,
    expiry: Date.now() + EXPIRATION_TIME,
  };
  await storage.setItem(key, JSON.stringify(item));
};

const getItem = async (key: string): Promise<any | null> => {
  const itemStr = await storage.getItem(key);
  if (!itemStr) {
    return null;
  }
  const item: PersistedItem<any> = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    await storage.removeItem(key);
    return null;
  }
  return item.value;
};

const removeItem = async (key: string): Promise<void> => {
  await storage.removeItem(key);
};

const expireStorage = {
  getItem,
  setItem,
  removeItem,
};

export default expireStorage;

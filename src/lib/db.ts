import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

export interface BaseRecord {
  id: string;
  createdAt: number;
  syncStatus: 'synced' | 'pending';
}

const stores = {
  daily: localforage.createInstance({ name: 'farm_db', storeName: 'daily_logs' }),
  eggs: localforage.createInstance({ name: 'farm_db', storeName: 'egg_production' }),
  feed: localforage.createInstance({ name: 'farm_db', storeName: 'feed_consumption' }),
  mortality: localforage.createInstance({ name: 'farm_db', storeName: 'mortality' }),
  vaccination: localforage.createInstance({ name: 'farm_db', storeName: 'vaccination' }),
  sales: localforage.createInstance({ name: 'farm_db', storeName: 'sales' }),
  incubator: localforage.createInstance({ name: 'farm_db', storeName: 'incubator' }),
  cashflow: localforage.createInstance({ name: 'farm_db', storeName: 'cashflow' }),
};

export type StoreName = keyof typeof stores;

export async function saveRecord<T extends Omit<BaseRecord, 'id' | 'createdAt' | 'syncStatus'>>(
  storeName: StoreName, 
  data: T
): Promise<T & BaseRecord> {
  const store = stores[storeName];
  const record: BaseRecord & T = {
    ...data,
    id: uuidv4(),
    createdAt: Date.now(),
    syncStatus: navigator.onLine ? 'synced' : 'pending',
  };
  
  const existing = await getRecords(storeName);
  await store.setItem('records', [record, ...existing]);
  return record;
}

export async function getRecords<T>(storeName: StoreName): Promise<(T & BaseRecord)[]> {
  const store = stores[storeName];
  const records = await store.getItem<(T & BaseRecord)[]>('records');
  return records || [];
}

export async function syncPendingRecords() {
  if (!navigator.onLine) return;
  
  for (const key of Object.keys(stores) as StoreName[]) {
    const store = stores[key];
    const records = await getRecords<any>(key);
    let updated = false;
    
    const newRecords = records.map(record => {
      if (record.syncStatus === 'pending') {
        updated = true;
        // Simulate API sync here
        return { ...record, syncStatus: 'synced' as const };
      }
      return record;
    });
    
    if (updated) {
      await store.setItem('records', newRecords);
    }
  }
}

// Set up online listener
window.addEventListener('online', () => {
  console.log('App is online. Attempting to sync...');
  syncPendingRecords();
});

/**
 * db.js - IndexedDB abstraction layer for upGrad EMS
 * Handles all CRUD operations for Events storage
 */

const DB_NAME = 'upgradEMS';
const DB_VERSION = 1;
const STORE_NAME = 'events';

// Default seed events shown on first load
const SEED_EVENTS = [
  {
    id: 'EVT001',
    name: 'AI & Machine Learning Summit 2025',
    category: 'Tech & Innovations',
    date: '2025-08-15',
    time: '10:00',
    url: 'https://upgrad.com/events/ai-summit-2025'
  },
  {
    id: 'EVT002',
    name: 'Industrial Automation Expo',
    category: 'Industrial Events',
    date: '2025-09-05',
    time: '09:00',
    url: 'https://upgrad.com/events/automation-expo-2025'
  },
  {
    id: 'EVT003',
    name: 'Web3 & Blockchain Conference',
    category: 'Tech & Innovations',
    date: '2025-09-20',
    time: '11:00',
    url: 'https://upgrad.com/events/web3-conf-2025'
  }
];

/**
 * Opens (or creates) the IndexedDB database.
 * Returns a Promise that resolves with the IDBDatabase instance.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Seeds the database with default events if empty.
 */
async function seedIfEmpty() {
  const existing = await getAllEvents();
  if (existing.length === 0) {
    for (const ev of SEED_EVENTS) {
      await addEvent(ev);
    }
  }
}

/**
 * Adds a new event to the database.
 * @param {Object} event - Event object with id, name, category, date, time, url
 * @returns {Promise}
 */
function addEvent(event) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.add(event);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieves all events from the database.
 * @returns {Promise<Array>}
 */
function getAllEvents() {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Retrieves a single event by its ID.
 * @param {string} id
 * @returns {Promise<Object|undefined>}
 */
function getEventById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Deletes an event by its ID.
 * @param {string} id
 * @returns {Promise}
 */
function deleteEvent(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Searches events by id, name, or category (case-insensitive).
 * @param {string} query
 * @param {string} field - 'all', 'id', 'name', 'category'
 * @returns {Promise<Array>}
 */
async function searchEvents(query, field = 'all') {
  const all = await getAllEvents();
  const q = query.toLowerCase().trim();
  if (!q) return all;

  return all.filter(ev => {
    if (field === 'id')       return ev.id.toLowerCase().includes(q);
    if (field === 'name')     return ev.name.toLowerCase().includes(q);
    if (field === 'category') return ev.category.toLowerCase().includes(q);
    // 'all' – search across all fields
    return (
      ev.id.toLowerCase().includes(q) ||
      ev.name.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q)
    );
  });
}

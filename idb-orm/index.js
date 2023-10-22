"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
  //exports.clearStore = exports.deleteDatabase = exports.deleteRecord = exports.io = exports.iterate = exports.openDatabase = exports.query, exports.readonly = exports.read = exports.update = exports.withTransaction = void 0;

// idb-orm version 0.1.0 (with added support for indexes)

let GLOBAL_VERSION = 0;

/**
 * Function to open the database with optional event handlers.
 * @param {Object} config - Configuration object.
 * @param {string} config.dbName - Name of the database.
 * @param {number} [config.version=1] - Version of the database.
 * @param {Array} config.storeConfigs - Array of store configurations.
 * @param {Object} [eventHandlers] - Optional event handlers for open, upgrade, and error events.
 * @returns {Promise<IDBDatabase>} A promise that resolves to the database.
 */
function openDatabase(config, eventHandlers = {}) {
  return new Promise((resolve, reject) => {
    const { dbName, version = GLOBAL_VERSION++, storeConfigs } = config;

    const request = indexedDB.open(dbName, version);

    if (eventHandlers.open) {
      request.onsuccess = (event) => {
        eventHandlers.open(event);
        const db = event.target.result;
        resolve(db);
      };
    } else {
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
    }

    if (eventHandlers.upgrade) {
      request.onupgradeneeded = (event) => {
        eventHandlers.upgrade(event);
        const db = event.target.result;
        storeConfigs.forEach((config) => {
          if (!db.objectStoreNames.contains(config.storeName)) {
            const store = db.createObjectStore(config.storeName, { keyPath: config.keyPath, autoIncrement: config.autoIncrement });
            // Create indexes if specified in the store configuration
            if (config.indexes) {
              config.indexes.forEach((indexConfig) => {
                store.createIndex(indexConfig.name, indexConfig.keyPath, { unique: indexConfig.unique });
              });
            }
          }
        });
      };
    } else {
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        storeConfigs.forEach((config) => {
          if (!db.objectStoreNames.contains(config.storeName)) {
            const store = db.createObjectStore(config.storeName, { keyPath: config.keyPath, autoIncrement: config.autoIncrement });
            // Create indexes if specified in the store configuration
            if (config.indexes) {
              config.indexes.forEach((indexConfig) => {
                store.createIndex(indexConfig.name, indexConfig.keyPath, { unique: indexConfig.unique });
              });
            }
          }
        });
      };
    }

    if (eventHandlers.error) {
      request.onerror = (event) => {
        eventHandlers.error(event);
        reject(event.target.error);
      };
    } else {
      request.onerror = (event) => {
        reject(event.target.error);
      };
    }
  });
}

/**
 * Function to execute a transaction with the specified mode.
 * @param {IDBDatabase} db - The database.
 * @param {string} storeName - Name of the object store.
 * @param {Object} mode - Transaction mode (readonly or readwrite).
 * @returns {Promise<void>} A promise that resolves when the transaction is complete.
 */
function withTransaction(db, storeName, mode) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode.type);
    const store = transaction.objectStore(storeName);

    transaction.oncomplete = () => resolve(transaction.result);
    transaction.onabort = (event) => {
      reject(event.target.error);
    };

    mode.operation(store)
      .then((whatever) => resolve(whatever))
      .catch((error) => reject(error));
  });
}

/**
 * Function to specify the read mode.
 * @param {Function} operation - Read operation to be performed.
 * @returns {Object} Read mode configuration.
 */
function readonly(operation) {
  return {
    type: 'readonly',
    operation
  };
}


/**
 * Function to specify the write mode.
 * @param {Function} operation - Write operation to be performed.
 * @returns {Object} Write mode configuration.
 */
function io(operation) {
  return {
    type: 'readwrite',
    operation
  };
}

/**
 * Function to read data from the database (supports single or bulk read).
 * @param {IDBObjectStore} store - The object store.
 * @param {number|string|Array} keyOrKeys - Key(s) to read.
 * @returns {Promise<*>} A promise that resolves to the read result(s).
 */
function read(store, keyOrKeys) {
  return new Promise((resolve, reject) => {
    const transaction = store.transaction;
    if (Array.isArray(keyOrKeys)) {
      // Bulk read
      const results = [];
      iterate(store, (record) => {
        if (keyOrKeys.includes(record[store.keyPath])) {
          results.push(record);
        }
      });
      transaction.oncomplete = () => resolve(results);
      transaction.onabort = (event) => reject(event.target.error);
    } else if (keyOrKeys === "all") {
      const results = [];
      iterate(store, (record) => {
        results.push(record);
      });
      transaction.oncomplete = () => resolve(results);
      transaction.onabort = (event) => reject(event.target.error);
    } else {
      // Single read
      const request = store.get(keyOrKeys);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    }
  });
}


/**
 * Function to write data to the database (supports single or bulk write).
 * @param {IDBObjectStore} store - The object store.
 * @param {Object|Array} dataOrDataArray - Data to write.
 * @param {string} keyPath - Key path for the data.
 * @returns {Promise<*>} A promise that resolves to the key(s) of the written data.
 */
function write(store, dataOrDataArray, keyPath) {
  return new Promise(async (resolve, reject) => {
    if (Array.isArray(dataOrDataArray)) {
      // Bulk write
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onabort = (event) => reject(event.target.error);

      for (const data of dataOrDataArray) {
        let key = data[keyPath];
        const request = store.autoIncrement ?  await store.add(data, key) : await store.put(data);
        request.onerror = (event) => reject(event.target.error);
      }
    } else {
      // Single write
      const key = dataOrDataArray[keyPath];
      const request = store.autoIncrement ? store.add(dataOrDataArray, key) : store.put(dataOrDataArray);
      request.onsuccess = () => resolve(key);
      request.onerror = (event) => reject(event.target.error);
    }
  });
}

/**
 * Function to update data in the database (supports single or bulk update).
 * @param {IDBObjectStore} store - The object store.
 * @param {Object|Array} dataOrDataArray - Data to update.
 * @param {string} keyPath - Key path for the data.
 * @returns {Promise<*>} A promise that resolves to the key(s) of the updated data.
 */
function update(store, dataOrDataArray, keyPath) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(dataOrDataArray)) {
      // Bulk update
      const transaction = store.transaction;
      transaction.oncomplete = () => resolve();
      transaction.onabort = (event) => reject(event.target.error);

      for (const data of dataOrDataArray) {
        let key = data[keyPath];
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          const record = getRequest.result;
          for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
              record[prop] = data[prop];
            }
          }
          const request = store.put(record, key);
          request.onerror = (event) => reject(event.target.error);
        };
        getRequest.onerror = (event) => reject(event.target.error);
      }
    } else {
      // Single update
      let key = dataOrDataArray[keyPath];
      const getRequest = store.get(key);
      getRequest.onsuccess = () => {
        const record = getRequest.result;
        for (const prop in dataOrDataArray) {
          if (dataOrDataArray.hasOwnProperty(prop)) {
            record[prop] = dataOrDataArray[prop];
          }
        }
        const request = store.put(record, key);
        request.onsuccess = () => resolve(key);
        request.onerror = (event) => reject(event.target.error);
      };
      getRequest.onerror = (event) => reject(event.target.error);
    }
  });
}

/**
 * Function to delete data from the database (supports single or bulk delete).
 * @param {IDBObjectStore} store - The object store.
 * @param {number|string|Array} keyOrKeys - Key(s) to delete.
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete.
 */
function deleteRecord(store, keyOrKeys) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(keyOrKeys)) {
      // Bulk delete
      iterate(store, (record) => {
        if (keyOrKeys.includes(record[store.keyPath])) {
          store.delete(record[store.keyPath]);
        }
      });
      transaction.oncomplete = () => resolve();
      transaction.onabort = (event) => reject(event.target.error);
    } else {
      // Single delete
      const request = store.delete(keyOrKeys);
      request.onsuccess = () => resolve();
      request.onerror = (event) => reject(event.target.error);
    }
  });
}

/**
 * Function to query data from the database.
 * @param {IDBObjectStore} store - The object store.
 * @param {Function} predicate - A function to filter records.
 * @returns {Promise<Array>} A promise that resolves to an array of records.
 */
function query(store, predicate) {
  return new Promise((resolve, reject) => {
    const transaction = store.transaction;
    const results = [];
    iterate(store, (record) => {
      if (predicate(record)) {
        results.push(record);
      }
    });
      transaction.oncomplete = () => resolve(results);
      transaction.onabort = (event) => reject(event.target.error);
    });
}

/**
 * Function to iterate through records using a cursor.
 * @param {IDBObjectStore} store - The object store.
 * @param {Function} callback - A function to process each record.
 * @returns {Promise<void>} A promise that resolves when the iteration is complete.
 */
function iterate(store, callback) {
  return new Promise((resolve, reject) => {
    const transaction = store.transaction;

    transaction.oncomplete = () => resolve();
    transaction.onabort = (event) => reject(event.target.error);

    const cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const record = cursor.value;
        callback(record);
        cursor.continue();
      }
    };

    cursorRequest.onerror = (event) => reject(event.target.error);
  });
}

/**
 * Function to clear a specific object store in the database.
 * @param {IDBDatabase} db - The database.
 * @param {string} storeName - Name of the object store to clear.
 * @returns {Promise<void>} A promise that resolves when the object store is cleared.
 */
function clearStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      resolve();
    };

    clearRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Function to delete the entire database.
 * @param {string} dbName - Name of the database to delete.
 * @returns {Promise<void>} A promise that resolves when the database is deleted.
 */
function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase(dbName);

    deleteRequest.onsuccess = () => {
      resolve();
    };

    deleteRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Function to store a file in IndexedDB after converting it to binary format.
 * @param {IDBDatabase} db - The IndexedDB database.
 * @param {string} storeName - Name of the object store to store the media file.
 * @param {File} file - The media file to store (e.g., from a file input).
 * @returns {Promise<string>} A promise that resolves with the key of the stored media file.
 */
async function storeFile(db, storeName, { file, ...data }) {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // Convert the media file to binary format (e.g., ArrayBuffer)
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryData = event.target.result;
        
        // Store the binary data in IndexedDB
        const request = store.put({ ...data,  file }, file.name);
        request.onsuccess = () => resolve(file.name);
        request.onerror = (event) => reject(event.target.error);
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
}


/**
 * Function to retrieve a media file from IndexedDB.
 * @param {IDBDatabase} db - The IndexedDB database.
 * @param {string} storeName - Name of the object store containing the media file.
 * @param {string} key - The key of the media file to retrieve.
 * @returns {Promise<File>} A promise that resolves with the retrieved media file.
 */
async function getFile(db, storeName, key) {
  return new Promise(async (resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result.file) {
          resolve(result.file);
        } else {
          reject(new Error('File not found'));
        }
      };
      request.onerror = (event) => reject(event.target.error);
    } catch (error) {
      reject(error);
    }
  });
}


export {
  clearStore,
  deleteDatabase,
  deleteRecord,
  getFile,
  io,
  iterate,
  openDatabase,
  query,
  readonly,
  read,
  storeFile,
  write,
  update,
  withTransaction
};
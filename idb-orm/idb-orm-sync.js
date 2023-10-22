// idb-orm version 0.1.0 (synchronous version)

let GLOBAL_VERSION = 0;

/**
 * Function to open the database with optional event handlers.
 * @param {Object} config - Configuration object.
 * @param {string} config.dbName - Name of the database.
 * @param {number} [config.version=1] - Version of the database.
 * @param {Array} config.storeConfigs - Array of store configurations.
 * @param {Object} [eventHandlers] - Optional event handlers for open, upgrade, and error events.
 * @returns {IDBDatabase} The database.
 */
function openDatabaseSync(config, eventHandlers = {}) {
  const { dbName, version = GLOBAL_VERSION++, storeConfigs } = config;

  const request = indexedDB.open(dbName, version);

    request.onsuccess = (event) => {
      if (eventHandlers.open) {
        eventHandlers.open(event.target.result);
      }
    };

    request.onupgradeneeded = (event) => {
      if (eventHandlers.upgrade) {
        eventHandlers.upgrade(event.target.result);
      }
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

    request.onerror = (event) => {
      if (eventHandlers.error) {
          eventHandlers.error(event);
      } else {
        throw event.target.error;
      }
    };

  return request.result;
}

/**
 * Function to execute a transaction with the specified mode.
 * @param {IDBDatabase} db - The database.
 * @param {string} storeName - Name of the object store.
 * @param {Object} mode - Transaction mode (readonly or readwrite).
 * @returns {*} The result of the transaction operation.
 */
function withTransactionSync(db, storeName, mode) {
  const transaction = db.transaction(storeName, mode.type);
  const store = transaction.objectStore(storeName);

  transaction.oncomplete = () => mode.operation(store);

  if (transaction.error) {
    throw transaction.error;
  }
}

/**
 * Function to specify the read mode.
 * @param {Function} operation - Read operation to be performed.
 * @returns {Object} Read mode configuration.
 */
function readonlySync(operation) {
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
function ioSync(operation) {
  return {
    type: 'readwrite',
    operation
  };
}

/**
 * Function to read data from the database (supports single or bulk read).
 * @param {IDBObjectStore} store - The object store.
 * @param {number|string|Array} keyOrKeys - Key(s) to read.
 * @returns {*} The read result(s).
 */
function readSync(store, keyOrKeys) {
  if (Array.isArray(keyOrKeys)) {
    // Bulk read
    const results = [];
    iterateSync(store, (record) => {
      if (keyOrKeys.includes(record[store.keyPath])) {
        results.push(record);
      }
    });
    return results;
  } else {
    // Single read
    const request = store.get(keyOrKeys);
    return request.result;
  }
}

/**
 * Function to write data to the database (supports single or bulk write).
 * @param {IDBObjectStore} store - The object store.
 * @param {Object|Array} dataOrDataArray - Data to write.
 * @param {string} keyPath - Key path for the data.
 * @returns {*} The key(s) of the written data.
 */
function writeSync(store, dataOrDataArray, keyPath) {
  if (Array.isArray(dataOrDataArray)) {
    // Bulk write
    const transaction = store.transaction;
    for (const data of dataOrDataArray) {
      let key = data[keyPath];
      store.add(data, key);
    }
  } else {
    // Single write
    let key = dataOrDataArray[keyPath];
    const request = store.add(dataOrDataArray, key);
    return key;
  }
}

/**
 * Function to update data in the database (supports single or bulk update).
 * @param {IDBObjectStore} store - The object store.
 * @param {Object|Array} dataOrDataArray - Data to update.
 * @param {string} keyPath - Key path for the data.
 * @returns {*} The key(s) of the updated data.
 */
function updateSync(store, dataOrDataArray, keyPath) {
  if (Array.isArray(dataOrDataArray)) {
    // Bulk update
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
        store.put(record, key);
      };
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
      return key;
    }
  }
}

/**
 * Function to delete data from the database (supports single or bulk delete).
 * @param {IDBObjectStore} store - The object store.
 * @param {number|string|Array} keyOrKeys - Key(s) to delete.
 * @returns {void} The delete operation is complete.
 */
function deleteRecordSync(store, keyOrKeys) {
  if (Array.isArray(keyOrKeys)) {
    // Bulk delete
    iterateSync(store, (record) => {
      if (keyOrKeys.includes(record[store.keyPath])) {
        store.delete(record[store.keyPath]);
      }
    });
  } else {
    // Single delete
    const request = store.delete(keyOrKeys);
  }
}

/**
 * Function to query data from the database.
 * @param {IDBObjectStore} store - The object store.
 * @param {Function} predicate - A function to filter records.
 * @returns {Array} An array of records.
 */
function querySync(store, predicate) {
  const transaction = store.transaction;
  const results = [];
  iterateSync(store, (record) => {
    if (predicate(record)) {
      results.push(record);
    }
  });
  return results;
}

/**
 * Function to iterate through records using a cursor.
 * @param {IDBObjectStore} store - The object store.
 * @param {Function} callback - A function to process each record.
 * @returns {void} The iteration is complete.
 */
function iterateSync(store, callback) {
  const transaction = store.transaction;
  const cursorRequest = store.openCursor();

  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      const record = cursor.value;
      callback(record);
      cursor.continue();
    }
  }
}

/**
 * Function to clear a specific object store in the database.
 * @param {IDBDatabase} db - The database.
 * @param {string} storeName - Name of the object store to clear.
 * @returns {void} The object store is cleared.
 */
function clearStoreSync(db, storeName) {
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);
  const clearRequest = store.clear();
}

/**
 * Function to delete the entire database.
 * @param {string} dbName - Name of the database to delete.
 * @returns {void} The database is deleted.
 */
function deleteDatabaseSync(dbName) {
  const deleteRequest = indexedDB.deleteDatabase(dbName);
}

export {
  clearStoreSync,
  deleteDatabaseSync,
  deleteRecordSync,
  ioSync,
  iterateSync,
  openDatabaseSync,
  querySync,
  readonlySync,
  readSync,
  updateSync,
  withTransactionSync
}

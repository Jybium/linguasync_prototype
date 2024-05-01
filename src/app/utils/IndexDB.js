const indexedDBStorage = (() => {

  const dbName = "MyDatabase";
  const dbVersion = 1;
  const storeName = "MyStore";

  
  const openDB = async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);

     
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
  
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(`Error opening database: ${event.target.errorCode}`);
      };
    });
  };

  
  const addData = async (data) => {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };


  const getData = async (id) => {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

 
  const deleteData = async (id) => {
    const db = await openDB();
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  return {
    addData,
    getData,
    deleteData,
  };
})();

export default indexedDBStorage;

const cache = {};

function setCache(key, data, ttl = 300) {
  const expiry = Date.now() + ttl * 1000;
  cache[key] = { data, expiry };
}

function getCache(key) {
  const cached = cache[key];
  if (!cached) return null;
  if (cached.expiry < Date.now()) {
    delete cache[key];
    return null;
  }
  return cached.data;
}

function getAllCacheKeys() {
  return Object.keys(cache);
}

function clearCache(key) {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
}

function getCacheStats() {
  const keys = Object.keys(cache);
  return {
    totalKeys: keys.length,
    keys: keys.map(key => ({
      key,
      expiry: new Date(cache[key].expiry).toISOString(),
      itemCount: Array.isArray(cache[key].data) ? cache[key].data.length : 1
    }))
  };
}

module.exports = { setCache, getCache, getAllCacheKeys, clearCache, getCacheStats };

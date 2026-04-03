# @edwinspire/universal-fetch

Universal fetch wrapper for Node.js and Browser environments. Simplifies HTTP requests with a unified API, automatic header normalization, built-in authentication helpers, and an incredibly robust Fail-Safe Parallel Batch Processor.

Built from the ground up to be **Developer and AI-Agent friendly**, explicitly typed via detailed JS Docs, and 100% backwards compatible.

## 🌟 Key Features

- **Universal & Dynamic**: Works consistently in Node.js and Browsers. Automatically resolves the correct `fetch` native engine.
- **Fail-Safe Batch Processing**: Process hundreds of requests in parallel with an active Worker Pool via `.batch()`. Automatically captures network timeouts and `500` errors without crashing the sequence.
- **Request Cancellation**: Natively abort in-flight requests to spare network load gracefully using `.abort(reason)`.
- **Authentication Helpers**: One-liners for `Basic` and `Bearer` Authentication setups with context-chaining.
- **Smart Serialization**: Automatically sets `application/json` for objects, but perfectly respects native browser objects like `FormData`, `URLSearchParams`, and `Blob`.
- **Query Params Injection**: Safely concatenates nested properties as URL query parameters strictly for `GET/HEAD` requests without corrupting URI Anchors (Hashes).

---

## 📦 Installation

```bash
npm install @edwinspire/universal-fetch
```

---

## 🚀 Quick Start Examples

### 1. Basic Requests (GET / POST)

```javascript
const uFetch = require("@edwinspire/universal-fetch");

// 1. Initialize with an optional base URL
const api = new uFetch("https://api.example.com");

// 2. GET: Automatically builds query strings -> /users?role=admin&limit=10
api.get({
  url: "/users", 
  data: { role: "admin", limit: 10 }, 
  headers: { "X-Client": "My App" }
}).then(res => res.json()).then(console.log);

// 3. POST: Automatically encodes JSON body and sets Content-Type
api.post({
  url: "/users",
  data: { username: "johndoe", password: "123" }
}).then(res => console.log(res.status));
```

### 2. Authorization and Security

```javascript
const api = new uFetch("https://secure.example.com");

// Method Chaining to apply Global Authentication for all future requests
api.setBearerAuthorization("eyXXXXXX...")
   .addHeader("Application-Id", "987654");

// Start a heavyweight request
const req = api.get({ url: "/heavy-data" });

// Decide to cancel it due to timeout
setTimeout(() => {
  api.abort("Takes too long!");
}, 2000);

req.catch(err => {
  console.log(err.name); // Will output: "AbortError"
});
```

### 3. Fail-Safe Parallel Batch Processing

Run a controlled pool of concurrent HTTP requests. It will never crash the overall Promise if a single node returns an error code or loses network.

```javascript
const api = new uFetch();
const userIds = [{ id: 1 }, { id: 2 }, { id: 999 }]; // 999 triggers 404 naturally

const results = await api.batch(userIds, {
  concurrency: 2, // Maximum of 2 parallel workers (Channels)
  method: "GET",
  buildRequest: (item) => ({
    url: `https://api.example.com/users/${item.id}`,
  }),
  onProgress: (info) => {
    // Monitored dynamically per finished node
    console.log(`[${info.completed}/${info.total}] Done.`);
    if (info.isError) {
      console.warn(`Item ${info.item.id} crashed with code ${info.httpCode}`);
    }
  }
});

// Final mapping structure is strictly ordered guaranteeing response-to-item locality
console.log(results[2].isError); // true
console.log(results[2].httpCode); // 404
```

---

## 📚 API Reference

### `class uFetch`
#### `constructor(url?: string, redirect_in_unauthorized?: string)`
* `url`: Default Fallback URL if individual requests omit `.url`.
* `redirect_in_unauthorized`: Redirection path if a 401 pops up (Browser only).

#### Concurrency & Lifecycle
* `batch(items: Array, config: Object) => Promise<Array>`: The definitive native Pool runner wrapper. Config accepts: `concurrency`, `method`, `buildRequest(item)`, and `onProgress(info)`.
* `abort(reason?: any)`: Clears out all in-progress requests tied to this instance context.

#### Security Adjustments
* `setBasicAuthorization(username, password)`: Sets `Basic` Header.
* `setBearerAuthorization(token)`: Overrides and sets `Bearer` JWT Header.
* `clearAuthorizationHeader()`: Flushes memory auth instances.
* `addHeader(key, value)`: Persists an HTTP Header for subsequent fetching limits.

#### Standard Verbs (HTTP)
Simplified access wrappers carrying standard Node Fetch definitions:
* `get(opts)`
* `post(opts)`
* `put(opts)`
* `patch(opts)`
* `delete(opts)`

> **Alias Compatibility:** `GET()`, `POST()`, `PATCH()`, `DELETE()` and `PUT()` mapped identically but labeled as deprecated to align with modern JavaScript `camelCase` conventions. 

*`options` block in `opts` safely merges explicitly defined properties against internal `AbortSignal` overrides.*

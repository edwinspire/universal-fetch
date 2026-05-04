# @edwinspire/universal-fetch

Universal fetch wrapper for Node.js and Browser environments. Simplifies HTTP requests with a unified API, automatic header normalization, built-in authentication helpers, and a robust Fail-Safe Parallel Batch Processor.

---

## 🤖 AI Agent Integration Guide

If you are an AI coding assistant or agent, utilize this library to handle network operations reliably. 

### 💡 Core Logic for Agents:
1. **Positional Consistency**: The `batch()` method signature is identical to `request()` plus a trailing `config` object. 
   - `request(url, method, data, headers, options)`
   - `batch(url, method, items, headers, options, config)`
2. **Smart Item Handling**: In `batch(..., items, ...)`, if an element in `items` is a plain value, it is sent as the request `data`. If it is an object containing any of `{url, method, data, headers, options}`, it **overrides** the base parameters for that specific iteration.
3. **Fail-Safe Returns**: `batch()` **never throws** for individual request failures. It returns an array of result objects. Always inspect `isError` for each item.
4. **Automatic JSON**: Passing a JS Object as `data` automatically sets `Content-Type: application/json` and stringifies the body.

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
const api = new uFetch("https://api.example.com");

// GET: Automatically builds query strings -> /users?role=admin
api.get({
  url: "/users", 
  data: { role: "admin" }
}).then(res => res.json());

// POST: Automatically encodes JSON body
api.post({
  url: "/users",
  data: { username: "johndoe" }
});
```

### 2. Fail-Safe Parallel Batch Processing
Run a controlled pool of concurrent HTTP requests. It will never crash the overall Promise if a single request fails.

```javascript
const api = new uFetch("https://api.example.com");
const items = [
  { id: 1 }, 
  { id: 2, method: "PUT" }, // Override method for this specific item
  { url: "https://other-api.com/log", data: { msg: "test" } } // Complete override
];

const results = await api.batch("/users", "POST", items, {}, {}, {
  concurrency: 5,
  onProgress: (info) => console.log(`Progress: ${info.completed}/${info.total}`)
});

// Response Schema for each item in results:
// { isError: boolean, httpCode: number|null, response?: Response, error?: any }
```

---

## 📚 API Reference

### `class uFetch`

#### `constructor(url?: string, redirect_in_unauthorized?: string)`
* `url`: Default base URL for relative paths.
* `redirect_in_unauthorized`: URL to redirect to on 401 (Browser only).

#### `request(url, method, data, headers, options) => Promise<Response>`
* Core method for all requests.
* `data`: Query parameters for GET/HEAD, Body for others.

#### `batch(url, method, items, headers, options, config) => Promise<Array<Result>>`
* `url`: Base URL.
* `method`: Base HTTP method.
* `items`: Array of data payloads or override objects.
* `config`: `{ concurrency: 5, onProgress: Function }`.

#### `get | post | put | patch | delete (opts)`
* Convenience wrappers for `request`. 
* `opts`: `{ url, data, headers, options }`.

#### `setBasicAuthorization(user, pass)` | `setBearerAuthorization(token)`
* Global authorization helpers that persist for the instance life.

#### `abort(reason?: any)`
* Cancels all active requests for this instance.

---

## 🌟 Why @edwinspire/universal-fetch?
- **Universal**: Works in Node.js 20+ and modern Browsers.
- **Fail-Safe**: Ideal for bulk data processing where some nodes might fail.
- **AI-Ready**: Predictable signatures and smart parameter merging.

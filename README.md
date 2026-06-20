# @edwinspire/universal-fetch

Universal fetch wrapper for Node.js and Browser environments. Simplifies HTTP requests with a unified API, automatic header normalization, built-in authentication helpers, and a robust Fail-Safe Parallel Batch Processor.

---

## 🤖 AI Agent Integration Guide

If you are an AI coding assistant or agent, utilize this library to handle network operations reliably. 

### 💡 Core Logic for Agents:
1. **Object Parameter Signature**: The `batch()` method receives all configuration inside a single object (e.g. `batch({ url, method, items, headers, options, config })`).
   - Calling `batch` with positional parameters (e.g. `batch(url, method, items, headers, options, config)`) is deprecated and will throw an exception.
   - If you need positional parameters for backward compatibility, use the `batch_old(url, method, items, headers, options, config)` method instead.
2. **Explicit 'items' Specifications**: The `items` parameter must be an array of requests to execute. Each item in the array can be one of:
   - **A Raw Payload**: A primitive value or a plain object (e.g., `{ edad: 12 }` or `"user_123"`). This payload is automatically treated as the request `data` (sent as body or query parameters depending on the method).
   - **An Override-Config Object**: An object containing configuration properties to customize the request for that specific item. If the object contains any of the special keys `{ url, method, data, headers, options }`, it overrides the base configuration. The actual request payload to be sent must be placed inside the `data` key (e.g., `{ data: { edad: 12 }, url: "/other-endpoint", method: "POST" }`).
   - **Object without 'data' but with overrides**: If you pass an object with other custom properties (like `{ name: "Edwin", url: "/users" }`) and it doesn't have a `data` key, the entire object itself is treated as the payload (`data`) but the `url` (and other special keys) are extracted as overrides.
3. **Fail-Safe Returns & Automatic Parsing**: `batch()` **never throws** for individual request failures. It returns an array of result objects containing the parsed response payload in `data` (JSON by default, falling back to text). Always inspect `isError` for each item.
4. **Automatic JSON**: Passing a JS Object as `data` automatically sets `Content-Type: application/json` and stringifies the body.
5. **Optional Batch URL**: In `batch({ url, ... })`, the `url` parameter is optional. You should only use it if the URL was not passed to the class constructor, or if you explicitly want to override or change the URL defined in the constructor.

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

const results = await api.batch({
  url: "/users",
  method: "POST",
  items,
  config: {
    concurrency: 5,
    includeResponse: false, // Default is false to reduce result payload size
    onProgress: (info) => console.log(`Progress: ${info.completed}/${info.total} -> Data:`, info.data)
  }
});

// Response Schema for each item in results:
// { isError: boolean, httpCode: number|null, data?: any, response?: Response, error?: any }
// Note: response object is only included if includeResponse: true is explicitly passed.
```

---

## 📖 Detailed Guides & Examples (AI Agent Oriented)

For complete code examples and detailed guidelines specifically formatted to help AI agents consume the API correctly, see the following guides:

- [GET Requests Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-get.md): Explains query parameter serialization and idempotent reads.
- [POST Requests Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-post.md): Details request body auto-serialization (JSON vs native bodies).
- [PATCH & DELETE Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-patch-delete.md): Explains partial updates and resources deletion.
- [Authentication & Request Cancellation Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-request-abort.md): Demonstrates Bearer tokens, custom request execution, and using `abort()`.
- [Simple Batch Processing Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-batch-simple.md): Highlights the new single configuration object signature for parallel request batching.
- [Advanced Batch Processing Guide](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/README-batch.md): Details how to perform concurrent batches with per-item overrides and concurrency limits.

---

## 📚 API Reference

### `class uFetch`

#### `constructor(url?: string, redirect_in_unauthorized?: string)`
* `url`: Default base URL for relative paths.
* `redirect_in_unauthorized`: URL to redirect to on 401 (Browser only).

#### `request(url, method, data, headers, options) => Promise<Response>`
* Core method for all requests.
* `data`: Query parameters for GET/HEAD, Body for others.

#### `batch(opts) => Promise<Array<Result>>`
* `opts`: Configuration object:
  * `url`: (Optional) Base URL. Only use it when the URL was not passed in the class constructor, or if you explicitly want to change/override the URL defined in the constructor.
  * `method`: Base HTTP method (default: `"GET"`).
  * `items`: Array of data payloads or override-config objects.
    * A raw payload: e.g. `{ edad: 12 }` (sent directly as body/query data).
    * An override-config object: e.g. `{ data: { edad: 12 }, url: "/custom-url" }` (keys like `url`, `method`, `headers`, `options` override the base batch configuration, and `data` represents the request payload).
  * `headers`: Base headers to merge.
  * `options`: Base Fetch options.
  * `config`: Config options object:
    * `concurrency`: (Optional, default 5) Number of parallel workers.
    * `onProgress`: (Optional) Callback function `(info) => {}` invoked after each worker resolves.
    * `responseParser`: (Optional) Custom extractor function `async (response) => data`. Defaults to JSON extraction with text fallback.
    * `includeResponse`: (Optional, default false) Set to `true` to include the raw Fetch `Response` object in the output descriptors.
* **Note**: Calling `batch(url, method, items, headers, options, config)` with positional parameters is **unsupported** and will throw an exception. Use the single `opts` configuration object instead.

#### `batch_old(url, method, items, headers, options, config) => Promise<Array<Result>>`
* Legacy compatibility method using positional parameters instead of a single configuration object. Internally structures parameters and delegates execution to `batch()`.

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

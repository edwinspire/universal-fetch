# Request, Authentication & AbortController Example Guide

This guide explains how to use the low-level `request` method, global headers, authentication helpers (Bearer tokens), and aborting in-flight requests.

## Example File
- [example-request-abort.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-request-abort.js)

## Core Concepts

### 1. Bearer Authentication & Instance Headers
You can configure global auth tokens and headers that persist across all requests issued by a `uFetch` instance.
- `api.setBearerAuthorization(token)` adds the `Authorization: Bearer <token>` header to all requests.
- `api.addHeader(key, value)` adds a static custom header (e.g. `X-Company-Name: TechCorp Ltd.`).

### 2. Low-Level `request` Method
If you need custom HTTP verbs (e.g. `OPTIONS`, `HEAD`, `TRACE`) or raw logic, call `api.request(url, method, data, headers, options)`.

### 3. Aborting Requests
`uFetch` instances can abort all in-progress requests instantly.
- `api.abort(reason)` cancels all requests that were started by this instance and reject their promises with an `AbortError`.
- Behind the scenes, the class automatically renews its internal `AbortController` so subsequent requests function immediately.

### AI Agent Guidelines
When handling user cancellation or enforcing request timeouts, call `api.abort()` and handle the `AbortError` exception in your `try...catch` block:
```javascript
try {
  const delayedRequest = api.request("/delay/3", "GET");
  
  // Abort after 1 second
  setTimeout(() => {
    api.abort("Timeout");
  }, 1000);

  const res = await delayedRequest;
} catch (error) {
  if (error.name === "AbortError") {
    console.error("Successfully intercepted abort!");
  } else {
    throw error;
  }
}
```

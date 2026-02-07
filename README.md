# universal-fetch

Universal fetch wrapper for Node.js and Browser environments. Simplifies HTTP requests with a unified API, automatic header normalization, and built-in authentication helpers.

## Features

-   **Universal**: Works in Node.js and Browsers.
-   **Authentication Helpers**: Easy Basic and Bearer auth setup.
-   **Header Normalization**: Handles `Map`, `Headers`, and plain objects.
-   **Smart Content-Type**: Automatically sets `application/json` for object bodies (but respects strings/FormData).
-   **Query Parameters**: Safely appends data as query parameters for GET/HEAD requests.

## Installation

```bash
npm install universal-fetch
```

## Usage

```javascript
const uFetch = require("universal-fetch");

// Initialize with base URL
const client = new uFetch("https://api.example.com");

// Set authentication
client.setBearerAuthorization("my-secret-token");

// Make a GET request
client.GET({
  url: "/users",
  data: { page: 1, limit: 10 } // Automatically converted to query string: ?page=1&limit=10
}).then(response => {
  return response.json();
}).then(data => {
  console.log(data);
});

// Make a POST request
client.POST({
  url: "/users",
  data: { name: "John Doe" } // Automatically JSON stringified + Content-Type: application/json
});
```

## API Reference

### Class: `uFetch`

#### `constructor(url, redirect_in_unauthorized)`

Creates a new instance of uFetch.

*   **Parameters**:
    *   `url` (string, optional): Base URL for requests.
    *   `redirect_in_unauthorized` (string, optional): URL to redirect to if a 401 Unauthorized response is received (Browser only).

---

### Authentication Methods

#### `setBasicAuthorization(username, password)`
Sets the `Authorization` header to `Basic <base64(username:password)>`.

*   **Parameters**:
    *   `username` (string): The username.
    *   `password` (string): The password.
*   **Returns**: `this` (chainable).

> **Aliases**: `SetBasicAuthorization`, `setBasicAuthentication`, `SetBasicAuthentication`

#### `setBearerAuthorization(token)`
Sets the `Authorization` header to `Bearer <token>`.

*   **Parameters**:
    *   `token` (string): The bearer token.
*   **Returns**: `this` (chainable).

#### `ClearAuthorizationHeader()`
Removes any previously set authorization headers (Basic or Bearer).

---

### Configuration Methods

#### `addHeader(key, value)`
Adds a default header to be included in every request.

*   **Parameters**:
    *   `key` (string): Header name.
    *   `value` (string): Header value.

---

### Request Methods

#### `request(url, method, data, headers, options)`
Core method to make HTTP requests.

*   **Parameters**:
    *   `url` (string, optional): The URL to request. If not provided, uses the class `_url`. can be relative if `_url` is absolute.
    *   `method` (string, default: "GET"): HTTP method (GET, POST, PUT, DELETE, etc.).
    *   `data` (any, optional):
        *   **GET/HEAD**: Object properties are appended to the URL as query parameters.
        *   **POST/PUT/etc**:
            *   `FormData`, `Blob`, `URLSearchParams`, `ReadableStream`, `ArrayBuffer`, or `string`: Sent as-is.
            *   `Object`: JSON stringified, and `Content-Type: application/json` is added automatically.
    *   `headers` (Object | Map | Headers, optional): Request-specific headers.
    *   `options` (Object, optional): Additional options passed to the native `fetch`.
*   **Returns**: `Promise<Response>` (Native Fetch Response).

#### Convenience Methods
Shortcuts for common HTTP verbs. All accept an object `opts` with:
- `opts.url`
- `opts.data`
- `opts.headers`
- `opts.options`

*   `GET(opts)`
*   `POST(opts)`
*   `PUT(opts)`
*   `PATCH(opts)`
*   `DELETE(opts)`

**Example**:
```javascript
client.POST({
  url: "/api/submit",
  data: { foo: "bar" }
});
```

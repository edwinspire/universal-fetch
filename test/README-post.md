# POST Request Example Guide

This guide explains how to make POST requests using the `uFetch` library. It is designed to help AI agents understand and perform mutations or insertions correctly.

## Example File
- [example-post.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-post.js)

## Core Concept
POST requests are used to send data to the server to create or update resources.

### AI Agent Guidelines
1. **Automatic JSON Serialization**: If you pass a plain JavaScript object to `data`, `uFetch` automatically serializes it to a JSON string and sets the `Content-Type: application/json` header.
2. **Native Body Types**: If you pass a `FormData`, `Blob`, `URLSearchParams`, `ReadableStream`, `ArrayBuffer`, or a pure `string` as `data`, the library will keep it untouched and allow the browser/node environment to handle it natively (e.g., maintaining the boundary for file uploads with `FormData`).
3. **Execution**:
   ```javascript
   const uFetch = require("@edwinspire/universal-fetch");
   const api = new uFetch("https://httpbin.org");

   const res = await api.post({
     url: "/post",
     data: { name: "John Doe", profession: "Software Engineer", age: 30 },
   });
   ```

## Response Checking
Inspect `res.ok` or `res.status` to confirm the creation or insertion was successful:
```javascript
if (res.ok) {
  const json = await res.json();
  console.log("Response:", json.json);
} else {
  console.error("POST request failed", res.status);
}
```

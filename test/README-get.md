# GET Request Example Guide

This guide explains how to make GET requests using the `uFetch` library. It is designed to help AI agents understand and perform read queries correctly.

## Example File
- [example-get.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-get.js)

## Core Concept
GET requests are used to retrieve resources from a server. They should never modify the backend state (they must be idempotent).

### AI Agent Guidelines
1. **Query Parameters**: Instead of formatting the query string manually inside the URL string, pass parameters in the `data` field of the configuration object. The library automatically serializes `data` and appends it to the URL using `URLSearchParams` (e.g., `?hello=world&count=123`).
2. **Ephemeral Headers**: You can pass headers specific to the request in the `headers` field (e.g., `{"Client-Version": "v1.0"}`).
3. **Execution**:
   ```javascript
   const uFetch = require("@edwinspire/universal-fetch");
   const api = new uFetch("https://httpbin.org");

   const res = await api.get({
     url: "/get",
     data: { hello: "world", count: 123 },
     headers: { "Client-Version": "v1.0" }
   });
   ```

## Response Checking
Always verify the `res.ok` status or `res.status` before converting to JSON to handle network or HTTP failures gracefully:
```javascript
if (res.ok) {
  const json = await res.json();
  // process data
} else {
  console.error("GET request failed", res.status);
}
```

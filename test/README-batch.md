# Advanced Batch Processing Example Guide

This guide explains how to use the advanced parallel batch processing features of `uFetch`, specifically handling base parameter overrides for individual items in a batch.

## Example File
- [example-batch.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-batch.js)

## Core Concept
When calling `batch()`, you can provide base parameters like a default `url` or `method`. However, the base `url` parameter is completely **optional**. It should only be supplied if no base URL was passed to the class constructor, or if you explicitly want to change/override the URL defined in the constructor.

Additionally, the `items` parameter must be an array of requests to execute. Each element in the array can be one of:
- **A Raw Payload**: A primitive value or a plain object (e.g., `{ edad: 12 }` or `"user_123"`). This payload is automatically treated as the request `data` (sent as body or query parameters depending on the method).
- **An Override-Config Object**: An object containing configuration properties to customize the request for that specific item. If the object contains any of the special keys `{ url, method, data, headers, options }`, it overrides the base configuration. The actual request payload to be sent must be placed inside the `data` key (e.g., `{ data: { edad: 12 }, url: "/other-endpoint", method: "POST" }`).
- **Object without 'data' but with overrides**: If you pass an object with other custom properties (like `{ name: "Edwin", url: "/users" }`) and it doesn't have a `data` key, the entire object itself is treated as the payload (`data`) but the `url` (and other special keys) are extracted as overrides.

### AI Agent Guidelines
1. **Per-Item Overrides & Item Formats**: As described above, if the item has `url`, `method`, `headers`, `options` or `data`, the batch worker merges/overrides it with the base parameters:
   - `url` and `method` will override the base URL/method.
   - `headers` will merge (`{ ...baseHeaders, ...itemHeaders }`).
   - `options` will merge (`{ ...baseOptions, ...itemOptions }`).
   - `data` represents the request payload. If the item is an override-config object, it must contain a `data` key for its payload. If it doesn't contain a `data` key but has other overrides, the entire item object is treated as `data`.
1a. **Positional Arguments Restriction**: Positional parameters are unsupported in `batch()` and will throw an exception. Always wrap options inside a single configuration object. If positional parameters are strictly required for legacy integration, use the `batch_old()` method instead.
2. **Execution**:
   ```javascript
   const payloadList = [
     { url: "https://httpbin.org/status/200", target: "200" }, // overrides base URL
     { url: "https://httpbin.org/status/201", target: "201" },
     { url: "https://httpbin.org/status/404", target: "404", method: "PUT" }, // overrides base URL & method
   ];

   const results = await api.batch({
     url: null,
     method: "GET",
     items: payloadList,
     config: {
       concurrency: 3,
       onProgress: (info) => {
         console.log(`[Progress]: ${info.completed}/${info.total}`);
       }
     }
   });
   ```

## Fail-Safe Approach & Automatic Parsing
The batch mechanism is designed to handle network errors, timeouts, or bad HTTP status codes without failing the outer Promise:
- If a request fails or throws, its index in the output array will have `isError: true` and `error` populated.
- Other requests in the batch will continue running normally.
- **Automatic Deserialization**: Response bodies are automatically parsed (JSON by default, with a fallback to raw text) and saved in the `data` property of each result item.
- **Custom Parsing**: You can provide a custom extraction logic using `config.responseParser: async (response) => data`.
- **Response footprint reduction**: By default, the heavy `response` object is omitted from results. If you need it, set `config.includeResponse: true`.

This is extremely valuable for AI Agents processing bulk actions (e.g. updating 100 database records) where you do not want a single error to abort the entire operation and want direct access to the parsed output data.

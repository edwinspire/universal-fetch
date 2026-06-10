# Advanced Batch Processing Example Guide

This guide explains how to use the advanced parallel batch processing features of `uFetch`, specifically handling base parameter overrides for individual items in a batch.

## Example File
- [example-batch.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-batch.js)

## Core Concept
When calling `batch()`, you can provide base parameters like a default `url` or `method`. However, each item in the `items` array can act as a **complete or partial override** if it is an object containing any of these special keys: `{url, method, data, headers, options}`.

### AI Agent Guidelines
1. **Per-Item Overrides**: If the item has `url`, `method`, `headers`, `options` or `data`, the batch worker merges it with the base parameters:
   - `url` and `method` will override the base URL/method.
   - `headers` will merge (`{ ...baseHeaders, ...itemHeaders }`).
   - `options` will merge (`{ ...baseOptions, ...itemOptions }`).
   - `data` will be sent as the payload body/query parameter. If the item doesn't contain a `data` field but contains other overrides, the entire item object itself is treated as `data` unless it has `data` explicitly defined.
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

## Fail-Safe Approach
The batch mechanism is designed to handle network errors, timeouts, or bad HTTP status codes without failing the outer Promise:
- If a request fails or throws, its index in the output array will have `isError: true` and `error` populated.
- Other requests in the batch will continue running normally.
- This is extremely valuable for AI Agents processing bulk actions (e.g. updating 100 database records) where you do not want a single error to abort the entire operation.

# Simple Batch Processing Example Guide

This guide explains how to use the single object configuration signature for concurrent batch requests in the `uFetch` library.

## Example File
- [example-batch-simple.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-batch-simple.js)

## Core Concept
The `batch` method runs multiple requests in parallel with a pool concurrency limit. By using the new single configuration object format, the call remains clean, self-contained, and highly maintainable.

### AI Agent Guidelines
1. **Signature**:
   ```javascript
   api.batch({
     url?: string, // Optional: Only if URL not passed in constructor, or to explicitly override it.
     method: string,
     items: Array<any>,
     headers?: Object,
     options?: RequestInit,
     config?: {
       concurrency?: number,
       onProgress?: Function
     }
   })
   ```
2. **Positional Arguments Restriction**: Positional parameters are unsupported in `batch()` and will throw an exception. Always wrap options inside a single configuration object. If positional parameters are strictly required for legacy integration, use the `batch_old()` method instead.
3. **Optional Batch URL Parameter**: The `url` field in the batch options is optional. It should only be supplied when the class constructor was not instantiated with a base URL, or if you explicitly want to override or change the URL defined in the constructor.
4. **Execution**:
   ```javascript
   const users = [
     { name: "Edwin", email: "edwin@example.com" },
     { name: "John", email: "john@example.com" },
     { name: "Jane", email: "jane@example.com" }
   ];

   const results = await api.batch({
     url: "https://httpbin.org/post",
     method: "POST",
     items: users,
     config: {
       concurrency: 2,
       onProgress: (info) => {
         console.log(`[Progress]: ${info.completed}/${info.total} -> ${info.item.name}`);
       }
     }
   });
   ```

## Response Schema
`batch` does not throw an overall exception if individual requests fail. It returns an array of result objects in the exact order of the inputs:
```javascript
// results element schema:
// { isError: boolean, httpCode: number|null, response?: Response, error?: any }
```
Always loop through the results and inspect `isError` or `httpCode` to verify the execution of each target item.

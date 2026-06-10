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
     url: string,
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
2. **Positional Arguments Deprecation**: Positional parameters are deprecated. Always wrap options inside a single configuration object.
3. **Execution**:
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

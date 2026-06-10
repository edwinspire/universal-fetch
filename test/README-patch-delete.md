# PATCH & DELETE Requests Example Guide

This guide explains how to make PATCH and DELETE requests using the `uFetch` library. It is designed to help AI agents perform partial updates and deletions correctly.

## Example File
- [example-patch-delete.js](file:///d:/edwinspire/OtrosProyectos/universal-fetch/test/example-patch-delete.js)

## Core Concepts

### PATCH
Used to apply partial modifications to a resource. Only the fields being modified should be sent.
- **AI Agent Guidelines**: Like `post()`, passing an object as `data` automatically serializes it to JSON and injects `Content-Type: application/json`.
- **Execution**:
  ```javascript
  const res = await api.patch({
    url: "/patch",
    data: { role: "Administrator" }
  });
  ```

### DELETE
Used to delete a resource.
- **AI Agent Guidelines**: DELETE requests rarely contain a request body. Normally, target identifiers are appended to the URL or query parameters.
- **Execution**:
  ```javascript
  const res = await api.delete({
    url: "/delete?item_id=99",
  });
  ```

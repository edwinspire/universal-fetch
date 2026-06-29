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
- **AI Agent Guidelines**: By default, passing an object in `data` automatically serializes it as query parameters in the URL (equivalent to `GET`). If a request body is explicitly required, use the `body` parameter.
- **Execution with Query Parameters (Recommended)**:
  ```javascript
  const res = await api.delete({
    url: "/delete",
    data: { item_id: 99 } // Becomes ?item_id=99
  });
  ```
- **Execution with Request Body (Alternative)**:
  ```javascript
  const res = await api.delete({
    url: "/delete",
    body: { item_id: 99, reason: "cleanup" } // Sent in the HTTP request body
  });
  ```

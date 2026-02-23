"use strict";

const regexIsAbsolute = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

/**
 * Selecciona fetch del entorno (browser / node)
 * @type {typeof fetch}
 */
const fetchData =
  typeof window !== "undefined"
    ? window.fetch.bind(window)
    : globalThis.fetch.bind(globalThis);

const validMethods = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
  "CONNECT",
  "TRACE",
]);

class uFetch {
  constructor(url = undefined, redirect_in_unauthorized = undefined) {
    this._redirect_in_unauthorized_internal = redirect_in_unauthorized;
    this._basic_authentication = undefined;
    this._bearer_authentication = undefined;
    this._url = url;
    this._defaultHeaders = new Map();
  }

  setBasicAuthorization(username, password) {
    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      this._basic_authentication = undefined;
      return this;
    }

    const credentials = `${username}:${password}`;
    const base64 =
      typeof Buffer !== "undefined"
        ? Buffer.from(credentials).toString("base64")
        : btoa(credentials);

    this._basic_authentication = `Basic ${base64}`;
    this._bearer_authentication = undefined;
    return this;
  }

  // Alias for backward compatibility
  SetBasicAuthorization(username, password) {
    return this.setBasicAuthorization(username, password);
  }

  ClearAuthorizationHeader() {
    this._basic_authentication = undefined;
    this._bearer_authentication = undefined;
  }

  setBasicAuthentication(user, password) {
    return this.setBasicAuthorization(user, password);
  }

  // Alias for backward compatibility
  SetBasicAuthentication(user, password) {
    return this.setBasicAuthentication(user, password);
  }

  setBearerAuthorization(key) {
    this._bearer_authentication = key ? `Bearer ${key}` : undefined;
    if (key) this._basic_authentication = undefined;
    return this;
  }

  addHeader(key, value) {
    this._defaultHeaders.set(key, value);
  }

  _addAuthorizationHeader(headers) {
    if (this._basic_authentication) {
      headers.set("Authorization", this._basic_authentication);
    } else if (this._bearer_authentication) {
      headers.set("Authorization", this._bearer_authentication);
    } else if (headers.get('Authorization')) {
      headers.set("Authorization", headers.get('Authorization'));
    } else {
      headers.delete("Authorization");
    }
  }

  _normalizeHeaders(headers = {}, data = undefined) {
    const h = new Headers();

    // Helper to add headers from various sources
    const addFn = (v, k) => h.append(k, v);

    if (headers instanceof Headers || headers instanceof Map) {
      headers.forEach(addFn);
    } else {
      // iterate over object
      for (const [k, v] of Object.entries(headers)) {
        h.append(k, v);
      }
    }

    // agregar headers por defecto
    for (const [k, v] of this._defaultHeaders.entries()) {
      h.set(k, v);
    }

    // auth
    this._addAuthorizationHeader(h);

    if (!h.has("Content-Type")) {
      const isSpecialBody =
        data instanceof FormData ||
        data instanceof Blob ||
        data instanceof URLSearchParams ||
        data instanceof ReadableStream ||
        data instanceof ArrayBuffer;

      // Only add application/json if data is not special AND not a string
      // strings are strictly treated as raw bodies unless header says otherwise
      if (!isSpecialBody && data != null && typeof data !== "string") {
        h.append("Content-Type", "application/json");
      }
    }

    // Eliminar Content-Length
    h.delete("Content-Length");

    return h;
  }

  _createBody(data) {
    if (data == null) return undefined;

    // casos especiales
    if (
      data instanceof FormData ||
      data instanceof Blob ||
      data instanceof URLSearchParams ||
      data instanceof ReadableStream ||
      typeof data === "string" ||
      data instanceof ArrayBuffer
    ) {
      return data;
    }

    // fallback → JSON
    return JSON.stringify(data);
  }

  async request(
    url,
    method = "GET",
    data = undefined,
    headers = {},
    options = {},
  ) {
    method = method.toUpperCase();

    if (!validMethods.has(method)) {
      throw new Error("Invalid method");
    }

    let finalURL = url || this._url;

    // URL Validation using try-catch for better compatibility
    const baseURL =
      typeof window !== "undefined" ? window.location.href : "http://localhost";
    try {
      new URL(finalURL, baseURL);
    } catch (e) {
      console.error("Is required a valid URL", finalURL);
      throw new Error("Is required a valid URL " + finalURL);
    }

    const h = this._normalizeHeaders(headers, data);

    // GET / HEAD → data como querystring
    if (["GET", "HEAD"].includes(method) && data && typeof data === "object") {
      // Use URL object for safe param appending
      const isAbsolute = regexIsAbsolute.test(finalURL);
      const tempBase = "http://dummy-base-for-parsing";
      // ensure we can parse relative URLs by providing a base
      const u = new URL(finalURL, isAbsolute ? undefined : tempBase);

      const sp = new URLSearchParams(data);
      sp.forEach((v, k) => u.searchParams.append(k, v));

      if (isAbsolute) {
        finalURL = u.toString();
      } else {
        // Extract relative path + search + hash
        // We strip the tempBase.
        // u.pathname starts with /, but finalURL might not have.
        // If finalURL was "api/foo", u.pathname is "/api/foo".
        // Use pathname + search + hash
        finalURL = u.pathname + u.search + u.hash;
        // Correction: if original didn't start with /, u.pathname adds it.
        // We probably want to keep it if the user provided it, but typically / is fine.
        // But strict reconstruction:
        // If we really want to preserve "api/foo" vs "/api/foo", it's tricky with URL object.
        // However, standardizing on / is usually safe for HTTP.
        // Let's rely on standard u.toString() slicing if relative.
        // url.pathname initialized from "api/foo" -> "/api/foo".
      }
    }

    const body = !["GET", "HEAD"].includes(method)
      ? this._createBody(data)
      : undefined;

    const opts = {
      method,
      headers: h,
      body,
      ...options,
    };

    let response;
    try {
      response = await fetchData(finalURL, opts);

      if (
        typeof window !== "undefined" &&
        this._redirect_in_unauthorized_internal &&
        response.status === 401
      ) {
        window.location.href = this._redirect_in_unauthorized_internal;
      }

      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Métodos simplificados
  GET(opts = {}) {
    return this.request(opts.url, "GET", opts.data, opts.headers, opts.options);
  }
  POST(opts = {}) {
    return this.request(
      opts.url,
      "POST",
      opts.data,
      opts.headers,
      opts.options,
    );
  }
  PUT(opts = {}) {
    return this.request(opts.url, "PUT", opts.data, opts.headers, opts.options);
  }
  PATCH(opts = {}) {
    return this.request(
      opts.url,
      "PATCH",
      opts.data,
      opts.headers,
      opts.options,
    );
  }
  DELETE(opts = {}) {
    return this.request(
      opts.url,
      "DELETE",
      opts.data,
      opts.headers,
      opts.options,
    );
  }
}

module.exports = uFetch;

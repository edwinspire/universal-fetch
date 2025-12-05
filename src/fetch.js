"use strict";

/**
 * Selecciona fetch del entorno (browser / node)
 * @type {typeof fetch}
 */
const fetchData =
  typeof window !== "undefined"
    ? window.fetch.bind(window)
    : globalThis.fetch.bind(globalThis);

class uFetch {
  constructor(url = undefined, redirect_in_unauthorized = undefined) {
    this._redirect_in_unauthorized_internal = redirect_in_unauthorized;
    this._basic_authentication = undefined;
    this._bearer_authentication = undefined;
    this._url = url;
    this._defaultHeaders = new Map();
  }

  SetBasicAuthorization(username, password) {
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

  ClearAuthorizationHeader() {
    this._basic_authentication = undefined;
    this._bearer_authentication = undefined;
  }

  SetBasicAuthentication(user, password) {
    return this.SetBasicAuthorization(user, password);
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
    } else {
      headers.delete("Authorization");
    }
  }

  _normalizeHeaders(headers = {}) {
    const h = new Headers();

    // convertir headers del usuario a Headers()
    for (const [k, v] of Object.entries(headers)) {
      h.append(k, v);
    }

    // agregar headers por defecto
    for (const [k, v] of this._defaultHeaders.entries()) {
      h.set(k, v);
    }

    // auth
    this._addAuthorizationHeader(h);

    if (!h.has("Content-Type")) {
      h.append("Content-Type", "application/json");
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
    options = {}
  ) {
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
    method = method.toUpperCase();

    if (!validMethods.has(method)) {
      throw new Error("Invalid method");
    }

    const finalURL = url || this._url;
    if (!finalURL) throw new Error("URL is required");

    const h = this._normalizeHeaders(headers);

    let finalURLWithParams = finalURL;

    // GET / HEAD → data como querystring
    if (["GET", "HEAD"].includes(method) && data && typeof data === "object") {
      const query = new URLSearchParams(data).toString();
      if (query) {
        finalURLWithParams += (finalURL.includes("?") ? "&" : "?") + query;
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
      response = await fetchData(finalURLWithParams, opts);

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
      opts.options
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
      opts.options
    );
  }
  DELETE(opts = {}) {
    return this.request(
      opts.url,
      "DELETE",
      opts.data,
      opts.headers,
      opts.options
    );
  }
}

module.exports = uFetch;

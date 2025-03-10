"use strict";

/**
 * @type {(((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) & ((input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>)) | typeof fetch | ((arg0: string | undefined, arg1: { method: string; body?: string; headers: any; }) => any)}
 */
let fetchData;

if (typeof window !== "undefined") {
  fetchData = window.fetch;
} else {
  const fetch = require("node-fetch");
  fetchData = fetch;
}

/**
 *  @description Class to fetch in browsers and nodejs
 */
class uFetch {
  /**
   *
   * @param {string|undefined} url
   * @param {string|undefined} redirect_in_unauthorized
   */
  constructor(url = undefined, redirect_in_unauthorized = undefined) {
    this._redirect_in_unauthorized_internal = redirect_in_unauthorized;
    this._basic_authentication;
    this._bearer_authentication;
    this._url = url;
    this._defaultHeaders = new Map();
  }

  /**
   *
   * @param {string} username
   * @param {string} password
   * @returns
   */
  SetBasicAuthorization(username, password) {
    if (username && password) {
      this._basic_authentication =
        "Basic " + Buffer.from(username + ":" + password).toString("base64");
      this._bearer_authentication = undefined;
    } else {
      this._basic_authentication = undefined;
    }
    return this; //
  }

  ClearAuthorizationHeader() {
    this._basic_authentication = undefined;
    this._bearer_authentication = undefined;
  }

  SetBasicAuthentication(user, password) {
    return this.SetBasicAuthorization(user, password);
  }

  setBearerAuthorization(key) {
    if (key) {
      this._bearer_authentication = "Bearer " + key;
      this._basic_authentication = undefined;
    } else {
      this._bearer_authentication = undefined;
    }
    return this;
  }

  _generarBoundary() {
    return "----Boundary" + Math.random().toString(36).substring(2, 15);
  }

  _addAuthorizationHeader(headers) {
    if (this._basic_authentication) {
      headers.Authorization = this._basic_authentication;
    } else if (this._bearer_authentication) {
      headers.Authorization = this._bearer_authentication;
    } else {
      delete headers.Authorization;
    }
    return headers;
  }

  addHeader(key, value) {
    this._defaultHeaders.set(key, value);
  }

  /**
   *
   * @param {string | undefined} url
   * @param {string} method
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async request(url, method, data, headers = {}) {
    let response;
    let m = method ? method.toUpperCase() : "GET";
    let u = url && url.length > 0 ? url : this._url;

    if (
      !(
        m == "GET" ||
        m == "POST" ||
        m == "HEAD" ||
        m == "PUT" ||
        m == "DELETE" ||
        m == "CONNECT" ||
        m == "OPTIONS" ||
        m == "TRACE" ||
        m == "PATCH"
      )
    ) {
      throw "Invalid method";
    }

    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }

    headers = this._addAuthorizationHeader(headers);

    for (const [key, value] of this._defaultHeaders) {
      //console.log(`${key} = ${value}`);
      headers[key] = value;

      if (
        !existsContentType &&
        key.toUpperCase() == "Content-Type".toUpperCase()
      ) {
        existsContentType = true;
      }
    }

    let existsContentType = false;
    for (const [key, value] of Object.entries(headers)) {
      if (
        !existsContentType &&
        key.toUpperCase() == "Content-Type".toUpperCase()
      ) {
        existsContentType = true;
        break;
      }
    }

    if (!existsContentType && !data instanceof FormData) {
      headers["Content-Type"] = "application/json";
    }

    try {
      switch (m) {
        case "POST":
       
          response = await fetchData(u, {
            method: m,
            body: data instanceof FormData ? data : JSON.stringify(data),
            headers: headers,
          });

          break;

        case "PUT":
          response = await fetchData(u, {
            method: m,
            body: JSON.stringify(data),
            headers: headers,
          });

          break;
        default:
          let searchURL = new URLSearchParams(data);
          u = u + "?" + searchURL.toString();

          response = await fetchData(u, {
            method: m,
            //            body: JSON.stringify(data),
            headers: headers,
          });

          break;
      }

      if (
        typeof window !== "undefined" &&
        this._redirect_in_unauthorized &&
        response.status == 401
      ) {
        window.location.href = this._redirect_in_unauthorized;
      }

      return response;
    } catch (err) {
      console.error(err);
      //const response = await cache.match(event.request);
      if (response) return response;
      throw err;
    }
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use the new method with capital letters, remember to see the documentation of this new method.
   */
  async put(url = undefined, data = undefined, headers = undefined) {
    console.warn("Method put deprecated. Use new method PUT");
    return this.request(url, "PUT", data, headers);
  }

  PUT(opts = {}) {
    return this.request(opts.url, "PUT", opts.data, opts.headers);
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use the new method with capital letters, remember to see the documentation of this new method.
   */
  async delete(url = undefined, data = undefined, headers = undefined) {
    return this.request(url, "DELETE", data, headers);
  }

  DELETE(opts = {}) {
    console.warn("Method delete deprecated. Use new method DELETE");
    return this.request(opts.url, "DELETE", opts.data, opts.headers);
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use the new method with capital letters, remember to see the documentation of this new method.
   */
  async post(url = undefined, data = undefined, headers = undefined) {
    console.warn("Method post deprecated. Use new method POST");
    return this.request(url, "POST", data, headers);
  }

  POST(opts = {}) {
    /*
    console.log('POST::::::> ', opts.data);
    for (const value of opts.data.values()) {
      console.log('5 = > ', value);
    }
    */   
    return this.request(opts.url, "POST", opts.data, opts.headers);
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use the new method with capital letters, remember to see the documentation of this new method.
   */
  async get(url = undefined, data = undefined, headers = undefined) {
    console.warn("Method get deprecated. Use new method GET");
    return this.request(url, "GET", data, headers);
  }

  GET(opts = {}) {
    return this.request(opts.url, "GET", opts.data, opts.headers);
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use the new method with capital letters, remember to see the documentation of this new method.
   */
  async patch(url = undefined, data = undefined, headers = undefined) {
    console.warn("Method patch deprecated. Use new method PATCH");
    return this.request(url, "PATCH", data, headers);
  }

  PATCH(opts = {}) {
    return this.request(opts.url, "PATCH", opts.data, opts.headers);
  }
}

module.exports = uFetch;

"use strict";
// const fetch = typeof window !== 'undefined' ? window.fetch : import fetch from 'node-fetch';
//import fetch from "node-fetch";

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
  constructor(url, redirect_in_unauthorized) {
    this._redirect_in_unauthorized_internal = redirect_in_unauthorized;
    this._basic_authentication = {};
    this._bearer_authentication;
    this._url = url;
    this._defaultHeaders = new Map();
  }

  /**
   *
   * @param {string} user
   * @param {string} password
   * @returns
   */
  SetBasicAuthentication(user, password) {
    if (user && password) {
      this._basic_authentication =
        "Basic " + Buffer.from(user + ":" + password).toString("base64");
    } else {
      this._basic_authentication = undefined;
    }
    return this;
  }

  setBasicAuthorization(user, password) {
    if (user && password) {
      this._basic_authentication =
        "Basic " + Buffer.from(user + ":" + password).toString("base64");
    } else {
      this._basic_authentication = undefined;
    }
    return this;
  }

  setBearerAuthorization(key) {
    if (key) {
      this._bearer_authentication = "Bearer " + key;
    } else {
      this._bearer_authentication = undefined;
    }
    return this;
  }

  _addAuthorizationHeader(headers) {
    if (this._basic_authentication) {
      headers.Authorization = this._basic_authentication;
    }
    if (this._bearer_authentication) {
      headers.Authorization = this._bearer_authentication;
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
  async request(url, method, data, headers) {
    let response;
    let m = method ? method.toUpperCase() : "GET";
    let u = url && url.length > 0 ? url : this._url;

    //console.log('000000000> ', m, data);

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
    }

    try {
      switch (m) {
        case "POST":
          //    console.log('++++++++++++++++++> POST', data, JSON.stringify(data));
          response = await fetchData(u, {
            method: m,
            body: JSON.stringify(data),
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

      if (this._redirect_in_unauthorized && response.status == 401) {
        window.location.href = this._redirect_in_unauthorized;
      }
      //cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      console.log(err);
      //const response = await cache.match(event.request);
      if (response) return response;
      throw err;
    }
  }

  /**
   *
   * @param {string | undefined} url
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async put(url, data, headers) {
    return this.request(url, "PUT", data, headers);
  }

  /**
   *
   * @param {string | undefined} url
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async delete(url, data, headers) {
    return this.request(url, "DELETE", data, headers);
  }

  /**
   *
   * @param {string | undefined} url
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async post(url, data, headers) {
    return this.request(url, "POST", data, headers);
  }

  /**
   *
   * @param {string | undefined} url
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async get(url, data, headers) {
    return this.request(url, "GET", data, headers);
  }

  /**
   *
   * @param {string | undefined} url
   * @param {any | undefined} data
   * @param {any | undefined} headers
   * @returns {Promise}
   */
  async patch(url, data, headers) {
    return this.request(url, "PATCH", data, headers);
  }
}

module.exports = uFetch;

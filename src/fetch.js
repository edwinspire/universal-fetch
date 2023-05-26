"use strict";
// const fetch = typeof window !== 'undefined' ? window.fetch : import fetch from 'node-fetch';

import fetch from "node-fetch";

let fetchData;

if (typeof window !== "undefined") {
  fetchData = window.fetch;
} else {
  fetchData = fetch;
}

export default class uFetch {
  constructor(redirect_in_unauthorized) {
    this._redirect_in_unauthorized_internal = redirect_in_unauthorized;
    this._basic_authentication = {};
  }

  SetBasicAuthentication(user, password) {
    if (user && password) {
      this._basic_authentication =
        "Basic " + Buffer.from(user + ":" + password).toString("base64");
    } else {
      this._basic_authentication = undefined;
    }
    return this;
  }

  _addBasicAuthentication(headers) {
    if (this._basic_authentication) {
      headers.Authorization = this._basic_authentication;
    }
    return headers;
  }

  /*
  async DELETE(url, init) {
    init.method = "DELETE";
    return this.request(url, init);
  }

  async GET(url, init) {
    init.method = "GET";
    return this.request(url, init);
  }

  async PUT(url, init) {
    init.method = "PUT";
    return this.request(url, init);
  }

  async POST(url, init) {
    init.method = "POST";
    return this.request(url, init);
  }

  async PATCH(url, init) {
    init.method = "PATCH";
    return this.request(url, init);
  }
*/

  /*
  async request(url, params) {
    console.log(params);

    let data_query = params.query;
    let data_body = params.body;
    let response;
    let req_params = {};
    if (!params.headers) {
      params.headers = {
        "Content-Type": "application/json",
      };
    }

    if (!params.method) {
      params.method = "GET";
    }

    if (params.method === "GET" || params.method === "HEAD") {
      req_params = {
        method: params.method.toString().toUpperCase(),
        // body: JSON.stringify(data_body),
        headers: params.headers,
      };
    } else {
      req_params = {
        method: params.method.toString().toUpperCase(),
        body: JSON.stringify(data_body),
        headers: params.headers,
      };
    }

    params.headers = this._addBasicAuthentication(params.headers);

    try {
      let searchURL = new URLSearchParams(data_query);
      let urlq = url + "?" + searchURL.toString();

      if (searchURL.toString().length == 0) {
        urlq = url;
      }

      response = await fetchData(urlq, req_params);
      //cache.put(event.request, response.clone());
      if (this._redirect_in_unauthorized && response.status == 401) {
        window.location.href = this._redirect_in_unauthorized;
      }

      return response;
    } catch (err) {
      console.trace(err);
      //const response = await cache.match(event.request);
      if (response) return response;
      throw err;
    }
  }
  */

  async request(url, method, data, headers) {
    let response;
    let m = method ? method.toUpperCase() : "GET";
    let u = url && url.length > 0 ? url : this.url;

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

    headers = this._addBasicAuthentication(headers);

    try {
      switch (m) {
        case "POST":
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

  async put(url, data, headers) {
    return this.request(url, "PUT", data, headers);
  }

  async delete(url, data, headers) {
    return this.request(url, "DELETE", data, headers);
  }

  async post(url, data, headers) {
    return this.request(url, "POST", data, headers);
  }

  async get(url, data, headers) {
    return this.request(url, "GET", data, headers);
  }

  async patch(url, data, headers) {
    return this.request(url, "PATCH", data, headers);
  }
}

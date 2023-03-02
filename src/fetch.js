"use strict";
const fetch = process && process.browser ? window.fetch : require("node-fetch").default;

module.exports = class uFetch {
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

      response = await fetch(urlq, req_params);
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

  async put(url, data, headers) {
    let response;

    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }

    headers = this._addBasicAuthentication(headers);

    try {
      let response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: headers,
      });
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

  async delete(url, data, headers) {
    let response;
    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }
    headers = this._addBasicAuthentication(headers);
    try {
      let response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify(data),
        headers: headers,
      });
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

  async post(url, data, headers) {
    let response;
    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }
    headers = this._addBasicAuthentication(headers);
    try {
      response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers,
      });
      //cache.put(event.request, response.clone());
      if (this._redirect_in_unauthorized && response.status == 401) {
        window.location.href = this._redirect_in_unauthorized;
      }

      return response;
    } catch (err) {
      console.log(err);
      //const response = await cache.match(event.request);
      if (response) return response;
      throw err;
    }
  }
  async get(url, query, headers) {
    let response;
    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }
    headers = this._addBasicAuthentication(headers);
    try {
      let searchURL = new URLSearchParams(query);
      let urlq = url + "?" + searchURL.toString();
      response = await fetch(urlq, {
        method: "GET",
        headers: headers,
      });
      if (this._redirect_in_unauthorized && response.status == 401) {
        window.location.href = this._redirect_in_unauthorized;
      }
      return response;
    } catch (err) {
      if (response) return response;
      throw err;
    }
  }
};

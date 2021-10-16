"use strict";
const fetch = process.browser ? window.fetch : require("node-fetch").default;

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

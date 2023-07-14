export class Api {
  constructor(options) {
    // constructor body
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  getUserInformation() {
    return this._request(this._baseUrl + "/users/me", {
      headers: this._headers,
    });
  }
  setUserInformation(name, about) {
    return this._request(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    });
  }

  getInitialCards() {
    return this._request(this._baseUrl + "/cards", {
      headers: this._headers,
    });
  }
  addCard(name, link) {
    return this._request(this._baseUrl + "/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    });
  }

  deleteCard(cardId) {
    return this._request(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked)
      return this._request(this._baseUrl + "/cards/likes/" + cardId, {
        method: "PUT",
        headers: this._headers,
      });
    else
      return this._request(this._baseUrl + "/cards/likes/" + cardId, {
        method: "DELETE",
        headers: this._headers,
      });
  }
  setUserAvatar(avatar) {
    return this._request(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    });
  }
  _request(url, options) {
    return fetch(url, options).then(this._checkResponse);
  }
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(res.status);
  }
}

const api = new Api({
  baseUrl: "https://aprac-demo.crabdance.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

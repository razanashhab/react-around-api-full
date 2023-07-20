export class Auth {
    constructor(options) {
        // constructor body
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    register(email, password) {
        return this._request(this._baseUrl + "/signup", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                email,
                password,
            }),
        });
    }

    authorized(email, password) {
        return this._request(this._baseUrl + "/signin", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                email,
                password,
            }),
        });
    }

    checkToken(token) {
        const header = {...this._headers, authorization: `Bearer ${token}` };
        return this._request(this._baseUrl + "/users/me", {
            method: "GET",
            headers: header,
        });
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse);
    }
    _checkResponse(res) {
        debugger;
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(res.status);
    }
}

const auth = new Auth({
    baseUrl: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
});

export default auth;
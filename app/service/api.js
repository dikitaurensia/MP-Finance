const {
  ACCESS_TOKEN,
  TOKEN_FCM,
  MODE_LOGIN,
  NAME_LOGIN,
} = require("../helper/constanta");

export const request = (options) => {
  const headers = new Headers({ "Content-Type": "application/json" });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    );
  }

  const defaults = {
    headers,
  };

  options = Object.assign({}, defaults, options);

  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          if (response.status == 401) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(MODE_LOGIN);
            localStorage.removeItem(NAME_LOGIN);
            localStorage.removeItem("notifState");
            localStorage.removeItem("notif");

            // Ideally use React Router, but fallback here:
            window.location.href = "/";
            // return Promise.reject(json);
          }
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      console.error("Error:", error);
      // You can handle the error further or rethrow it if needed
      throw error;
    });
};

export const requestFCM = (options) => {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Authorization", `key=${TOKEN_FCM}`);

  const defaults = {
    headers,
  };

  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export const requestAccurate = (options) => {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Access-Control-Allow-Origin", `*`);
  headers.append("Authorization", `Bearer ${options.token}`);
  headers.append("X-Session-ID", `${options.session}`);

  const defaults = {
    headers,
  };

  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export const requestAccurate2 = (options) => {
  const headers = new Headers({ "Content-Type": "application/json" });

  // Add authorization and session headers
  headers.append("Authorization", `Bearer ${options.token}`);
  headers.append("X-Session-ID", `${options.session}`);

  const defaults = {
    headers,
  };

  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

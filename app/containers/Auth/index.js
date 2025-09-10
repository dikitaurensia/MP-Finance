import React, { useState } from "react";
import "al-styles/auth.scss";
import image from "../../assets/img/image-depan.png";
import mp from "../../assets/img/mp2.png";

import TextField from "@material-ui/core/TextField";
import { login } from "../../service/endPoint";
import { ErrorMessage } from "../../helper/publicFunction";
import { ACCESS_TOKEN, MODE_LOGIN, NAME_LOGIN } from "../../helper/constanta";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login(form);

      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem(MODE_LOGIN, data.mode);
      localStorage.setItem(NAME_LOGIN, data.name);

      history.push("/app");
    } catch (error) {
      ErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-content">
        <div className="container-auth">
          <div className="content-login form-login">
            <div className="logo-login">
              <img src={mp} alt="Mitran Pack Logo" style={{ height: 100 }} />
            </div>
            <form autoComplete="on" onSubmit={handleSubmit}>
              {/* <h2 className="title-login">Welcome Back 👋</h2> */}
              <TextField
                label="Username"
                name="username"
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                value={form.username}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                size="small"
                variant="outlined"
                value={form.password}
                onChange={handleChange}
              />
              <div className="footer-form">
                {/* <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Remember me"
                /> */}
                <button type="submit" className="btn-auth" disabled={loading}>
                  Login
                  {loading && (
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="content-login side-content">
            <img src={image} alt="courier" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

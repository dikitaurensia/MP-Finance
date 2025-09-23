import React, { useState } from "react";
import "../../assets/login-asymmetric.scss"; // Import the new styles
import image from "../../assets/img/image-depan.png";
import mp from "../../assets/img/mp2.png";
import { login } from "../../service/endPoint";
import { ACCESS_TOKEN, MODE_LOGIN, NAME_LOGIN } from "../../helper/constanta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for handling errors
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const { data } = await login(form);
      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem(MODE_LOGIN, data.mode);
      localStorage.setItem(NAME_LOGIN, data.name);
      history.push("/app");
    } catch (err) {
      if (err.error) {
        setError(err.error);
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Image Side */}
        <div className="login-image-side">
          <img src={image} alt="Courier" />
        </div>

        {/* Form Side */}
        <div className="login-form-side">
          <div className="login-header">
            <img src={mp} alt="Mitran Pack Logo" className="login-logo" />
            <h2>Hi, Finance 👋</h2>
            <p>Pastikan akun kamu telah terdaftar pada bagian administrasi!</p>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="login-input"
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <input
                className="login-input"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              Login
              {loading && (
                <FontAwesomeIcon icon={faSpinner} className="fa-spin spinner" />
              )}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

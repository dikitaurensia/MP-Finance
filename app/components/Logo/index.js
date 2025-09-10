import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/mp2.png";
class Logo extends React.Component {
  render() {
    return (
      <Link to="/app" className="logo">
        <section>
          <img src={logo} alt="logo mitran" />
        </section>
      </Link>
    );
  }
}

export default Logo;

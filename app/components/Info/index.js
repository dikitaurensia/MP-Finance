import React from "react";
import { ACCESS_TOKEN, MODE_LOGIN, NAME_LOGIN } from "../../helper/constanta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Info = () => {
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(MODE_LOGIN);
    localStorage.removeItem(NAME_LOGIN);
    localStorage.removeItem("notifState");
    localStorage.removeItem("notif");

    // Ideally use React Router, but fallback here:
    window.location.href = "/";
  };

  return (
    <div className="avatar-user btn logout" onClick={handleLogout}>
      <span>Logout</span>
      <FontAwesomeIcon icon={faSignOutAlt} className="icon-logout" />
    </div>
  );
};

export default Info;

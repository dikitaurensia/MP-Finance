import React from "react";
import Info from "../Info";
import Logo from "../Logo";
import "al-styles/components/header.scss";

const Header = () => {
  return (
    <header className="kanban__header">
      <Logo />
      <div className="kanban__header-info">
        <Info />
      </div>
    </header>
  );
};

export default Header;

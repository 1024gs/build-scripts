import React from "../../../vendors/react/react.js";

const Navbar = ({ brand }: propTypes) => {
  return (
    <nav className="navbar navbar-light" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <span className="navbar-brand">{brand}</span>
      </div>
    </nav>
  );
};

interface propTypes {
  brand: string;
}

export default Navbar;

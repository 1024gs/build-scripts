import React from "../../../vendors/react/react";

const Navbar = ({ brand }: propTypes) => {
  return (
    <nav className="navbar navbar-light" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <span className="navbar-brand">{brand}</span>

        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown button
          </button>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">
              Action
            </a>
            <a className="dropdown-item" href="#">
              Another action
            </a>
            <a className="dropdown-item" href="#">
              Something else here
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface propTypes {
  brand: string;
}

export default Navbar;

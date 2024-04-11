import React from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/images/yi_logo.png";

// My css
import css from "../../css/admin/navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    navigate("/admin/login");
  };

  const handleLogoutClick = (e) => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
  function handleImgClick(){
    navigate("/");
  }

  const listItemStyle = { fontSize: "0.9rem", fontWeight: "400" };

  return (
    <nav className={`${css.outerNav} navbar navbar-expand-lg fixed-top`}>
      <img src={img} alt="yi-logo" className={css.yiImg} onClick={handleImgClick} />
      <button
        type="button"
        className="navbar-toggler"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav mr-auto text-ff1">
          <li className="nav-item active">
            <Link
              className="nav-link active"
              to="/admin/services"
              style={listItemStyle}
            >
              Services
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto">
          {localStorage.getItem("token") ? (
            <button
              className={`${css.navBtn} text-ff1 navbar-right`}
              onClick={handleLogoutClick}
            >
              Logout
            </button>
          ) : (
            <button
              className={`${css.navBtn} text-ff1 navbar-right`}
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

import "./sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/home" className="sidebar__items">
        <i className="fa fa-home fa-fw" aria-hidden="true" />
        <span className="title">Home</span>
      </Link>
      <Link to="/profile" className="sidebar__items">
        <i className="fa fa-user fa-fw" aria-hidden="true" />
        <span className="title">Profile</span>
      </Link>
      <Link to="/following" className="sidebar__items">
        <i className="fas fa-user-friends fa-fw" aria-hidden="true" />
        <span className="title">Following</span>
      </Link>
      <Link to="/liked-tweets" className="sidebar__items">
        <i className="fas fa-thumbs-up fa-fw" aria-hidden="true" />
        <span className="title">Liked Tweets</span>
      </Link>
      <Link to="/search" className="sidebar__items">
        <i className="fa fa-search fa-fw" aria-hidden="true" />
        <span className="title">Search</span>
      </Link>
      <a
        href="https://github.com/Aniket2107/twitter-clone"
        target="_blank"
        rel="noreferrer"
        className="sidebar__items"
      >
        <i className="fab fa-github fa-fw" aria-hidden="true" />
        <span className="title">Repo Link</span>
      </a>

      {/* <a className="sidebar__items sidebar_logout" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt fa-fw"></i>
        <span className="title">Logout</span>
      </a> */}
    </div>
  );
}

export default Sidebar;

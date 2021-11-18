import { Link } from "react-router-dom";

import "./sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link
        to="/home"
        className={`sidebar__items ${
          window.location.pathname === "/home" ? "sidebar__active" : ""
        }`}
      >
        <i className="fa fa-home fa-fw" aria-hidden="true" />
        <span className="title">Home</span>
      </Link>
      <Link
        to="/profile"
        className={`sidebar__items ${
          window.location.pathname === "/profile" ? "sidebar__active" : ""
        }`}
      >
        <i className="fa fa-user fa-fw" aria-hidden="true" />
        <span className="title">Profile</span>
      </Link>
      <Link
        to="/following"
        className={`sidebar__items ${
          window.location.pathname === "/following" ? "sidebar__active" : ""
        }`}
      >
        <i className="fas fa-user-friends fa-fw" aria-hidden="true" />
        <span className="title">Following</span>
      </Link>
      <Link
        to="/liked-tweets"
        className={`sidebar__items ${
          window.location.pathname === "/liked-tweets" ? "sidebar__active" : ""
        }`}
      >
        <i className="fas fa-thumbs-up fa-fw" aria-hidden="true" />
        <span className="title">Liked Tweets</span>
      </Link>
      <Link
        to="/search"
        className={`sidebar__items ${
          window.location.pathname === "/search" ? "sidebar__active" : ""
        }`}
      >
        <i className="fa fa-search fa-fw" aria-hidden="true" />
        <span className="title">Search</span>
      </Link>
    </div>
  );
};

export default Sidebar;

import { useHistory } from "react-router-dom";

import "./navbar.css";

function Navbar() {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("twitter-token");
    localStorage.removeItem("twitter-user");
    history.push("/");

    window.location.reload();
  };

  return (
    <div className="navbar">
      <div className="container flex">
        <div>
          <img src="/images/social.png" alt="Logo" className="navbar_logo" />
          <h2 className="navbar_header">amigo</h2>
        </div>

        <div className="right__nav">
          {/* <div className="flex nav__searchbox">
            <i className="fa fa-search search_icon"></i>
            <input
              type="text"
              className="nav__search"
              placeholder="Search users.."
            />
          </div> */}
          {/* <span className="navbar_welcome">
            Welcome, {user?.name ? user.name.split(" ")[0] : "User"}
          </span> */}

          <div className="navbar_logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt fa-fw"></i>
            <span className="title">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

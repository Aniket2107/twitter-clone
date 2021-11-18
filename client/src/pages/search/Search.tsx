import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import ALoader from "../../components/Loader";
import "./search.css";

export const ALL_USERS = gql`
  query allUsers {
    allUsers {
      id
      email
      name
      profile {
        bio
        avatar
      }
    }
  }
`;

interface UserType {
  id: string;
  name: string;
  email: string;
  profile: {
    bio: string;
    avatar: string;
  };
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { loading, error, data } = useQuery(ALL_USERS);

  if (loading || error) {
    return (
      <div className="alignHomeLoader">
        <ALoader />
      </div>
    );
  }

  let filteredUsers: Array<UserType> = [];

  if (data.allUsers && searchQuery !== "") {
    filteredUsers = data.allUsers.filter((user: UserType) => {
      return user.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  return (
    <div className="search_screen">
      <h3 className="search_header">Search users</h3>

      <div className="search_container">
        <i className="fa fa-search search_icon"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search_ipnut"
          placeholder="Search users.."
        />
      </div>

      <div className="search_users">
        {filteredUsers.length > 0 &&
          filteredUsers?.map((user) => {
            return (
              <Link
                to={`/user/${user.id}`}
                style={{ textDecoration: "none", color: "#333" }}
              >
                <div className="user_container">
                  {user.profile?.avatar ? (
                    <img
                      src={user.profile.avatar}
                      alt="avatar"
                      className="search_user_avatar"
                    />
                  ) : (
                    <img src="" alt="avatar" />
                  )}

                  <div className="user_container-right">
                    <p>{user.name}</p>
                    {user.profile?.bio && <p>{user.profile.bio}</p>}
                  </div>
                </div>
              </Link>
            );
          })}

        {searchQuery.length !== 0 && filteredUsers.length < 1 && (
          <p style={{ marginLeft: "40%", color: "red" }}>Sorry no user found</p>
        )}
      </div>
    </div>
  );
};

export default Search;

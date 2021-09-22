import React from "react";

import { gql, useQuery } from "@apollo/client";

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      name
    }
  }
`;

interface User {
  name: string;
}

const Users = () => {
  return <div></div>;
};

export default Users;

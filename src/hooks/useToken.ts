import * as React from "react";

import { getItem } from "@utils/storage";

export default function useToken() {
  const [token, setToken] = React.useState("");

  React.useEffect(() => {
    async function getStoredToken() {
      try {
        const token = await getItem("jwt");
        setToken(token);
      } catch (e) {
        console.warn(e);
      }
    }

    getStoredToken();
  }, []);

  return token;
}

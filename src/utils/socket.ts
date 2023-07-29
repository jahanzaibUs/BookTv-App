import { io } from "socket.io-client";

import { BASE_URL } from "@constants/config";

const socket = io(BASE_URL, { autoConnect: false });

// Log all events
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;

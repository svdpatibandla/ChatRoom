// Import the 'io' function from the 'socket.io-client' library
import { io } from "socket.io-client";
import React from "react";

// The URL of the socket.io server
const SOCKET_URL = "http://localhost:5001";

// Create a socket connection using the socket.io client library and the server URL
export const socket = io(SOCKET_URL);

// Create a context for the app
export const AppContext = React.createContext();

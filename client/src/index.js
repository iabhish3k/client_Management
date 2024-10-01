import React from "react";
import ReactDOM from "react-dom/client"; // Update import to react-dom/client
import "./index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

// Create a root
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the App component
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import store from "./Redux/Store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
     <Toaster position="top-right"></Toaster>
    <App />
  </Provider>
);

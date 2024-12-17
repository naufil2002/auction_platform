import { StrictMode } from "react"; // Import StrictMode
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "@/store/store.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Faq from "./pages/Faq.jsx"
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import EnterUsername from "./pages/EnterUsername.jsx";
import Chats from "./pages/Chats.jsx";
import BackendEntry from "../backend/src/BackendEntry.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<div>Page Not Found!</div>}>
      <Route index element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/enterUsername" element={<EnterUsername />} />
      <Route path="/chats" element={<Chats/>} />
      <Route path="faq" element={<Faq/>}/>
      <Route path="backend" element={<BackendEntry/>}/>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

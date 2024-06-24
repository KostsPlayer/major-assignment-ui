import React from "react";
import ReactDOM from "react-dom/client";
import Page404 from "./pages/404/Page404";
import Home from "./pages/Home/Home";
import Product from "./pages/Product/Product";
import About from "./pages/About/About";
import Roles from "./pages/Roles/Roles";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sales from "./pages/Sales/Sales";
import Store from "./pages/Store/Store";
import Menu from "./pages/Menu/Menu";
import ProductId from "./pages/ProductId/ProductId";
import Cart from "./pages/Cart/Cart";
import Order from "./pages/Order/Order";
import History from "./pages/History/History";
import Profile from "./pages/Profile/Profile";
import Address from "./pages/Profile/Address/Address";
import Category from "./pages/Category/Category";
import "./main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/product" element={<Page404 />} />
        <Route path="/about-us" element={<Page404 />} />
        <Route path="/roles/:id" element={<Roles />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu-manajement" element={<Menu />} />
        <Route path="/store" element={<Store />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/product/:id" element={<ProductId />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/address" element={<Address />} />
        <Route path="/category" element={<Category />} />
        <Route path="/shipping-method" element={<Page404 />} />
        <Route path="/payment-method" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

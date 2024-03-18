import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Contact } from "./components/contact";
import { Category } from "./components/category";
import { Login } from "./components/login";
import "./App.css";
import { Cart } from "./components/cart";
import { Profile } from "./components/profile";
import { AdminPage } from "./components/adminPage/adminPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const [cart, setCart] = useState([]);
  const [currentCart, setCurrentCart] = useState([]);
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };
  return (
    <Router>
      <div>
        <Navigation />
        <ToastContainer />

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/" exact>
            <Header />
          </Route>
          <Route path="/services">
            <Services />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/cart">
            <Cart cart={cart} />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/admin">
            <AdminPage />
          </Route>
          <Route path="/category">
            <Category addToCart={addToCart} cart={currentCart} />
          </Route>
        </Switch>
        <Contact />
      </div>
    </Router>
  );
};

export default App;

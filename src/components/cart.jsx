import React, { useEffect, useState } from "react";
import "../assets/css/CartCss.css";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
export const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAmountString, setTotalAmountString] = useState("");
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCartItems);
    setLoading(false);
  }, []);

  const calculateTotalAmount = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  console.log("amount", calculateTotalAmount(cartItems));
  useEffect(() => {
    const newTotalAmount = calculateTotalAmount(cartItems);
    const formattedTotalAmount = newTotalAmount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    setTotalAmountString(formattedTotalAmount);
  }, [cartItems]);

  const handleRemoveProduct = async (productId) => {
    try {
      let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

      const productIndex = cartProducts.findIndex(
        (product) => product.productId === productId
      );

      if (productIndex !== -1) {
        cartProducts.splice(productIndex, 1);

        localStorage.setItem("cart", JSON.stringify(cartProducts));

        toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");

        setCartItems(cartProducts);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    }
  };

  const handleQuantityChange = (productId, action) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity:
                action === "increment" ? item.quantity + 1 : item.quantity - 1,
            }
          : item
      )
    );
  };
  const handleCheckboxChange = (productId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.productId === productId
          ? { ...item, isChecked: !item.isChecked }
          : item
      )
    );
  };

  if (!localStorage.getItem("token")) {
    return (
      <div className="container-cart">
        <div className="cart-notification" style={{ marginTop: "200px" }}>
          <h2 className="cart-title">Thông Báo</h2>
          <p className="notification">
            Quý Khách Vui Lòng Đăng Nhập Để Tiếp Tục
          </p>
          <button className="btn-cart">
            <a href="/">Trở Về</a>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="title-cart ">Giỏ hàng</h2>
      <div className="cart-row justify-content-center">
        <div className="cart-items">
          <ul>
            {cartItems.map((product, index) => (
              <li key={index}>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={product.isChecked}
                    onChange={() => handleCheckboxChange(product.productId)}
                  />
                </div>
                <img src={product.image} alt={product.productName} />
                <div className="product-info">
                  <span>{product.productName}</span>
                  <span>{product.price}</span>
                </div>
                <div className="quantity">
                  <button
                    onClick={() =>
                      handleQuantityChange(product.productId, "decrement")
                    }
                  >
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(product.productId, "increment")
                    }
                  >
                    +
                  </button>
                </div>
                <div className="remove-button">
                  <button
                    onClick={() => handleRemoveProduct(product.productId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="total-amount">Tổng số tiền: {totalAmountString}</div>
    </div>
  );
};

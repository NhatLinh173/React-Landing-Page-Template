import React, { useEffect, useState } from "react";
import "../assets/css/SearchCss.css";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export const Category = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [numberOfDisplayedProducts, setNumberOfDisplayedProducts] = useState(9);
  const [noResults, setNoResults] = useState(false);
  const [currentCart, setCurrentCart] = useState([]);
  useEffect(() => {
    fetchProduct();
  }, [searchKeyword]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("http://localhost:3000/product/");

      let filteredProducts = response.data;
      if (searchKeyword) {
        filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }
      setDisplayedProducts(
        filteredProducts.slice(0, numberOfDisplayedProducts)
      );

      setProducts(filteredProducts);

      if (filteredProducts.length > 0) {
        setDisplayedProducts(
          filteredProducts.slice(0, numberOfDisplayedProducts)
        );
        setNoResults(false);
      } else {
        setDisplayedProducts([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const loadMoreProducts = () => {
    const newNumberOfDisplayedProducts = numberOfDisplayedProducts + 9;
    setNumberOfDisplayedProducts(newNumberOfDisplayedProducts);
    setDisplayedProducts(products.slice(0, newNumberOfDisplayedProducts));
  };
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCurrentCart(JSON.parse(storedCart));
    }
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.", {
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
        return;
      }
      let userId = null;

      if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.id_user;
      }

      if (userId) {
        const isProductInCart = currentCart.some((item) => {
          console.log("item.productId:", item.productId);
          console.log("product._id:", product._id);
          return item.productId === product._id && item.userId === userId;
        });

        if (isProductInCart) {
          toast.error(`${product.name} đã có trong giỏ hàng`);
          return;
        }

        const updatedCart = [
          ...currentCart,
          {
            userId: userId,
            productId: product._id,
            image: product.image,
            productName: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
        setCurrentCart(updatedCart);

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        toast.success(`${product.name} đã được thêm vào giỏ hàng`);
      }
    } catch (error) {
      console.error("Error adding product to cart ");
      toast.error("Có lỗi xảy ra, không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  return (
    <div id="category" className="text-center" style={{ paddingTop: "150px" }}>
      <div className="container">
        <div className="section-title">
          <h2>Danh Sách Sản Phẩm</h2>
          <p></p>
        </div>
        <div className="search-container">
          <input
            type="text"
            id="search-bar"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchKeyword}
            onChange={handleSearchInputChange}
          />
          <button type="submit" id="search-button" onClick={fetchProduct}>
            <i className="fa fa-search"></i>
          </button>
        </div>
        {noResults && (
          <div className="no-results">Không có sản phẩm phù hợp.</div>
        )}

        <div className="row">
          {displayedProducts.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="portfolio-items product-item">
                <img src={product.image} alt="" />
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <div>
                  <button
                    className="addToCard"
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {numberOfDisplayedProducts < products.length && (
          <div className="btn-load-more">
            <button onClick={loadMoreProducts} className="button-load-more">
              Xem Thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

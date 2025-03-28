import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FoodItem = ({ image, name, price, description = "", id, mustTry }) => {
  const { cartItems, addToCart, url, currency } = useContext(StoreContext);
  const [quantity, setQuantity] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const maxLength = 10;

  const toggleReadMore = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
    console.log("Expanded Items:", expandedItems); // Debugging
  };

  const handleQuantityChange = (e) => {
    const newValue = e.target.value;
    if (!isNaN(newValue) && Number(newValue) > 0) {
      setQuantity(newValue);
    }
  };

  const handleBlur = () => {
    if (Number(quantity) < 1) {
      setQuantity(1);
    }
  };

  const handleArrowClick = (direction) => {
    setQuantity((prev) => {
      let newQuantity = Number(prev) || 1;
      if (direction === "up") newQuantity += 1;
      if (direction === "down") newQuantity = Math.max(1, newQuantity - 1);
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (quantity === "") {
      toast.error("⚠️ Enter the quantity of food!", { position: "top-center", autoClose: 3000 });
      return;
    }

    addToCart(id, Number(quantity), "kgs");

    toast.success(`🛒 ${name} is added to cart!`, { position: "top-center", autoClose: 3000 });
  };

  console.log("FoodItem ID:", id); // Debugging
  console.log("FoodItem Description:", description); // Debugging

  return (
    <div className={`food-item ${mustTry ? "must-try" : ""}`}>
      <div className="food-item-img-container">
        <img className="food-item-image" src={`${url}/images/${image}`} alt={name} />

        {mustTry && <span className="must-try-badge">🔥 Must Try</span>}

        <div className="quantity-unit-container">
          <div className="quantity-control">
            <button className="quantity-arrow down-arrow" onClick={() => handleArrowClick("down")}>▼</button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleBlur}
              placeholder="1"
              className="quantity-input"
            />
            <button className="quantity-arrow up-arrow" onClick={() => handleArrowClick("up")}>▲</button>
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <div className="food-item-info">
        <h3 className="food-item-name">{name}</h3>

        <p className="food-item-desc">
          <span className={`desc-text ${expandedItems[id] ? "expanded" : ""}`}>
            {expandedItems[id] ? description : description.slice(0, maxLength)}
          </span>
          {description.length > maxLength && (
            <span className="read-more" onClick={() => toggleReadMore(id)}>
              {expandedItems[id] ? " Read Less" : " Read More"}
            </span>
          )}
        </p>

        <p className="food-item-price">{currency} {price}</p>
        <p>Price per Kg</p>
      </div>
    </div>
  );
};

export default FoodItem;
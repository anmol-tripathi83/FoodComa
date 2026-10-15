import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Craving something delicious?</h2>
        <p>
          Explore a curated menu of mouth-watering dishes made from the freshest 
          ingredients. Whether you need a quick bite or a gourmet feast, we bring 
          the best local flavors right to your doorstep.
        </p>
        <button>Explore Menu</button>
      </div>
    </div>
  );
};

export default Header;

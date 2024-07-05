import React from "react";
import "./RiceCard.css";

function RiceCard({ rice, key }) {
  return (
    <div className="rice-card" key={key}>
      <h1>{rice.name}</h1>
      <div className="allDetailsContainer">
        <div className="detailContainer">
          <p className="detailTitle">Price</p>
          <p className="detailValue">{rice.price}</p>
        </div>
        <div className="detailContainer">
          <p className="detailTitle">Minimum Price</p>
          <p className="detailValue">{rice.minimumPrice}</p>
        </div>
        <div className="detailContainer">
          <p className="detailTitle">Weight</p>
          <p className="detailValue">{rice.weight}</p>
        </div>
      </div>
    </div>
  );
}

export default RiceCard;

import "./RiceCard.css";
import { useState } from "react";
import AddSaleModal from "../AddSaleModal";

interface Rice {
  id: number;
  name: string;
  price: number;
  loosePrice: number;
  quantity: number;
}

function RiceCard({ rice, unit }: { rice: Rice; unit: string }) {
  const [cardClicked, setCardClicked] = useState(false);

  return (
    <div className="rice-card" key={rice.id}>
      <AddSaleModal
        open={cardClicked}
        setOpen={setCardClicked}
        rice={rice}
        unit={unit}
      />
      <h1>{rice.name}</h1>
      <div className="allDetailsContainer">
        <div className="detailContainer">
          <p className="detailTitle">Price</p>
          <p className="detailValue">
            {unit === "Bags" ? rice.price : rice.loosePrice}
          </p>
        </div>
        {/* <div className="detailContainer">
          <p className="detailTitle">Loose Price</p>
          <p className="detailValue">{rice.loosePrice}</p>
        </div> */}
      </div>
      <button
        className="addButton"
        onClick={() => setCardClicked(!cardClicked)}
      >
        Add
      </button>
    </div>
  );
}

export default RiceCard;

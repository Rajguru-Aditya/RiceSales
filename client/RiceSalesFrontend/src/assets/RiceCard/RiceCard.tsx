import "./RiceCard.css";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface Rice {
  id: number;
  name: string;
  price: number;
  loosePrice: number;
  quantity: number;
}

function RiceCard({ rice, unit }: { rice: Rice; unit: string }) {
  const [cardClicked, setCardClicked] = useState(false);
  const [count, setCount] = useState(1);

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const onClickPlus = () => {
    setCount(count + 1);
  };

  const onClickMinus = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const addSalesAPI = async () => {
    // API call to add sales
    const response = await axios.post("http://localhost:5555/api/sales", {
      product: rice.name,
      quantity: count,
      unitType: unit === "Bags" ? "bag" : "kg",
      date: getCurrentDateFormatted(),
    });

    console.log("API Response: ", response);
    if (response.status === 200 || response.status === 201) {
      toast.success("Sales added successfully");
    } else {
      toast.error("Failed to add sales");
    }
  };

  const onClickSubmit = () => {
    console.log("Submitted: ", rice.name, count, getCurrentDateFormatted());
    addSalesAPI();
  };

  return (
    <div className="rice-card" key={rice.id}>
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
      {cardClicked && (
        <div className="moreOptionsContainer">
          <div className="optionsButtonContainer">
            <button className="countButton" onClick={onClickMinus}>
              -
            </button>
            <p className="count">{count}</p>
            <button className="countButton" onClick={onClickPlus}>
              +
            </button>
          </div>
          <div>
            <button className="submitButton" onClick={onClickSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiceCard;

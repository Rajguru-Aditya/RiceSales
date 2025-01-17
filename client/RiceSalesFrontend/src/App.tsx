import { Toaster } from "react-hot-toast";
import "./App.css";
import RiceCard from "./assets/RiceCard/RiceCard";
import RiceData from "./assets/RiceData";
import { useEffect, useState } from "react";
import SalesModal from "./assets/SalesModal";
import axios from "axios";

function App() {
  interface RiceType {
    id: number;
    name: string;
    price: number;
    loosePrice: number;
    quantity: number;
  }

  const [optionBtnClicked, setOptionBtnClicked] = useState("Bags");
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const apiDomain = "https://rice-sales-backend.vercel.app";
  // const apiDomain = "http://localhost:5555";

  const getAllSales = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/sales/all-dates`);
      const data = response.data;
      setSalesData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllSales();
  }, [salesModalOpen]);

  return (
    <div className="main">
      <Toaster position="top-center" reverseOrder={false} />
      <SalesModal
        open={salesModalOpen}
        setOpen={setSalesModalOpen}
        salesData={salesData}
      />
      <div className="navbar">
        <button
          className={
            optionBtnClicked === "Bags"
              ? "salesButton selectedNavBtn"
              : "salesButton"
          }
          onClick={() => setOptionBtnClicked("Bags")}
        >
          Bags
        </button>
        <button
          className={
            optionBtnClicked === "Loose"
              ? "salesButton selectedNavBtn"
              : "salesButton"
          }
          onClick={() => setOptionBtnClicked("Loose")}
        >
          Loose
        </button>
        <button className="salesButton" onClick={() => setSalesModalOpen(true)}>
          Check Sales
        </button>
      </div>
      <div className="cardsContainer">
        {RiceData.map((rice: RiceType) => {
          // dont render card for Bags option type if Rice name is Abida or Captain
          if (
            optionBtnClicked === "Bags" &&
            (rice.name === "Abida" || rice.name === "Captain")
          ) {
            return null;
          } else {
            return (
              <RiceCard rice={rice} unit={optionBtnClicked} key={rice.id} />
            );
          }
        })}
      </div>
    </div>
  );
}

export default App;

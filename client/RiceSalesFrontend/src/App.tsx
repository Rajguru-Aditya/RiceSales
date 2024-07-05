import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RiceCard from "./assets/RiceCard/RiceCard";
import RiceData from "./assets/RiceData";

function App() {
  return (
    <div className="cardsContainer">
      {RiceData.map((rice) => {
        return <RiceCard key={rice.id} rice={rice} />;
      })}
    </div>
  );
}

export default App;

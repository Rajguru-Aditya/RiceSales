/* eslint-disable @typescript-eslint/prefer-as-const */
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import toast from "react-hot-toast";
import axios from "axios";
import "./RiceCard/RiceCard.css";
import { TailSpin } from "react-loader-spinner";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

interface Rice {
  id: number;
  name: string;
  price: number;
  loosePrice: number;
  quantity: number;
}

export default function AddSaleModal({
  open,
  setOpen,
  rice,
  unit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rice: Rice;
  unit: string;
}) {
  const handleClose = () => setOpen(false);

  const [count, setCount] = useState(1);
  const [type, setType] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const apiDomain = "https://rice-sales-backend.vercel.app";
  // const apiDomain = "http://localhost:5555";

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
    const response = await axios.post(`${apiDomain}/api/sales`, {
      product: rice.name,
      quantity: count,
      unitType: unit === "Bags" ? "bag" : "kg",
      date: getCurrentDateFormatted(),
      paymentType: type === "Cash" ? "cash" : "online",
    });

    console.log("API Response: ", response);
    if (response.status === 200 || response.status === 201) {
      toast.success("Sales added successfully");
      setLoading(false);
      handleClose();
    } else {
      toast.error("Failed to add sales");
      setLoading(false);
    }
  };

  const onClickSubmit = () => {
    console.log("Submitted: ", rice.name, count, getCurrentDateFormatted());
    setLoading(true);
    addSalesAPI();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: "80%", maxHeight: "80%", overflowY: "auto" }}>
        <Typography id="modal-modal-title" variant="h3" component="h2">
          {rice.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
            <div className="optionsButtonContainer">
              <button
                className={
                  type === "Cash" ? "typeButton selectedBtn" : "typeButton"
                }
                onClick={() => {
                  setType("Cash");
                }}
              >
                Cash
              </button>
              <button
                className={
                  type === "Online" ? "typeButton selectedBtn" : "typeButton"
                }
                onClick={() => {
                  setType("Online");
                }}
              >
                Online
              </button>
            </div>
            <div
              style={{
                width: "100%",
              }}
            >
              <button
                className="submitButton"
                disabled={loading}
                onClick={onClickSubmit}
              >
                {loading ? (
                  <TailSpin
                    visible={true}
                    height="40"
                    width="40"
                    color="#000"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </Typography>
      </Box>
    </Modal>
  );
}

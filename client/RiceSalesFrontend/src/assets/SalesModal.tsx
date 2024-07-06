/* eslint-disable @typescript-eslint/prefer-as-const */
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
};

export default function BasicModal({
  open,
  setOpen,
  salesData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  salesData: {
    date: string;
    product: string;
    totalQuantity: number;
    totalPrice: number;
  }[];
}) {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, width: "80%", maxHeight: "80%", overflowY: "auto" }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Sales Summary
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {salesData.length > 0 ? (
            salesData.map((sale, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <Typography variant="body1">
                  <strong>Date:</strong> {sale.date}
                </Typography>
                <Typography variant="body1">
                  <strong>Product:</strong> {sale.product}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Quantity:</strong> {sale.totalQuantity}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Price:</strong> ₹{sale.totalPrice}
                </Typography>
                <hr />
              </div>
            ))
          ) : (
            <Typography>No sales data available.</Typography>
          )}
        </Typography>
      </Box>
    </Modal>
  );
}

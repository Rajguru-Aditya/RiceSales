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
    totalQuantity: number;
    totalPrice: number;
    totalCash: number;
    totalOnline: number;
    products: {
      product: string;
      paymentDetails: {
        paymentType: string;
        totalQuantity: number;
        totalPrice: number;
      }[];
    }[];
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
        {salesData.length > 0 ? (
          salesData.map((dateData, index) => (
            <Box key={index} sx={{ mt: 2 }}>
              <Typography variant="h6">
                Date: {new Date(dateData.date).toLocaleDateString()}
              </Typography>
              <Box sx={{ ml: 2 }}>
                {dateData.products.map((productData, productIndex) => (
                  <Box key={productIndex} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Product:</strong> {productData.product}
                    </Typography>
                    <Box sx={{ ml: 2 }}>
                      {productData.paymentDetails.map(
                        (payment, paymentIndex) => (
                          <Box key={paymentIndex}>
                            <Typography variant="body2">
                              <strong>Payment Type:</strong>{" "}
                              {payment.paymentType}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Total Quantity:</strong>{" "}
                              {payment.totalQuantity}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Total Price:</strong> ₹
                              {payment.totalPrice}
                            </Typography>
                          </Box>
                        )
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Typography variant="body1">
                <strong>
                  Total Quantity for{" "}
                  {new Date(dateData.date).toLocaleDateString()}:
                </strong>{" "}
                {dateData.totalQuantity}
              </Typography>
              <Typography variant="body1">
                <strong>
                  Total Price for {new Date(dateData.date).toLocaleDateString()}
                  :
                </strong>{" "}
                ₹{dateData.totalPrice}
              </Typography>
              <Typography variant="body1">
                <strong>
                  Total Cash for {new Date(dateData.date).toLocaleDateString()}:
                </strong>{" "}
                ₹{dateData.totalCash}
              </Typography>
              <Typography variant="body1">
                <strong>
                  Total Online for{" "}
                  {new Date(dateData.date).toLocaleDateString()}:
                </strong>{" "}
                ₹{dateData.totalOnline}
              </Typography>
              <hr />
            </Box>
          ))
        ) : (
          <Typography>No sales data available.</Typography>
        )}
      </Box>
    </Modal>
  );
}

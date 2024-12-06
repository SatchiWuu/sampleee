import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Review() {
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data from localStorage
    const storedAddress = JSON.parse(localStorage.getItem("shippingaddress")) || {};
    const storedPaymentInfo = JSON.parse(localStorage.getItem("paymentInfo")) || {};
    const storedProducts = JSON.parse(localStorage.getItem("cart")) || [];
    setShippingAddress(storedAddress);
    setPaymentInfo(storedPaymentInfo);
    setProducts(storedProducts);
  }, []);

  return (
    <Stack spacing={2}>
      <List disablePadding>
        {products.map((product, index) => (
          <ListItem key={index} sx={{ py: 1, px: 0 }}>
            <ListItemText
              primary={product.productId.title || "Unnamed Product"}
              secondary={`Qty: ${product.quantity || 1}`}
            />
            <Typography variant="body2">
              {product.productId.price ? `$${(product.productId.price * product.quantity).toFixed(2)}` : "N/A"}
            </Typography>
          </ListItem>
        ))}
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">$9.99</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {`$${(
              products.reduce((acc, product) => acc + product.productId.price * product.quantity, 9.99)
            ).toFixed(2)}`}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>{shippingAddress.address || "No address provided"}</Typography>
          <Typography gutterBottom sx={{ color: "text.secondary" }}>
            {[
              shippingAddress.city,
              shippingAddress.region,
              shippingAddress.zip,
              shippingAddress.country,
            ]
              .filter(Boolean)
              .join(", ")}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ width: "100%", mb: 1 }}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Card Number:
              </Typography>
              <Typography variant="body2">
                {paymentInfo.cardNumber ? `**** **** **** ${paymentInfo.cardNumber.slice(-4)}` : "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ width: "100%", mb: 1 }}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                CVV:
              </Typography>
              <Typography variant="body2">
                {paymentInfo.cvv || "N/A"}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ width: "100%", mb: 1 }}
            >
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Expiration Date:
              </Typography>
              <Typography variant="body2">
                {paymentInfo.expirationDate || "N/A"}
              </Typography>
            </Stack>
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}

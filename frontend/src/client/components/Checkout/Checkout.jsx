import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "./AddressForm";
import Info from "./Info";
import InfoMobile from "./InfoMobile";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { useNavigate } from "react-router-dom";
import SitemarkIcon from "./SitemarkIcon";
import axios from "axios";

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    // Retrieve cart and shipping info on mount
    const retrieve = async () => {
      try {
        // Fetch user data and cart
        const res = await axios.get("http://localhost:8000/api/user");
        const cartData = res.data.data[0]?.cart || [];
        setCart(cartData);

        // Calculate total price
        const total = cartData.reduce(
          (acc, item) => acc + item.quantity * item.productId?.price,
          0
        );
        setTotalPrice(total);

        // Load shipping address from local storage
      } catch (e) {
        console.error("Error fetching cart or shipping data:", e);
      }
    };

    retrieve();
  }, []);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Final step: Place the order
      try {
        // Retrieve shipping information from localStorage
        const ship = JSON.parse(localStorage.getItem("shippingaddress")) || {};

        // Construct order items from the cart
        const orderItems = cart.map((item) => ({
          name: item.productId?.title || "Unknown Product",
          quantity: item.quantity || 0,
          price: item.productId?.price || 0,
        }));

        await axios.post("http://localhost:8000/order/new/order", {
          shippingInfo: {
            address: ship.address || "",
            city: ship.city || "",
            zip: ship.zip || "",
            region: ship.region || "",
            country: ship.country || "",
          },
          orderItems,
          totalPrice,
        });
        setActiveStep((prevStep) => prevStep + 1);
        console.log("Order placed successfully!");
      } catch (e) {
        console.error("Error placing order:", e);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1); // Move to the next step
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}></Box>

      <Grid
        container
        sx={{
          height: {
            xs: "100%",
            sm: "calc(100dvh - var(--template-frame-height, 0px))",
          },
          mt: { xs: 4, sm: 0 },
        }}
      >
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { md: "1px solid" },
            borderColor: "divider",
            alignItems: "start",
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info totalPrice={totalPrice} products={cart} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ display: { sm: "flex", md: "none" } }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: 600 } }}>
            {activeStep === steps.length ? (
              <Stack spacing={2}>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Your order number is <strong>#140396</strong>. We have emailed
                  your order confirmation and will update you once it's shipped.
                </Typography>
                <Button variant="contained" onClick={() => {navigate('/')}}>
                  Go Back
                </Button>
              </Stack>
            ) : (
              <>
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      activeStep === 0 ? "flex-end" : "space-between",
                    mt: 2,
                  }}
                >
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} variant="outlined">
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    endIcon={
                      activeStep === steps.length - 1 ? null : (
                        <ChevronRightRoundedIcon />
                      )
                    }
                  >
                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

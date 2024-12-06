import React from "react";

import {
  Alert,
  Box,
  Card as MuiCard,
  CardActionArea,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  OutlinedInput,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import {
  AccountBalanceRounded as AccountBalanceRoundedIcon,
  CreditCardRounded as CreditCardRoundedIcon,
  SimCardRounded as SimCardRoundedIcon,
  WarningRounded as WarningRoundedIcon,
} from "@mui/icons-material";

const Card = styled(MuiCard)(({ theme, selected }) => ({
  border: "1px solid",
  borderColor: selected
    ? (theme.vars || theme).palette.primary.light
    : (theme.vars || theme).palette.divider,
  width: "100%",
  "&:hover": {
    background:
      "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
    borderColor: (theme.vars || theme).palette.primary.light,
    boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
  },
  ...(theme.applyStyles &&
    theme.applyStyles("dark", {
      background:
        "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
      borderColor: (theme.vars || theme).palette.primary.dark,
      boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5)",
    })),
}));

const PaymentContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: 375,
  padding: theme.spacing(3),
  borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  background:
    "linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)",
  boxShadow: "0px 4px 8px hsla(210, 0%, 0%, 0.05)",
  ...(theme.applyStyles &&
    theme.applyStyles("dark", {
      background:
        "linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)",
      boxShadow: "0px 4px 8px hsl(220, 35%, 0%)",
    })),
}));

const FormGrid = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function PaymentForm() {
  const [paymentType, setPaymentType] = React.useState("creditCard");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [expirationDate, setExpirationDate] = React.useState("");

  const setData = async () => {
    const paymentInfo = { cardNumber, cvv, expirationDate };
    localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
  };

  React.useEffect(() => {
    setData();
  }, [cardNumber, cvv, expirationDate]);

  const handlePaymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  };

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <RadioGroup
          value={paymentType}
          onChange={handlePaymentTypeChange}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Card selected={paymentType === "creditCard"}>
            <CardActionArea onClick={() => setPaymentType("creditCard")}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CreditCardRoundedIcon
                  fontSize="small"
                  sx={{
                    color:
                      paymentType === "creditCard"
                        ? "primary.main"
                        : "grey.400",
                  }}
                />
                <Typography sx={{ fontWeight: "medium" }}>
                  Credit Card
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </RadioGroup>
      </FormControl>

      {paymentType === "creditCard" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <PaymentContainer>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2">Credit Card</Typography>
              <CreditCardRoundedIcon sx={{ color: "text.secondary" }} />
            </Box>
            <SimCardRoundedIcon
              sx={{
                fontSize: { xs: 48, sm: 56 },
                transform: "rotate(90deg)",
                color: "text.secondary",
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <FormGrid>
                <FormLabel>Card Number</FormLabel>
                <OutlinedInput
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                  }}
                  placeholder="0000 0000 0000 0000"
                />
              </FormGrid>
              <FormGrid>
                <FormLabel>CVV</FormLabel>
                <OutlinedInput
                  value={cvv}
                  onChange={(e) => {
                    setCvv(e.target.value);
                  }}
                  placeholder="123"
                />
              </FormGrid>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormGrid>
                <FormLabel>Expiration Date</FormLabel>
                <OutlinedInput
                  value={expirationDate}
                  onChange={(e) => {
                    setExpirationDate(e.target.value);
                  }}
                  placeholder="MM/YY"
                />
              </FormGrid>
            </Box>
          </PaymentContainer>
        </Box>
      )}
    </Stack>
  );
}

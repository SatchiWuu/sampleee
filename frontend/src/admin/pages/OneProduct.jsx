import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Snackbar,
  Alert,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getUser } from "../../utils/helper";

export default function ProductDetails() {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null); // State to hold product data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // State for errors
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [quantity, setQuantity] = useState(1); // Default quantity is 1
  const [email, setEmail] = useState("");

  // Fetch product details based on the ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/api/product/${id}`
        );
        setProduct(response.data.data); // Store product data in state
        console.log(response.data.data);
      } catch (error) {
        setError("Error fetching product data" + error);
      } finally {
        setIsLoading(false);
      }
    };

    setEmail(getUser().email);
    // setEmail(getUser())
    fetchProduct();
  }, [id]);

  // Function to handle quantity change
  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // Function to add the product to the cart
  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      const formData = {
        productId: id,
        stockId: 5,
        quantity: quantity,
      };
      const response = await axios.post(
        `http://localhost:8000/api/user/addToCart/${email}`,
        formData
      );
      console.log(response);
      setSuccessMessage("Product added to cart successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setError("Error adding product to cart");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading, product details, or error messages
  if (isLoading) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <CircularProgress />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 3, textAlign: "center" }}
      >
        {error}
      </Typography>
    );
  }

  if (!product) {
    return (
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mt: 3, textAlign: "center" }}
      >
        No product found
      </Typography>
    );
  }

  return (
    <Stack spacing={3} sx={{ padding: 4, maxWidth: 600, margin: "auto" }}>
      <Paper elevation={6} sx={{ padding: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {product.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
          ${product.price}
        </Typography>

        {/* Quantity counter */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <IconButton
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1}
            sx={{
              bgcolor: "secondary.light",
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            <RemoveIcon />
          </IconButton>
          <TextField
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, e.target.value))}
            variant="outlined"
            type="number"
            inputProps={{ min: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">items</InputAdornment>
              ),
            }}
            sx={{ width: "100px", textAlign: "center" }}
          />
          <IconButton
            onClick={handleIncreaseQuantity}
            sx={{
              bgcolor: "secondary.light",
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={isLoading || quantity < 1}
          sx={{ textTransform: "none", fontSize: "16px" }}
        >
          {isLoading ? "Adding to Cart..." : "Add to Cart"}
        </Button>
      </Paper>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

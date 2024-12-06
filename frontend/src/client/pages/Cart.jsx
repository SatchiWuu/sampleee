import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Stack, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  // Retrieve the cart data
  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/user'); // Adjust URL if necessary
      const cartData = res.data.data[0].cart;
      setCart(cartData);

      // Calculate total price
      const total = cartData.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);
      setTotalPrice(total);
    } catch (e) {
      console.error('Error fetching cart data', e);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  // Handle remove from cart (you can modify this to call an API to remove the item)
  const handleRemove = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const handleCheckout = async () => {
    navigate("/checkout");
  };

  return (
    <Stack spacing={2} sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Divider />

      {cart.length === 0 ? (
        <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
      ) : (
        <Grid container spacing={2}>
          {cart.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Product Image */}
                <CardMedia
                  component="img"
                  height="140"
                  image={item.productId.images.length > 0 ? item.productId.images[0].url : 'https://via.placeholder.com/150'}
                  alt={item.productId.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>{item.productId.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {item.size} | Color: {item.color}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    ${item.productId.price} x {item.quantity}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total: ${item.productId.price * item.quantity}
                  </Typography>
                </CardContent>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {cart.length > 0 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Total: ${totalPrice.toFixed(2)}</Typography>
          <Button onClick={()=> {handleCheckout()}} variant="contained" color="primary">Checkout</Button>
        </Stack>
      )}
    </Stack>
  );
};

export default Cart;

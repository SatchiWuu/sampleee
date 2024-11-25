import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Stack, Grid, Divider, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [checkout, setCheckout] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  // Fetch checkout items from the API
  const retrieve = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:8000/api/user'); // Assuming user is logged in and cart is available
      const cartItems = res.data.data[0].checkout;
      console.log(cartItems)
      setCheckout(cartItems);
      calculateTotalCost(cartItems);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the total cost of the checkout items
  const calculateTotalCost = (cartItems) => {
    let total = 0;
    cartItems.forEach(order => {
      // Ensure that items and productId are properly defined before accessing them
      if (Array.isArray(order.items) && order.items.length > 0) {
        total += order.items.reduce((acc, curr) => {
          const itemPrice = curr.productId?.price || 0; // Check if price exists
          return acc + (itemPrice * curr.quantity);
        }, 0);
      }
    });
    setTotalCost(total);
  };

  useEffect(() => {
    retrieve();
  }, []);

  const handleCheckout = async () => {
    // Proceed to checkout action (This could be the same API you used for checkout)
    // For now, we'll assume that checkout will be processed and the user will be redirected.
    navigate('/order-success');  // Redirect to order success page after checkout
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {checkout.map((order, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Order {index + 1} {order.order.datePlaced}</Typography>

                  {order.order.items ? (
                    order.order.items.map((item, idx) => (
                      <Box key={idx} mb={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <CardMedia
                              component="img"
                              image={item.productId.images ? item.productId.images[0].url : '/placeholder.jpg'}
                              alt={item.productId.title}
                              sx={{ height: 120, objectFit: 'contain' }}
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="h6">{item.productId.title}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              Color: {item.color} | Size: {item.size}
                            </Typography>
                            <Typography variant="body2">
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body1" color="primary" fontWeight="bold">
                              ${item.productId.price * item.quantity}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Divider sx={{ marginY: 2 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="h6" color="textSecondary">
                      No items in this order.
                    </Typography>
                  )}


                  <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6" color="primary">
                      Total: ${order.total_cost}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={4} display="flex" justifyContent="flex-end">
      </Box>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, Button, Grid, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Welcome = () => {
  const [products, setProducts] = useState([]);

  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setProducts(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 3, textAlign: 'center' }}>
        Welcome to Our Product Showcase
      </Typography>

      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://via.placeholder.com/200x140'}
                  alt={product.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    {product.description.length > 100
                      ? `${product.description.slice(0, 100)}...`
                      : product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price}
                  </Typography>
                </CardContent>
                <Box sx={{ padding: 2 }}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="small" color="primary" fullWidth>
                      View Details
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', marginTop: 5 }}>
          No products available.
        </Typography>
      )}
    </Box>
  );
};

export default Welcome;

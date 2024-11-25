import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, CardMedia, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom'

const Welcome = () => {
  const [products, setProducts] = useState([]);

  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setProducts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  return (
    <Stack spacing={2} sx={{ padding: 2, flexWrap: 'wrap', display: 'flex' }}>
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product._id} sx={{ display: 'flex', flexDirection: 'column', maxWidth: 345 }}>
            <CardMedia
              component="img"
              height="140"
              image={product.image || 'https://via.placeholder.com/150'}
              alt={product.title}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {product.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
              <Typography variant="h6" color="primary">
                ${product.price}
              </Typography>
            </CardContent>
            
              <Link to={`/product/${product._id}`}><Button size="small" color="primary" sx={{ margin: 2 }}>VIEW DETAILS</Button></Link>
            
          </Card>
        ))
      ) : (
        <Typography variant="h6" color="text.secondary">
          No products available.
        </Typography>
      )}
    </Stack>
  );
};

export default Welcome;

import * as React from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function Info({ totalPrice }) {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const getItem = async () => {
      const data = await localStorage.getItem("cart"); // Use synchronous getItem
      if (data) {
        try {
          setProducts(JSON.parse(data)); // Parse the JSON string into an array
        } catch (error) {
          console.error("Error parsing cart data from localStorage:", error);
          setProducts([]); // Fallback to an empty array
        }
      }
    };
    getItem();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        ${totalPrice}
      </Typography>
      <List disablePadding>
        {products.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No products in the cart.
          </Typography>
        ) : (
          products.map((product) => (
            <ListItem key={product.name} sx={{ py: 1, px: 0 }}>
              <ListItemText
                sx={{ mr: 2 }}
                primary={product.productId.title}
                secondary={product.productId.description}
              />
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                ${product.productId.price}
              </Typography>
            </ListItem>
          ))
        )}
      </List>
    </React.Fragment>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.number.isRequired, // Ensure type consistency
};

export default Info;

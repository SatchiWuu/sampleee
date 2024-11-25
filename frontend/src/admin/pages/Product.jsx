import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [productData, setProductData] = useState({ title: '', description: '', price: '' });
  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Store selected rows
  
  // Fetch the data from the API
  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setRows(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  // Create a new product
  const createProduct = async () => {
    try {
      const newProduct = { ...productData };
      await axios.post('http://localhost:8000/api/product', newProduct);
      setOpenDialog(false);
      retrieve(); // Refresh the grid
    } catch (e) {
      console.log(e);
    }
  };

  // Update an existing product
  const updateProduct = async () => {
    try {
      const updatedProduct = { ...productData };
      await axios.put(`http://localhost:8000/api/product/${editingProductId}`, updatedProduct);
      setOpenDialog(false);
      retrieve(); // Refresh the grid
    } catch (e) {
      console.log(e);
    }
  };

  // Delete a product
  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/product/${productId}`);
      retrieve(); // Refresh the grid
    } catch (e) {
      console.log(e);
    }
  };

  // Open dialog for creating or editing a product
  const openDialogForEdit = (product) => {
    setProductData({
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
    });
    setEditingProductId(product?._id || null);
    setOpenDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Edit button click
  const handleEditClick = (product) => {
    openDialogForEdit(product);
  };

  // Handle Delete button click
  const handleDeleteClick = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      renderCell: (params) => {
        return `ID-${params.row._id || params.value}`; // Add 'ID-' prefix to the value
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      editable: true,
    },
    {
      field: 'controls',
      headerName: 'Controls',
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEditClick(params.row)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteClick(params.row._id)}
            >
              Delete
            </Button>
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Button variant="contained" onClick={() => openDialogForEdit(null)}>
        Create New Product
      </Button>

      <DataGrid
        fullWidth
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id} // Ensure each row has a unique ID
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
      />

      {/* Dialog for creating/editing product */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingProductId ? 'Edit Product' : 'Create New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            name="title"
            value={productData.title}
            onChange={handleInputChange}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={editingProductId ? updateProduct : createProduct} color="primary">
            {editingProductId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

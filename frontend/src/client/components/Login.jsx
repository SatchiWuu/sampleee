import React from "react";
import { Button, Box, Typography, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../auth/firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticate } from "../../utils/helper";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
    registerWithGoogle(result.user.email, result.user.displayName);
  };

  const registerWithGoogle = async (email, displayName, photoURL) => {
    try {
      const { data } = await axios.post(
        `http://localhost:8000/auth/google/auth`,
        {
          email: email,
          name: displayName,
          avatar: photoURL,
        }
      );
      console.log(data);
      authenticate(data, () => {
        navigate("/");
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "linear-gradient(to bottom, #2196f3, #e3f2fd)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 4,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Roboto, sans-serif",
            fontWeight: 700,
            marginBottom: 2,
            color: "#1976d2",
          }}
        >
          Welcome Back!
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: 3, color: "text.secondary" }}
        >
          Sign in to continue to our platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{
            textTransform: "none",
            fontSize: "16px",
            padding: "10px 20px",
            borderRadius: "25px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#1769aa",
            },
          }}
        >
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;

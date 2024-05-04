"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "../../../config/firebase";
import { Box, Container, TextField, Button, Typography } from "@mui/material";
import styles from "../page.module.css";
import Link from "next/link";

// Define Signup component
export default function Signup() {
  // State variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const router = useRouter();

  // Function to handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      router.push("/dashboard");
      console.log("Signup successful");
    } catch (error) {
      // setError(error);
    }
  };

  // Function to handle closing error dialog
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <Head>
          <title>Signup Page</title>
          <meta name="description" content="Signup Page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Container
          maxWidth="sm"
          sx={{ backgroundColor: "#2bb5f3", padding: "5px" }}
        >
          <Box mt={10}>
            <Typography variant="h4" align="center" gutterBottom>
              Signup
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    color: "grey",
                    bgcolor: "white",
                    border: "1px solid grey",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "darkgrey",
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    color: "grey",
                    bgcolor: "white",
                    border: "1px solid grey",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "darkgrey",
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  sx={{
                    color: "grey",
                    bgcolor: "white",
                    border: "1px solid grey",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "darkgrey",
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  sx={{
                    color: "grey",
                    bgcolor: "white",
                    border: "1px solid grey",
                    borderRadius: "4px",
                    "&:hover": {
                      borderColor: "darkgrey",
                    },
                  }}
                />
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Signup
                </Button>
              </Box>
              <Box mt={2}>
                <Link href="/">
                  <Button variant="outlined" color="primary" fullWidth>
                    Already have an account? Login
                  </Button>
                </Link>
              </Box>
            </form>
          </Box>
        </Container>

        {/* Error dialog */}
        {error && (
          <Box
            mt={2}
            p={2}
            bgcolor="error.main"
            color="error.contrastText"
            borderRadius={4}
          >
            <Typography>{error}</Typography>
            <Button variant="outlined" onClick={handleCloseError}>
              Close
            </Button>
          </Box>
        )}
      </div>
    </main>
  );
}

'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { getAuth, signInWithEmailAndPassword } from "../../config/firebase";
import { Box, Container, TextField, Button, Typography } from '@mui/material';
import styles from "./page.module.css";
// Define FormData interface
interface FormData {
  email: string;
  password: string;
}
import Link from 'next/link';

// Define Login component
export default function Login() {
  // State variables
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
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
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/dashboard");
      console.log("logged in successfully");
    } catch (err) {
      setError("error in log in");
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <main className={styles.main}>
    <div  className={styles.description}>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm"  sx={{ backgroundColor:'#2bb5f3', padding:'5px'}}>
        <Box mt={10}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
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
                  color: 'grey', 
                  bgcolor: 'white', 
                  border: '1px solid grey', 
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: 'darkgrey',
                  },
                }}
              />
            </Box>
            <Box mt={2} sx={{backgroundColor:'red',}}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  color: 'grey',
                  bgcolor: 'white',
                  border: '1px solid grey',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: 'darkgrey',
                  },
                }}
              />
            </Box>
            <Box mt={2}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Login
              </Button>
            </Box>
            <Box mt={2}>
              {/* Link to the signup page */}
              <Link href="/signup">
                <Button variant="outlined" color="primary" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </Box>
          </form>
        </Box>
      </Container>

      {/* Error dialog */}
      {error && (
        <Box mt={2} p={2} bgcolor="error.main" color="error.contrastText" borderRadius={4}>
          <Typography>{error}</Typography>
          <Button variant="outlined" onClick={handleCloseError}>Close</Button>
        </Box>
      )}
    </div>
    </main>
  );
}

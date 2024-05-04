'use client'
import React, { useState, useEffect, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
  Button, Typography, Avatar, Dialog, DialogContent, DialogActions, Box
} from '@mui/material';
import { useRouter } from "next/navigation";
import {
  getAuth,
  signOut
} from "../../../config/firebase";
import Image from 'next/image'; 

interface Crypto {
  symbol: string;
  lastPrice: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
}

const CryptoTable: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({ key: 'changePercent', direction: 'desc' });
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();
  const auth =getAuth();



  const welcomeMessage = "Welcome to Pi42! Today's update on Bitcoin."

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email);
    }

      const socket = new WebSocket('wss://fawss.pi42.com/socket.io/?EIO=4&transport=websocket');
      socket.onopen = () => socket.send('40');
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data.slice(2))[1];
        setCryptos(Object.entries(data).map(([key, value]: [string, any]) => ({
          symbol: key,
          lastPrice: value.lastPrice,
          changePercent: parseFloat(value.priceChangePercent),
          volume: value.baseAssetVolume,
          high: value.marketPrice,
          low: value.lastPrice
        })));
      };
      socket.onerror = error => console.error('WebSocket error:', error);
      socket.onclose = () => console.log('WebSocket connection closed');
      return () => socket.close();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('signout successfully')
        router.push('/');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  
  const handleShare = (crypto: Crypto) => {
    const message = `Welcome to Pi42! Today's update on ${crypto.symbol}.\nSymbol name: ${crypto.symbol}\nLast price: ₹${crypto.lastPrice}\n24 hour change percentage: ${crypto.changePercent}%\n24 hour volume: ${crypto.volume}\n24 hour high: ₹${crypto.high}\n24 hour low: ₹${crypto.low}`;
    if (navigator.share) {
      navigator.share({ title: 'Crypto Contract Details', text: message })
        .then(() => console.log('Shared successfully'))
        .catch(error => console.error('Error sharing:', error));
    } else {
      console.log(message);
    }
  };

  const requestSort = (key: string) => {
    setSortConfig(prevSortConfig => ({
      key,
      direction: prevSortConfig.key === key && prevSortConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getComparator = (key: string, direction: string) => direction === 'desc' ? (a: any, b: any) => a[key] < b[key] ? 1 : -1 : (a: any, b: any) => a[key] > b[key] ? 1 : -1;
  
  const sortedCryptos = useMemo(() => {
    if (!sortConfig.key) return cryptos;
    return [...cryptos].sort(getComparator(sortConfig.key, sortConfig.direction));
  }, [cryptos, sortConfig]);

  const formatCurrency = (value: number): string => `₹${value !== undefined && value !== null ? value.toLocaleString('en-IN') : '0'}`;
  
  const formatVolume = (value: number): string => value >= 1e7 ? `${(value / 1e7).toFixed(2)} Cr` : value >= 1e5 ? `${(value / 1e5).toFixed(2)} L` : value.toString();
  
  const handleRowClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }; 

  return (
    <>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <Image src="/pi42img.jpeg" alt="Your Image" width={200} height={100} />
    </div>
    <Typography variant="h5" align="center" gutterBottom>{welcomeMessage}</Typography>

    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
  <Typography variant="body1" sx={{ marginRight: '10px' }}>
    {userEmail}
  </Typography>
  <Button variant="contained" color="secondary" onClick={handleSignOut}>
    Sign Out
  </Button>
</Box>

      <TableContainer component={Paper} sx={{
        bgcolor: '#212121', margin: '20px', width: 'auto', overflow: 'auto', border: '1px solid #007FFF',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'darkgrey', outline: '1px solid slategrey' },
        fontFamily: '"Ubuntu", sans-serif', fontWeight: 400, fontStyle: 'normal', '& th, & td': { fontFamily: '"Ubuntu", sans-serif', fontWeight: 400, fontStyle: 'normal' },
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#333', '& th': { border: 0 } }}>
              <TableCell sx={{ color: 'white' }}>Symbol Name</TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => requestSort('lastPrice')}>
                Last Price {sortConfig.key === 'lastPrice' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={() => requestSort('changePercent')}>
                24h Change % {sortConfig.key === 'changePercent' ? (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽') : ''}
              </TableCell>
              <TableCell sx={{ color: 'white' }}>24h Volume</TableCell>
              <TableCell sx={{ color: 'white' }}>24h High</TableCell>
              <TableCell sx={{ color: 'white' }}>24h Low</TableCell>
              <TableCell sx={{ color: 'white' }}>Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCryptos.map((crypto, index) => (
              <TableRow onClick={() => handleRowClick(crypto)} key={index} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#444' }, '& td, & th': { borderBottom: 'none' } }}>
                <TableCell sx={{ color: 'white' }}>{crypto.symbol}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.lastPrice)}</TableCell>
                <TableCell sx={{ color: crypto.changePercent >= 0 ? '#32CD32' : '#fc3434' }}>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>{crypto.changePercent.toFixed(2)}%</Typography>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{formatVolume(crypto.volume)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.high)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formatCurrency(crypto.low)}</TableCell>
                <TableCell><Button variant="outlined" color="secondary" onClick={() => handleShare(crypto)}>Share</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedCrypto && (
        <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { backgroundColor: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px) saturate(180%)', WebkitBackdropFilter: 'blur(8px) saturate(180%)', color: '#fff', width: '80%', maxWidth: '600px' } }}>
          <DialogContent>
            <Typography variant="h6" gutterBottom align="center" color="common.white">Welcome to Pi42!</Typography>
            <Typography variant="h6" gutterBottom align="center" color="common.white">Today's update on {selectedCrypto?.symbol}.</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" color="common.white"><strong>Symbol name:</strong> {selectedCrypto?.symbol}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>Last price:</strong> ₹{selectedCrypto?.lastPrice}</Typography>
                <Typography variant="subtitle1" sx={{ color: selectedCrypto?.changePercent >= 0 ? '#32CD32' : '#fc3434' }}><strong>24h Change %:</strong> {selectedCrypto?.changePercent.toFixed(2)}%</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" color="common.white"><strong>24h Volume:</strong> {selectedCrypto?.volume}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24h High:</strong> ₹{selectedCrypto?.high}</Typography>
                <Typography variant="subtitle1" color="common.white"><strong>24h Low:</strong> ₹{selectedCrypto?.low}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions><Button onClick={handleClose} color="primary" variant="outlined">Close</Button></DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default CryptoTable;
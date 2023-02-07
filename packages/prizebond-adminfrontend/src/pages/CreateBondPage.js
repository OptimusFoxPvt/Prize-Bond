import { Helmet } from 'react-helmet-async';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Container,
  Stack,
  Typography,
  TextField,
  Grid,
  Input,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { alertToast } from '../components/toaster/toast';
import { api } from '../axiosIntercepter';
import PrizeBondABI from '../PrizeBond.json';
import { PrizeBondAddress } from '../config';

// ----------------------------------------------------------------------

const theme = createTheme({
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: { color: 'red' },
      },
    },
  },
});

export default function CreateBondPage() {
  const [bondType, setBondType] = React.useState(0);
  const [totalDraw, setTotalDraw] = React.useState(0);
  const [maxSupp, setMaxSupp] = React.useState(0);
  const [winningPrize, setWinningPrize] = React.useState({ firstPrize: 0, secondPrize: 0, thirdPrize: 0 });
  const [image, setImage] = useState();
  const [date, setDate] = React.useState('');

  const token = localStorage.getItem('token');
  const { firstPrize, secondPrize, thirdPrize } = winningPrize;
  const navigate = useNavigate();

  const handleProceed = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(PrizeBondAddress, PrizeBondABI.abi, signer);

      const bondPrice = ethers.utils.parseUnits(bondType.toString(), 'wei');

      await contract.setPB(
        bondPrice,
        totalDraw,
        ethers.utils.parseUnits(winningPrize.firstPrize.toString(), 'wei'),
        ethers.utils.parseUnits(winningPrize.secondPrize.toString(), 'wei'),
        ethers.utils.parseUnits(winningPrize.thirdPrize.toString(), 'wei'),
        maxSupp
      );

      try {
        const data = new FormData();
        data.append('type', bondType);
        data.append('totalDraws', totalDraw);
        data.append('maxSupply', maxSupp);
        data.append('winningPrice1', winningPrize.firstPrize);
        data.append('winningPrice2', winningPrize.secondPrize);
        data.append('winningPrice3', winningPrize.thirdPrize);
        data.append('setDrawDate', date);
        data.append('image', image);

        const { data: d } = await api.post(`/bond`, data);

        setBondType(0);
        setTotalDraw(0);
        setMaxSupp(0);
        setWinningPrize({ firstPrize: '', secondPrize: '', thirdPrize: '' });
        setDate('');
        setImage('');
        alertToast(false, 'Bond Created Successfully');
        navigate('/app/bonds');
      } catch (error) {
        alertToast(true, error?.response?.data?.error);
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(bondType, totalDraw, maxSupp, winningPrize, '++++++');
  //   const smartContract = "0xf9753473d8c3b1a179fe40388aca3cb3d91f8a28"
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)//change provider to acc. to the fantum blockchain
  //   const prizeBondContract = new ethers.Contract(smartContract, abi, provider)
  //   console.log(prizeBondContract)
  //   const owner = await prizeBondContract.owner()
  //   console.log(owner)
  // };

  const handleChangeForBond = (event) => {
    setBondType(event.target.value);
  };
  const handleChangeForDraw = (event) => {
    setTotalDraw(event.target.value);
  };
  const handleChangeForDate = (event) => {
    setDate(event.target.value);
  };

  const handleMaxSupply = (event) => {
    setMaxSupp(Number(event.target.value));
  };

  const handleFirstWinningPrize = (event) => {
    setWinningPrize({
      ...winningPrize,
      firstPrize: Number(event.target.value),
    });
  };

  const handleSecondWinningPrize = (event) => {
    setWinningPrize({
      ...winningPrize,
      secondPrize: Number(event.target.value),
    });
  };

  const handleThirdWinningPrize = (event) => {
    setWinningPrize({
      ...winningPrize,
      thirdPrize: Number(event.target.value),
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Helmet>
          <title> Dashboard: Admin | DPB </title>
        </Helmet>

        <Container maxWidth="sm">
          <Typography variant="h2" sx={{ mb: 5 }}>
            Add New Bond
          </Typography>

          <Stack spacing={3}>
            <InputLabel style={{ fontWeight: 'bold' }} placeholder="dssc">
              Please Select Denomination list
            </InputLabel>
            <FormControl required sx={{ m: 1, minWidth: 120, borderColor: 'black' }}>
              <Select value={bondType} onChange={handleChangeForBond}>
                <MenuItem value={200}>Rs - 200/-</MenuItem>
                <MenuItem value={1500}>Rs - 1500/-</MenuItem>
                <MenuItem value={15000}>Rs - 15000/-</MenuItem>
                <MenuItem value={40000}>Rs - 40000/-</MenuItem>
                <MenuItem value={25000}>Rs - 25000/-</MenuItem>
                <MenuItem value={7500}>Rs - 7500/-</MenuItem>
                <MenuItem value={750}>Rs - 750/-</MenuItem>
                <MenuItem value={100}>Rs - 100/-</MenuItem>
              </Select>
            </FormControl>
            <InputLabel style={{ fontWeight: 'bold' }}>Please Enter No. of Desired Draws</InputLabel>
            <TextField
              type="number"
              name="maxSupply"
              id="outlined-basic-normal"
              variant="outlined"
              value={totalDraw}
              onChange={handleChangeForDraw}
            />
            {/* <FormControl required sx={{ m: 1, minWidth: 120 }}>
              <Select value={totalDraw} onChange={handleChangeForDraw}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}>1 month</MenuItem>
                <MenuItem value={2}>2 months</MenuItem>
                <MenuItem value={3}>3 months</MenuItem>
                <MenuItem value={4}>4 months</MenuItem>
                <MenuItem value={5}>5 months</MenuItem>
                <MenuItem value={6}>6 months</MenuItem>
                <MenuItem value={7}>7 months</MenuItem>
                <MenuItem value={8}>8 months</MenuItem>
                <MenuItem value={9}>9 months</MenuItem>
                <MenuItem value={10}>10 months</MenuItem>
                <MenuItem value={12}>12 months</MenuItem>
              </Select>
              {/* <FormHelperText>Required</FormHelperText> */}
            {/* </FormControl> */}
            <InputLabel style={{ fontWeight: 'bold' }}>Please Enter the Maximum Supply</InputLabel>
            <TextField
              type="number"
              name="maxSupply"
              id="outlined-basic-normal"
              variant="outlined"
              value={maxSupp}
              onChange={handleMaxSupply}
            />

            <InputLabel style={{ fontWeight: 'bold' }} required>
              Maximum Supply
            </InputLabel>
            <TextField
              type="number"
              name="maxSupply"
              id="outlined-basic-normal"
              variant="outlined"
              value={maxSupp}
              onChange={handleMaxSupply}
              required
            />
            <InputLabel style={{ fontWeight: 'bold' }} required>
              Set Winning Prize
            </InputLabel>
            <Grid container>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  label="1st Prize"
                  name="winningPrize1"
                  id="outlined-basic-normal"
                  variant="outlined"
                  style={{ width: '180px' }}
                  value={winningPrize.firstPrize}
                  onChange={handleFirstWinningPrize}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  type="number"
                  label="2nd Prize"
                  name="winningPrize2"
                  id="outlined-basic-normal"
                  variant="outlined"
                  style={{ width: '180px' }}
                  value={winningPrize.secondPrize}
                  onChange={handleSecondWinningPrize}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  type="number"
                  label="3rd Prize"
                  name="winningPrize3"
                  id="outlined-basic-normal"
                  variant="outlined"
                  style={{ width: '180px' }}
                  value={winningPrize.thirdPrize}
                  onChange={handleThirdWinningPrize}
                />
              </Grid>
            </Grid>
            {/* <InputLabel style={{ fontWeight: 'bold' }} required>
              Set Draw Date
            </InputLabel>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
              <Select value={date} onChange={handleChangeForDate}>
                <MenuItem value={date}>
                  <em>None</em>
                </MenuItem>
                <MenuItem value={1}> 1 </MenuItem>
                <MenuItem value={2}> 2 </MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={13}>13</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={17}>17</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={19}>19</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={21}>21</MenuItem>
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={23}>23</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={26}>26</MenuItem>
                <MenuItem value={27}>27</MenuItem>
                <MenuItem value={28}>28</MenuItem>
                <MenuItem value={29}>29</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={31}>31</MenuItem>
              </Select>
            </FormControl> */}
            {/* <InputLabel style={{ fontWeight: 'bold' }}>Set Draw Date</InputLabel>
          <FormControl required sx={{ m: 1, minWidth: 120 }}>
            <Select value={date} onChange={handleChangeForDate}>
              <MenuItem value={date}>
                <em>None</em>
              </MenuItem>
              <MenuItem value={1}> 1 </MenuItem>
              <MenuItem value={2}> 2 </MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={11}>11</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={13}>13</MenuItem>
              <MenuItem value={14}>14</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={16}>16</MenuItem>
              <MenuItem value={17}>17</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={19}>19</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={21}>21</MenuItem>
              <MenuItem value={22}>22</MenuItem>
              <MenuItem value={23}>23</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={26}>26</MenuItem>
              <MenuItem value={27}>27</MenuItem>
              <MenuItem value={28}>28</MenuItem>
              <MenuItem value={29}>29</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={31}>31</MenuItem>
            </Select>
          </FormControl> */}
            {/* <TextField type="date" hiddenLable name="date" id="outlined-basic-normal" variant="outlined" /> */}
            <InputLabel style={{ fontWeight: 'bold' }} required>
              Upload Picture
            </InputLabel>
            <Input type="file" name="pic" onChange={handleFileChange} />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleProceed}
              disabled={
                !bondType.toString() ||
                !totalDraw.toString() ||
                !maxSupp.toString() ||
                !firstPrize.toString() ||
                !secondPrize.toString() ||
                !thirdPrize.toString() ||
                !image ||
                !date
              }
            >
              Proceed
            </LoadingButton>
          </Stack>
        </Container>
      </ThemeProvider>
    </>
  );
}

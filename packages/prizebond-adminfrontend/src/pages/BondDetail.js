import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { sentenceCase } from 'change-case';
import {
  CardActionArea,
  Button,
  Container,
  Stack,
  InputLabel,
  TextField,
  Grid,
  TablePagination,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Avatar,
  Checkbox,
  TableContainer,
  Paper,
  Table,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import Iconify from '../components/iconify';
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// import USERLIST from '../_mock/user';

export default function ActionAreaCard() {
  const USERLIST = [
    {
      id: 1,
      luckyDrawNo: 785,
      lickDrawDate: '12/02/2023',
      winningPrizes: {
        firstPrize: 757,
        secondPrize: 651,
        thirdPrize: 521,
      },
      winners: {
        first: '1111',
        second: '2222',
        third: '3333',
      },
      remaningDraws: 11,
      transcationHash: '0sdx....hb8w',
      transcationHashLink: 'https://www.google.com',
    },
  ];
  console.log(USERLIST, 'USERLIST');
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { state } = useLocation();

  console.log('statee', state);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const isNotFound = !USERLIST.length && !!filterName;

  const TABLE_HEAD = [
    { id: 'luckyDrawNo', label: 'Lucky Draw No', alignRight: false },
    { id: 'luckyDrawDate', label: 'Lucky Draw  Date', alignRight: false },
    { id: 'winningPrize', label: 'Winning Prize', alignRight: false },
    { id: 'winners', label: 'Winners', alignRight: false },
    { id: 'remainingDraw', label: 'Remaining Draws', alignRight: false },
    { id: 'transcationHash', label: 'Transcation Hash', alignRight: false },
  ];

  return (
    <>
      <>
        <Helmet>
          <title> Dashboard: Admin | DPB </title>
        </Helmet>
        <div style={{ maxWidth: '50%', paddingLeft: '30px' }}>
          <Container maxWidth="sm">
            <Typography variant="h2" sx={{ mb: 1 }}>
              Bond Details
            </Typography>

            <Stack spacing={2}>
              <InputLabel style={{ fontWeight: 'bold' }}>Bond Type</InputLabel>
              <TextField
                type="number"
                name="maxSupply"
                disabled
                id="outlined-disabled"
                variant="outlined"
                value={state?.type}
              />

              <InputLabel style={{ fontWeight: 'bold' }}>Total Draws</InputLabel>
              <TextField
                type="number"
                name="maxSupply"
                disabled
                id="outlined-disabled"
                variant="outlined"
                value={state?.totalDraws}
              />
              <InputLabel style={{ fontWeight: 'bold' }}>Series</InputLabel>
              <TextField name="maxSupply" disabled id="outlined-disabled" variant="outlined" value={'-'} />
              <InputLabel style={{ fontWeight: 'bold' }}>Maximum Supply</InputLabel>
              <TextField
                type="number"
                name="maxSupply"
                disabled
                id="outlined-disabled"
                variant="outlined"
                value={state?.maxSupply}
              />
              <InputLabel style={{ fontWeight: 'bold' }}>Remaining Supply</InputLabel>
              <TextField name="maxSupply" disabled id="outlined-disabled" variant="outlined" value={'-'} />
              <InputLabel style={{ fontWeight: 'bold' }}>Winning Position</InputLabel>
              {/* <TextField type="number" name="maxSupply"  disabled
            id="outlined-disabled"variant="outlined" /> */}

              <Grid container>
                <Grid item xs={4}>
                  <TextField
                    name="winningPrize1"
                    disabled
                    id="outlined-disabled"
                    variant="outlined"
                    style={{ width: '181px' }}
                    value={`1st Prize ${state?.winningPrice1}`}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    name="winningPrize2"
                    disabled
                    id="outlined-disabled"
                    variant="outlined"
                    style={{ width: '180px' }}
                    value={`2nd Prize ${state?.winningPrice2}`}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="winningPrize3"
                    disabled
                    id="outlined-disabled"
                    variant="outlined"
                    style={{ width: '184px' }}
                    value={`3rd Prize ${state?.winningPrice3}`}
                  />
                </Grid>
              </Grid>

              <InputLabel style={{ fontWeight: 'bold' }}>Set Draw Date</InputLabel>

              <TextField
                hiddenLable
                name="date"
                disabled
                id="outlined-disabled"
                variant="outlined"
                value={state?.setDrawDate}
              />
            </Stack>
            <Button sx={{ marginTop: 5 }} size="large" type="submit" variant="contained">
              {' '}
              Start Lucky Draw{' '}
            </Button>
          </Container>
        </div>

        <Container>
          <br />
          <br />
          <Typography variant="h2" sx={{ mb: 1 }}>
            Lucky Draw Details
          </Typography>
          <Card style={{ marginTop: '40px' }}>
            {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {/* {USERLIST.map((i) => {
                        return (
                            <></>
                        )
                    })} */}
                    {USERLIST.map((i) => {
                      const a = 0;
                      return (
                        <TableRow hover key={i.id} tabIndex={-1}>
                          <TableCell padding="checkbox">{''}</TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {i.luckyDrawNo}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{i.lickDrawDate}</TableCell>

                          <TableCell align="left">
                            <Stack>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>First: </div>
                                <div>{i.winningPrizes.firstPrize}</div>
                              </div>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>Second:</div>
                                <div>{i.winningPrizes.secondPrize}</div>
                              </div>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>Third: </div>
                                <div>{i.winningPrizes.thirdPrize}</div>
                              </div>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <Stack>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>First:</div>
                                <div>{i.winners.first}</div>
                              </div>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>Second:</div>
                                <div>{i.winners.second}</div>
                              </div>
                              <div
                                style={{
                                  marginTop: '0px',
                                  marginBottom: '4px',
                                  marginRight: '40px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div style={{ fontWeight: '700' }}>Third:</div>
                                <div>{i.winners.third}</div>
                              </div>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <>{i.remaningDraws}</>
                          </TableCell>

                          <TableCell align="left">
                            <a href={i.transcationHashLink} target="_blank" rel="noreferrer">
                              {i.transcationHash}
                              <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                <Iconify icon={'material-symbols:open-in-new-rounded'} />
                              </IconButton>
                            </a>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </>
    </>
  );
}

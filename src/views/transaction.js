import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Typography, FormControlLabel, Switch, TextField } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import { Calendar } from 'react-feather';
import { styled } from '@mui/material/styles';
import { useMediaQuery } from 'react-responsive';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default function Transaction() {
  const [items, setItems] = useState(null);
  const [switchState, setSwitchState] = useState(false);
  const [txidData, setTxidData] = useState('');
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const [state, setState] = useState({
    start: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    end: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
  });

  const { start, end } = state;

  const label = start?.format('DD MMM YY hh:mm a') + ' - ' + end?.format('DD MMM YY hh:mm a');

  const handleCallback = (start, end) => {
    fetchTransaction({ start: start, end: end });
  };

  useEffect(() => {
    if (items === null) {
      fetchTransaction({ start: start, end: end });
    }
  }, []); // eslint-disable-line

  const fetchTransaction = async (payload = {}) => {
    setItems(null);
    const res = await ApiHelper.getTransactions(payload);
    setItems(res?.data);
    let totalAll = {
      total_buy: 0,
      total_sell: 0,
      total_profit: 0
    };
    for (let index in res?.data) {
      let item = res?.data[index];
      totalAll.total_buy = totalAll.total_buy + Number(item.buy_price);
      totalAll.total_sell = totalAll.total_sell + Number(item.sell_price);
      totalAll.total_profit = totalAll.total_profit + Number(item.profit);
    }
    if (payload?.start && payload?.end) {
      setState({ start: payload.start, end: payload.end, total_buy: totalAll.total_buy, total_sell: totalAll.total_sell, total_profit: totalAll.total_profit });
    } else {
      setState({ ...state, total_buy: totalAll.total_buy, total_sell: totalAll.total_sell, total_profit: totalAll.total_profit });
    }
  };

  const handleChange = (e) => {
    setTxidData(e.target.value);
    if (switchState === true) {
      fetchTransaction({ tx_id: e.target.value });
    }
  };

  const handleChangeSwitch = (state) => {
    setSwitchState(state);
    if (state === false) {
      setTxidData('');
      fetchTransaction({ start: start, end: end });
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'สินค้า',
      flex: 1,
    },
    {
      field: 'qty',
      headerName: 'จำนวน',
      maxWidth: 80
    },
    {
      field: 'buy_price',
      headerName: 'ต้นทุน',
      maxWidth: 110,
      renderCell: (params) => params?.row?.buy_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'sell_price',
      headerName: 'ราคาขาย',
      maxWidth: 110,
      renderCell: (params) => params?.row?.sell_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'profit',
      headerName: 'กำไร',
      maxWidth: 110,
      renderCell: (params) => params?.row?.profit.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'payment_type',
      headerName: 'จ่ายด้วย',
      maxWidth: 100,
      renderCell: (params) => params?.row?.payment_type === "cash" ? "เงินสด" : "QR พร้อมเพย์",
    },
    {
      field: 'customer',
      headerName: 'ซื้อโดย',
      flex: 1,
      renderCell: (params) => params?.row?.customer ? `${params?.row?.customer?.fname} (${params?.row?.customer?.rank[0].toUpperCase() + params?.row?.customer?.rank.slice(1)})` : "",
    },
    {
      field: 'sell_user',
      headerName: 'ขายโดย',
      flex: 1,
      renderCell: (params) => params?.row?.sell_user ? `${params?.row?.sell_user?.fname} (${params?.row?.sell_user?.role === "admin" ? "เจ้าของร้าน" : "พนักงาน"})` : "",
    },
    {
      field: 'created_date',
      headerName: 'ขายเมื่อ',
      flex: 1,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
  ];

  const columns_mobile = [
    {
      field: 'name',
      headerName: 'สินค้า',
      minWidth: 180
    },
    {
      field: 'qty',
      headerName: 'จำนวน',
      minWidth: 110
    },
    {
      field: 'buy_price',
      headerName: 'ต้นทุน',
      minWidth: 110,
      renderCell: (params) => params?.row?.buy_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'sell_price',
      headerName: 'ราคาขาย',
      minWidth: 120,
      renderCell: (params) => params?.row?.sell_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'profit',
      headerName: 'กำไร',
      minWidth: 120,
      renderCell: (params) => params?.row?.profit.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'payment_type',
      headerName: 'จ่ายด้วย',
      minWidth: 110,
      renderCell: (params) => params?.row?.payment_type === "cash" ? "เงินสด" : "QR พร้อมเพย์",
    },
    {
      field: 'customer',
      headerName: 'ซื้อโดย',
      minWidth: 140,
      renderCell: (params) => params?.row?.customer ? `${params?.row?.customer?.fname} (${params?.row?.customer?.rank[0].toUpperCase() + params?.row?.customer?.rank.slice(1)})` : "",
    },
    {
      field: 'sell_user',
      headerName: 'ขายโดย',
      minWidth: 180,
      renderCell: (params) => params?.row?.sell_user ? `${params?.row?.sell_user?.fname} (${params?.row?.sell_user?.role === "admin" ? "เจ้าของร้าน" : "พนักงาน"})` : "",
    },
    {
      field: 'created_date',
      headerName: 'ขายเมื่อ',
      minWidth: 140,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
  ];

  return (
    <>
      <Helmet>
        <title>บันทึกการขาย | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <Grid container spacing={1} justifyContent="flex-end">
                <Grid item xs={12} sx={{ display: "flex" }}>
                  {switchState === false &&
                    <DateRangePicker
                      initialSettings={{
                        maxDate: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }),
                        timePicker: true,
                        startDate: start?.toDate(),
                        endDate: end?.toDate(),
                        autoUpdateInput: true,
                        ranges: {
                          Today: [
                            moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
                            moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                          ],
                          Yesterday: [
                            moment()
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .subtract(1, 'days'),
                            moment()
                              .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                              .subtract(1, 'days')
                          ],
                          'Last 7 Days': [
                            moment()
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .subtract(6, 'days'),
                            moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                          ],
                          'Last 30 Days': [
                            moment()
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .subtract(29, 'days'),
                            moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                          ],
                          'This Month': [
                            moment()
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .startOf('month'),
                            moment()
                              .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                              .endOf('month')
                          ],
                          'Last Month': [
                            moment()
                              .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                              .subtract(1, 'month')
                              .startOf('month'),
                            moment()
                              .set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
                              .subtract(1, 'month')
                              .endOf('month')
                          ]
                        },
                        locale: {
                          format: 'DD MMM YY hh:mm a'
                        }
                      }}
                      onCallback={handleCallback}
                    >
                      <Button
                        id="reportrange"
                        style={{
                          cursor: 'pointer',
                          paddingLeft: '10px',
                          paddingRight: '10px',
                          height: '38px',
                          fontSize: isMobile ? '12px' : '14px',
                          display: 'flex',
                          borderColor: "rgba(0, 0, 0, 0.15)",
                          background: 'white'
                        }}
                        color="secondary"
                        variant="outlined"
                      >
                        <span style={{ marginRight: '15px', color: 'black' }}>{label}</span>
                        <Calendar style={{ color: 'black', width: '18px' }} />
                      </Button>
                    </DateRangePicker>
                  }
                  {switchState === true &&
                    <TextField
                      id="tx_id"
                      label="TXID *"
                      size="small"
                      value={txidData || ""}
                      name="tx_id"
                      sx={{ width: "338px", marginRight: "20px" }}
                      onChange={handleChange}//setTxidData(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      autoComplete='off'
                    />
                  }
                  { !isMobile &&
                    <FormControlLabel sx={{ ml: 2 }}
                      control={<IOSSwitch sx={{ m: 1 }} checked={switchState} onClick={() => handleChangeSwitch(!switchState)} />}
                      label="ใช้ TXID จากใบเสร็จเพื่อค้นหา"
                    />
                  }
                </Grid>
                { isMobile &&
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} checked={switchState} onClick={() => handleChangeSwitch(!switchState)} />}
                      label="ใช้ TXID จากใบเสร็จเพื่อค้นหา"
                    />
                  </Grid>
                }
                <Grid item xs={12}>
                  <Typography>ต้นทุนรวม: {state?.total_buy?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>ราคาขายรวม: {state?.total_sell?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>กำไรรวม: {state?.total_profit?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</Typography>
                </Grid>
              </Grid>
            </Box>
            <Card>
              <Box sx={{ height: "64vh", width: '100%' }}>
                <DataGrid
                  rows={items || []}
                  columns={isMobile ? columns_mobile : columns}
                  getRowId={(row) => row._id}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import { Calendar } from 'react-feather';

export default function Transaction() {
  const [items, setItems] = useState(null);

  const [state, setState] = useState({
    start: moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }),
    end: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 })
  }); 

  const { start, end } = state;

  const label = start.format('DD MMM YY hh:mm a') + ' - ' + end.format('DD MMM YY hh:mm a');

  const handleCallback = (start, end) => {
    fetchTransaction({ start: start, end: end});
  };

  useEffect(() => {
    if (items == null) {
      fetchTransaction({ start: start, end: end});
    }
  }, []); // eslint-disable-line

  const fetchTransaction = async (payload = {}) => {
    const res = await ApiHelper.getTransactions(payload);
    setItems(res?.data);
    let totalAll = {
      total_buy: 0,
      total_sell: 0,
      total_profit: 0
    };
    for(let index in res?.data){
      let item = res?.data[index];
      totalAll.total_buy = totalAll.total_buy + Number(item.buy_price);
      totalAll.total_sell = totalAll.total_sell + Number(item.sell_price);
      totalAll.total_profit = totalAll.total_profit + Number(item.profit);
    }
    setState({ start: payload.start, end: payload.end, total_buy: totalAll.total_buy, total_sell: totalAll.total_sell, total_profit: totalAll.total_profit });
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
      flex: 1,
    },
    {
      field: 'buy_price',
      headerName: 'ต้นทุน',
      flex: 1,
      renderCell: (params) => params?.row?.buy_price + " ฿",
    },
    {
      field: 'sell_price',
      headerName: 'ราคาขาย',
      flex: 1,
      renderCell: (params) => params?.row?.sell_price + " ฿",
    },
    {
      field: 'profit',
      headerName: 'กำไร',
      flex: 1,
      renderCell: (params) => params?.row?.profit + " ฿",
    },
    {
      field: 'payment_type',
      headerName: 'จ่ายด้วย',
      flex: 1,
      renderCell: (params) => params?.row?.payment_type === "cash" ? "เงินสด" : "QR พร้อมเพย์",
    },
    {
      field: 'created_date',
      headerName: 'ขายเมื่อ',
      flex: 1,
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
                <Grid item xs={12}>
                  <DateRangePicker
                    initialSettings={{
                      maxDate: moment().set({ hour: 23, minute: 59, second: 59, millisecond: 0 }),
                      timePicker: true,
                      startDate: start.toDate(),
                      endDate: end.toDate(),
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
                        marginBottom: '10px',
                        marginRight: '10px',
                        height: '38px',
                        fontSize: '14px',
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
                </Grid>
                <Grid item xs={12}>
                  <Typography>ต้นทุนรวม: {state?.total_buy} บาท</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>ราคาขายรวม: {state?.total_sell} บาท</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>กำไรรวม: {state?.total_profit} บาท</Typography>
                </Grid>
              </Grid>
            </Box>
            <Card>
              <Box sx={{ height: "64vh", width: '100%' }}>
                <DataGrid
                  rows={items || []}
                  columns={columns}
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
import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Chip, Link, Modal, CardHeader, Divider, CardContent } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import { Calendar } from 'react-feather';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { Loader as LoaderIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, Truck as TruckIcon} from "react-feather";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '90%',
};


export default function BuyProduct() {
  const [items, setItems] = useState(null);
  const [openItem, setOpenItem] = useState(false);
  const [buyitems, setBuyItems] = useState(null);
  const [pid, setPid] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();
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
    const res = await ApiHelper.getBuyingOrders(payload);
    setItems(res?.data);
    if (payload?.start && payload?.end) {
      setState({ start: payload.start, end: payload.end });
    }
  };

  const handleOpenItem = async (pid, status) => {
    const res = await ApiHelper.getBuyingItemsByPid({ pid: pid });
    setPid(pid);
    setStatus(status);
    setBuyItems(res?.data);
    setOpenItem(true);
  };

  const updateStatusBO = async (payload = {}) => {
    const res = await ApiHelper.updateBuyingStatus(payload);
    if(res?.status === "ok"){
      setOpenItem(false);
      fetchTransaction({ start: start, end: end });
    }
  };

  const columns = [
    {
      field: 'pid',
      headerName: 'เลขที่ใบสั่งซื้อ',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      flex: 1,
      renderCell: (params) => params?.row?.status === 'waiting' ? <Chip color="warning" icon={<LoaderIcon />} label="รออนุมัติ" /> : params?.row?.status === 'success' ? <Chip color="success" icon={<CheckCircleIcon />} label="นำเข้าสำเร็จ" /> : params?.row?.status === 'cancel' ? <Chip color="error" icon={<XCircleIcon />} label="ยกเลิกรายการ" /> : <Chip color="primary" icon={<TruckIcon />} label="รอรับสินค้า" />,
    },
    {
      field: 'total_price',
      headerName: 'ยอดรวม',
      flex: 1,
      renderCell: (params) => params?.row?.total_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'created_date',
      headerName: 'วันที่',
      flex: 1,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
    {
      field: 'buy_user',
      headerName: 'ผู้ทำรายการ',
      flex: 1,
      renderCell: (params) => params?.row?.buy_user ? `${params?.row?.buy_user?.fname} (${params?.row?.buy_user?.role === "admin" ? "เจ้าของร้าน" : "พนักงาน"})` : "",
    },
    {
      type: "actions",
      flex: 1,
      maxWidth: 90,
      renderCell: (params) => (params?.row?.status !== 'success' && params?.row?.status !== 'cancel')
      ?
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={() => handleOpenItem(`${params?.row?.pid}`, params?.row?.status)}>
          อัพเดท
        </Link>
      :
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={() => handleOpenItem(`${params?.row?.pid}`, params?.row?.status)}>
          ดูรายละเอียด
        </Link>
    },
  ];

  const columns_mobile = [
    {
      field: 'pid',
      headerName: 'เลขที่ใบสั่งซื้อ',
      minWidth: 150,
    },
    {
      field: 'status',
      headerName: 'สถานะ',
      minWidth: 150,
      renderCell: (params) => params?.row?.status === 'waiting' ? <Chip color="warning" icon={<LoaderIcon />} label="รออนุมัติ" /> : params?.row?.status === 'success' ? <Chip color="success" icon={<CheckCircleIcon />} label="นำเข้าสำเร็จ" /> : params?.row?.status === 'cancel' ? <Chip color="error" icon={<XCircleIcon />} label="ยกเลิกรายการ" /> : <Chip color="primary" icon={<TruckIcon />} label="รอรับสินค้า" />,
    },
    {
      field: 'total_price',
      headerName: 'ยอดรวม',
      minWidth: 150,
      renderCell: (params) => params?.row?.total_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'created_date',
      headerName: 'วันที่',
      minWidth: 150,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
    {
      field: 'buy_user',
      headerName: 'ผู้ทำรายการ',
      minWidth: 180,
      renderCell: (params) => params?.row?.buy_user ? `${params?.row?.buy_user?.fname} (${params?.row?.buy_user?.role === "admin" ? "เจ้าของร้าน" : "พนักงาน"})` : "",
    },
    {
      type: "actions",
      minWidth: 100,
      renderCell: (params) => (params?.row?.status !== 'success' && params?.row?.status !== 'cancel')
      ?
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={() => handleOpenItem(`${params?.row?.pid}`, params?.row?.status)}>
          อัพเดท
        </Link>
      :
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={() => handleOpenItem(`${params?.row?.pid}`, params?.row?.status)}>
          ดูรายละเอียด
        </Link>
    },
  ];

  const buy_columns = [
    {
      field: 'name',
      headerName: 'สินค้า',
      minWidth: 140,
      flex: 1
    },
    {
      field: 'qty',
      headerName: 'จำนวน',
      minWidth: 140,
      flex: 1
    },
    {
      field: 'buy_price',
      headerName: 'ราคา/หน่วย',
      minWidth: 140,
      flex: 1,
      renderCell: (params) => params?.row?.buy_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      headerName: 'ราคารวม',
      minWidth: 140,
      flex: 1,
      renderCell: (params) => (Number(params?.row?.buy_price) * Number(params?.row?.qty)).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    }
  ];

  const selected_columns = () => {
    let result_columns = [];
    if (isMobile) {
        const exclude_fields = ["flex"];
        result_columns = buy_columns.filter((column) => !!!exclude_fields.includes(column?.field));
    } else {
      const exclude_fields = ["minWidth"];
      result_columns = buy_columns.filter((column) => !!!exclude_fields.includes(column?.field));
    }
    return result_columns;
  };

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
                { isMobile &&
                  <Grid item xs={12} sx={{ display: "flex", mb: 1 }}>
                      <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "150px" }} onClick={() => navigate(`/app/buy-product/new`)}>สร้างใบสั่งซื้อ</Button>
                  </Grid>
                }
                <Grid item xs={12} sx={{ display: "flex" }}>
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
                  { !isMobile &&
                    <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "150px", marginLeft: '15px' }} onClick={() => navigate(`/app/buy-product/new`)}>สร้างใบสั่งซื้อ</Button>
                  }
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
      <Modal open={openItem}>
        <Box sx={{ ...style, }}>
          <Card>
            <CardHeader title="รายละเอียดใบสั่งซื้อ" />
            <Divider />
            <CardContent>
              <Box sx={{ height: "64vh", width: '100%' }}>
                <DataGrid
                  rows={buyitems || []}
                  columns={selected_columns()}
                  getRowId={(row) => row._id}
                />
              </Box>
              <Grid container justifyContent={"space-between"} sx={{ mt: 2 }}>
                <Grid item>
                  <Button variant="outlined" onClick={() => setOpenItem(false)} sx={{ textTransform: "capitalize" }}>
                    ปิด
                  </Button>
                </Grid>
                <Grid item>
                  {  status === 'waiting' &&
                    <Button style={{ backgroundColor: "red", color: "white", fontSize: "14px" }} onClick={() => updateStatusBO({ pid: pid, status: 'cancel' })} sx={{ textTransform: "capitalize" }}>
                      ยกเลิกรายการ
                    </Button>
                  }
                  { (status !== 'success' && status !== 'cancel') &&
                    <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px" }} onClick={() => updateStatusBO({ pid: pid, status: status === 'waiting' ? 'confirm' : 'success' })} sx={{ textTransform: "capitalize", ml: 2 }}>
                      { status === 'waiting' ? 'อนุมัติ' : 'รับสินค้าแล้ว' }
                    </Button>
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
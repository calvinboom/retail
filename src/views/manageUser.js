import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Link } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from "dayjs";
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

export default function ManageCustomer() {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  useEffect(() => {
    if (items === null) {
      fetchTransaction();
    }
  }, []); // eslint-disable-line

  const fetchTransaction = async (payload = {}) => {
    const res = await ApiHelper.getUsers(payload);
    setItems(res?.data);
  };

  const columns = [
    {
      field: 'email',
      headerName: 'อีเมล',
      flex: 1,
    },
    {
      field: 'fname',
      headerName: 'ชื่อ',
      flex: 1,
    },
    {
      field: 'lname',
      headerName: 'สกุล',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'เบอร์โทรศัพท์',
      flex: 1
    },
    {
      field: 'role',
      headerName: 'ตำแหน่ง',
      flex: 1,
      renderCell: (params) => params?.row?.role === "user" ? "พนักงาน" : "เจ้าของร้าน",
    },
    {
      field: 'created_date',
      headerName: 'วันที่สร้าง',
      flex: 1,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
    {
      type: "actions",
      flex: 1,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={ () => navigate(`/app/manage-user/info/${params?.row?.shortid}`) }>
          แก้ไข
        </Link>
    },
  ];

  const columns_mobile = [
    {
      field: 'email',
      headerName: 'อีเมล',
      minWidth: 200,
    },
    {
      field: 'fname',
      headerName: 'ชื่อ',
      minWidth: 150,
    },
    {
      field: 'lname',
      headerName: 'สกุล',
      minWidth: 150,
    },
    {
      field: 'phone',
      headerName: 'เบอร์โทรศัพท์',
      minWidth: 150,
    },
    {
      field: 'role',
      headerName: 'ตำแหน่ง',
      minWidth: 140,
      renderCell: (params) => params?.row?.role === "user" ? "พนักงาน" : "เจ้าของร้าน",
    },
    {
      field: 'created_date',
      headerName: 'วันที่สร้าง',
      minWidth: 160,
      renderCell: (params) => params?.row?.created_date && dayjs(params?.row?.created_date).format("MMM D, YYYY HH:mm"),
    },
    {
      type: "actions",
      minWidth: 80,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={ () => navigate(`/app/manage-user/info/${params?.row?.shortid}`) }>
          แก้ไข
        </Link>
    },
  ];

  return (
    <>
      <Helmet>
        <title>จัดการผู้ใช้งาน | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <Grid container spacing={1} justifyContent="flex-start">
                <Grid item xs={isMobile ? 3 : 1}>
                  <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "100%" }} onClick={ () => navigate(`/app/manage-user/new`)} >เพิ่มผู้ใช้</Button>
                </Grid>
              </Grid>
            </Box>
            <Card>
              <Box sx={{ height: "64vh", width: '100%' }}>
                <DataGrid
                  rows={items || []}
                  columns={ isMobile ? columns_mobile : columns}
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
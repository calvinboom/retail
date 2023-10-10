import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Link } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useNavigate } from "react-router-dom";

import { useMediaQuery } from 'react-responsive';

export default function ManageSeller() {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  useEffect(() => {
    if (items === null) {
      fetchTransaction();
    }
  }, []); // eslint-disable-line

  const fetchTransaction = async (payload = {}) => {
    const res = await ApiHelper.getSellers(payload);
    setItems(res?.data);
  };

  const columns = [
    {
      field: 'seller_id',
      headerName: 'รหัสตัวแทน',
      flex: 1,
    },
    {
      field: 'shop_name',
      headerName: 'ชื่อร้าน',
      flex: 1,
    },
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
      field: 'line_id',
      headerName: 'Line id',
      flex: 1
    },
    {
      type: "actions",
      flex: 1,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={ () => navigate(`/app/manage-seller/info/${params?.row?.shortid}`) }>
          แก้ไข
        </Link>
    },
  ];

  const columns_mobile = [
    {
      field: 'seller_id',
      headerName: 'รหัสตัวแทน',
      minWidth: 140,
    },
    {
      field: 'shop_name',
      headerName: 'ชื่อร้าน',
      minWidth: 200,
    },
    {
      field: 'email',
      headerName: 'อีเมล',
      minWidth: 200,
    },
    {
      field: 'fname',
      headerName: 'ชื่อ',
      minWidth: 140,
    },
    {
      field: 'lname',
      headerName: 'สกุล',
      minWidth: 140,
    },
    {
      field: 'phone',
      headerName: 'เบอร์โทรศัพท์',
      minWidth: 150,
    },
    {
      field: 'line_id',
      headerName: 'Line id',
      minWidth: 140,
    },
    {
      type: "actions",
      minWidth: 90,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={ () => navigate(`/app/manage-seller/info/${params?.row?.shortid}`) }>
          แก้ไข
        </Link>
    },
  ];

  return (
    <>
      <Helmet>
        <title>จัดการตัวแทน | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <Grid container spacing={1} justifyContent="flex-start">
                <Grid item xs={isMobile ? 4 : 1}>
                  <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "100%" }} onClick={ () => navigate(`/app/manage-seller/new`)} >เพิ่มตัวแทน</Button>
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
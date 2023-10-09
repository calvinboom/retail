import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, Link } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { useNavigate } from "react-router-dom";

export default function ManageUser() {
  const [items, setItems] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (items === null) {
      fetchCustomer();
    }
  }, []); // eslint-disable-line

  const fetchCustomer = async (payload = {}) => {
    const res = await ApiHelper.getCustomers(payload);
    setItems(res?.data);
  };

  const columns = [
    {
      field: 'customer_id',
      headerName: 'รหัสสมาชิก',
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
      field: 'rank',
      headerName: 'ระดับชั้น',
      flex: 1,
      renderCell: (params) => params?.row?.rank[0].toUpperCase() + params?.row?.rank.slice(1),
    },
    {
      field: 'point',
      headerName: 'แต้มสะสม',
      flex: 1
    },
    {
      field: 'sp_detail',
      headerName: 'ส่วนลดพิเศษ',
      flex: 1,
      renderCell: (params) => params?.row?.sp_detail + "%",
    },
    {
      type: "actions",
      flex: 1,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }} onClick={ () => navigate(`/app/manage-customer/info/${params?.row?.shortid}`) }>
          แก้ไข
        </Link>
    },
  ];

  return (
    <>
      <Helmet>
        <title>จัดการสมาชิก | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <Grid container spacing={1} justifyContent="flex-start">
                <Grid item xs={1}>
                  <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "100%" }} onClick={ () => navigate(`/app/manage-customer/new`)} >เพิ่มสมาชิก</Button>
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
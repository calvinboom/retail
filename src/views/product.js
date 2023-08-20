import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, MenuItem, ImageList, Typography, Link } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import ProductCard from '../components/product-card';
import PaymentCard from '../components/PaymentCard';
import { DataGrid } from '@mui/x-data-grid';

let initialFilters = {
  field: "all",
  keyword: "",
};

export default function SellingPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState(null);

  useEffect(() => {
    if (items == null) {
      fetchItems(initialFilters);
    }
  }, []); // eslint-disable-line

  const fetchItems = async (payload = {}) => {
    const res = await ApiHelper.getItems(payload);
    setItems(res?.data);
  };

  const handleSearchType = async (payload = {}) => {
    setFilters({ ...filters, field: payload.field });
    fetchItems(payload)
  };

  const handleSearchKeyword = async (payload = {}) => {
    setFilters({ ...filters, keyword: payload.keyword });
    fetchItems(payload)
  };

  const product_type = [
    "เครื่องดื่ม",
    "อื่นๆ",
    "ขนม",
    "ขนมปัง"
  ]

  const columns = [
    {
      field: 'image',
      headerName: 'รูปสินค้า',
      flex: 1,
      renderCell: (params) => params?.row?.image === null ? "No Image." : "Image",
    },
    {
      field: 'name',
      headerName: 'สินค้า',
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'ประเภท',
      flex: 1,
      renderCell: (params) => product_type[Number(params?.row?.type) - 1],
    },
    {
      field: 'buy_price',
      headerName: 'ราคาต้นทุน',
      type: 'number',
      flex: 1,
      renderCell: (params) => params?.row?.buy_price + " ฿",
    },
    {
      field: 'sell_price',
      headerName: 'ราคาขาย',
      type: 'number',
      flex: 1,
      renderCell: (params) => params?.row?.sell_price + " ฿",
    },
    {
      type: "actions",
      flex: 1,
      renderCell: (params) =>
        <Link style={{ color: "blue", cursor: 'pointer' }}>
          แก้ไข
        </Link>

    },
  ];

  return (
    <>
      <Helmet>
        <title>สินค้า | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Grid container spacing={2} sx={{ height: 1 }}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  id="field-select"
                  size="small"
                  select
                  label="ชนิดสินค้า"
                  fullWidth
                  value={filters?.field}
                  style={{ background: 'white' }}
                  onChange={(e) => handleSearchType({ ...filters, field: e.target.value })}
                >
                  <MenuItem value={"all"}>ทั้งหมด</MenuItem>
                  <MenuItem value={"3"}>ขนม</MenuItem>
                  <MenuItem value={"4"}>ขนมปัง</MenuItem>
                  <MenuItem value={"1"}>เครื่องดื่ม</MenuItem>
                  <MenuItem value={"2"}>อื่นๆ</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="keyword-text"
                  size="small"
                  label="ค้นหา name/serial/barcode"
                  fullWidth
                  value={filters?.keyword}
                  style={{ background: 'white' }}
                  onChange={(e) => handleSearchKeyword({ ...filters, keyword: e.target.value })}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
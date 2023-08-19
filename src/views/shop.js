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

export default function Profile() {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (items == null) {
      fetchItems(initialFilters);
    }
  }, [totalPrice]); // eslint-disable-line

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

  const updateCart = async (data) => {
    let check_cart = cart?.filter((element) => element?.prod_id == data?.shortid);
    if (check_cart?.length == 0) {
      setCart(existingItems => {
        return [
          ...existingItems,
          {
            prod_id: data?.shortid,
            price: data?.price,
            name: data?.name,
            qty: 1
          }
        ]
      })
      setTotalPrice(prevTotalPrice => prevTotalPrice + Number(data?.price));
    } else {
      setCart(existingItems => {
        const itemIndex = existingItems.findIndex(item => item?.prod_id === data?.shortid)
        setTotalPrice(prevTotalPrice => prevTotalPrice + Number(data?.price));
        return [
          ...existingItems.slice(0, itemIndex),
          {
            ...existingItems[itemIndex],
            price: Number(check_cart[0]?.price) + Number(data?.price),
            qty: Number(check_cart[0]?.qty) + 1
          },
          ...existingItems.slice(itemIndex + 1),
        ]
      });
    }
  };

  const deleteItemCart = async (data) => {
    setTotalPrice(prevTotalPrice => prevTotalPrice - Number(data?.price));
    let del_cart = [...cart];
    var filtered = del_cart.filter((element) => { 
      return String(element?.name) !== String(data?.name);
    });
    setCart(filtered);
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
      type: 'number',
      maxWidth: 30,
      editable: true,
      onchange: (params) => updateCart(params?.row)
    },
    {
      field: 'price',
      headerName: 'ราคา',
      type: 'number',
      maxWidth: 100,
      renderCell: (params) => params?.row?.price + " บาท",
    },
    {
      type: "actions",
      width: 60,
      renderCell: (params) =>
        <Link style={{ color: "red", cursor: 'pointer' }} onClick={() => deleteItemCart(params?.row)}>
          ลบ
        </Link>

    },
  ];

  return (
    <>
      <Helmet>
        <title>การขาย | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={9}>
            <Box component="form" noValidate autoComplete="off" mb={2}>
              <Grid container spacing={2} justifyContent="flex-end">
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
                    <MenuItem value={"3"}>ขนม, ขนมปัง</MenuItem>
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
              </Grid>
            </Box>
            <Card>
              <CardContent sx={{ height: '75vh' }}>
                {
                  items !== null &&
                  <ImageList sx={{ width: 1, height: 1 }} cols={4}>
                    <ProductCard items={items} updateCart={updateCart} cart={cart} />
                  </ImageList>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ height: '86vh' }}>
              <CardContent style={{ textAlign: "center" }}>
                <Typography variant="h3" style={{ marginBottom: "10px" }}>ตะกร้าสินค้า</Typography>
                <Box sx={{ height: 590, width: '100%' }}>
                  <DataGrid
                    rows={cart}
                    columns={columns}
                    getRowId={(row) => row.prod_id}
                    hideFooter={true}
                  />
                </Box>
                <Typography variant="h3" style={{ marginTop: "10px", marginBottom: "10px" }}>ราคารวม { totalPrice } บาท</Typography>
                <PaymentCard totalPrice={totalPrice} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
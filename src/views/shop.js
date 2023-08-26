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
  let cart_session = JSON.parse(localStorage.getItem('cart'));
  let total = 0;
  if(cart_session){
    for(let index in cart_session){
      total = Number(total) + Number(cart_session[index].price);
    }
  }else{
    cart_session = [];
  }
  const [cart, setCart] = useState(cart_session);
  const [totalPrice, setTotalPrice] = useState(total);

  useEffect(() => {
    if (items == null) {
      fetchItems(initialFilters);
    }
  }, [totalPrice]); // eslint-disable-line

  const fetchItems = async (payload = {}) => {
    setItems(null);
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
        localStorage.setItem('cart', JSON.stringify([
          ...existingItems,
          {
            prod_id: data?.shortid,
            price: data?.sell_price,
            name: data?.name,
            qty: 1
          }
        ]));
        return [
          ...existingItems,
          {
            prod_id: data?.shortid,
            price: data?.sell_price,
            name: data?.name,
            qty: 1
          }
        ]
      })
      setTotalPrice(prevTotalPrice => prevTotalPrice + Number(data?.sell_price));
    } else {
      setCart(existingItems => {
        const itemIndex = existingItems.findIndex(item => item?.prod_id === data?.shortid)
        setTotalPrice(prevTotalPrice => prevTotalPrice + Number(data?.sell_price));
        localStorage.setItem('cart', JSON.stringify([
          ...existingItems.slice(0, itemIndex),
          {
            ...existingItems[itemIndex],
            price: Number(check_cart[0]?.price) + Number(data?.sell_price),
            qty: Number(check_cart[0]?.qty) + 1
          },
          ...existingItems.slice(itemIndex + 1),
        ]));
        return [
          ...existingItems.slice(0, itemIndex),
          {
            ...existingItems[itemIndex],
            price: Number(check_cart[0]?.price) + Number(data?.sell_price),
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
    localStorage.setItem('cart', JSON.stringify(filtered));
    setCart(filtered);
  };

  const createTransaction = async (data) => {
    let res = await ApiHelper.createTransaction(data);
    if(res?.status === "ok"){
      localStorage.removeItem("cart");
      setCart([]);
      setTotalPrice(0);
      return true;
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
      type: 'number',
      maxWidth: 50,
      editable: true,
      onchange: (params) => updateCart(params?.row)
    },
    {
      field: 'price',
      headerName: 'ราคา',
      type: 'number',
      maxWidth: 60,
      renderCell: (params) => params?.row?.price + " ฿",
    },
    {
      type: "actions",
      maxWidth: 30,
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
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Grid container spacing={2} sx={{ height: 1 }}>
          <Grid item xs={9}>
            <Card sx={{ height: '82vh' }}>
              <Grid container spacing={2} sx={{padding: "24px"}}>
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
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ height: "550px", width: '100%' }}>
                      {
                        items !== null &&
                        <ImageList sx={{ width: 1, height: 1, transform: 'translateZ(0)' }} cols={4}>
                          <ProductCard items={items} updateCart={updateCart} cart={cart} />
                        </ImageList>
                      }
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card sx={{ height: '82vh' }}>
              <CardContent style={{ height: '100%', textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Typography style={{ marginBottom: "10px", fontSize: "19px" }}>ตะกร้าสินค้า</Typography>
                <Box sx={{ height: "58vh", width: '100%' }}>
                  <DataGrid
                    rows={cart}
                    columns={columns}
                    getRowId={(row) => row.prod_id}
                    hideFooter={true}
                  />
                </Box>
                <Typography style={{ fontSize: "19px" }}>ราคารวม { totalPrice } บาท</Typography>
                <PaymentCard totalPrice={totalPrice} createTransaction={createTransaction} cart={cart} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
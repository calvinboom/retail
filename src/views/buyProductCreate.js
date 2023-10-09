import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, Button, TextField, MenuItem, Modal, CardHeader, CardContent, Divider, Typography } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from 'moment';
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

export default function BuyProductCreate() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [items, setItems] = useState(null);
  const [selected, setSelected] = useState(null);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [itemQty, setItemQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [openEditItems, setOpenEditItems] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (items === null) {
      fetchItems({ field: "all", keyword: "" });
    }
    if (userData == null) {
      fetchUser({ id: user.id });
    }
  }, []); // eslint-disable-line

  const fetchItems = async (payload = {}) => {
    setItems(null);
    const res = await ApiHelper.getItems(payload);
    setItems(res?.data);
  };

  const fetchUser = async (payload = {}) => {
    const res = await ApiHelper.getUser(payload);
    setUserData(res?.data);
  };

  const columns = [
    {
      field: 'shortid',
      headerName: 'Shortid',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'สินค้า',
      flex: 1,
    },
    {
      field: 'buy_price',
      headerName: 'ราคาซื้อ',
      flex: 1,
      renderCell: (params) => (Number(params?.row?.buy_price)).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
    {
      field: 'qty',
      headerName: 'จำนวน',
      flex: 1,
    },
    {
      headerName: 'ยอดรวม',
      flex: 1,
      renderCell: (params) => (Number(params?.row?.buy_price) * Number(params?.row?.qty)).toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿",
    },
  ];

  const handleChange = (e) => {
    setSelected({ ...selected, field: e.target.value });
    setOpenEditItems(true);
  };

  const handleChangeItems = (e) => {
    setItemQty(e.target.value);
  };

  const onSubmit = async () => {
    let item = items?.filter((element) => element.shortid === selected?.field)[0];
    let create_item = {
      _id: item?._id,
      shortid: item?.shortid,
      name: item?.name,
      type: item?.type,
      buy_price: item?.buy_price,
      qty: itemQty
    };
    setItemsSelected([...itemsSelected, create_item]);
    setTotalPrice(totalPrice + (Number(item?.buy_price) * Number(itemQty)));
    setItemQty(1);
    setOpenEditItems(false);
  };

  const createBuyItem = async () => {
    if (itemsSelected.length !== 0) {
      let data_items = itemsSelected;
      let order_items = {
        status: 'waiting',
        total_price: totalPrice,
        buy_user: user.id
      };
      const res = await ApiHelper.createBuyingItems({ data_items: data_items, order_items: order_items });

      if (res?.status === "ok") {
        navigate(`/app/buy-product/`);
      }
    }
  };

  const createBuyItemNow = async () => {
    if (itemsSelected.length !== 0) {
      let data_items = itemsSelected;
      let order_items = {
        status: 'success',
        total_price: totalPrice,
        buy_user: user.id
      };
      const res = await ApiHelper.createBuyingItems({ data_items: data_items, order_items: order_items });

      if (res?.status === "ok") {
        navigate(`/app/buy-product/`);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>บันทึกการขาย | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px" }}>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent="flex-start" sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Button variant='outlined' sx={{ border: "1px solid blue", color: "blue" }} onClick={() => navigate(`/app/buy-product/`)}>กลับสู่หน้าสั่งซื้อ</Button>
              </Grid>
            </Grid>
            <Card sx={{ p: 2 }}>
              <Box component="form" noValidate autoComplete="off" mb={2}>

                <Grid container spacing={1} justifyContent="flex-start">
                  <Grid item xs={12}>
                    <TextField
                      id="field-select"
                      size="small"
                      select
                      label="เพิ่มสินค้า"
                      value={selected?.field}
                      style={{ background: 'white', minWidth: '200px' }}
                      onChange={handleChange}
                    >
                      {items?.map((item) => {
                        return <MenuItem value={item.shortid}>{item.name}</MenuItem>;
                      })
                      }
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <Typography>ราคารวม: {(totalPrice)?.toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</Typography>
                  <Box>
                    <Button style={{ backgroundColor: "blue", color: "white", fontSize: "14px", width: "100px" }} onClick={() => createBuyItem()}>ขออนุมัติ</Button>
                    {userData?.role === 'admin' && <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "100px", marginLeft: '5px' }} onClick={() => createBuyItemNow()}>อนุมัติทันที</Button>}
                  </Box>
                </Grid>
              </Box>
              <Card>
                <Box sx={{ height: "60vh", width: '100%' }}>
                  <DataGrid
                    rows={itemsSelected || []}
                    columns={columns}
                    getRowId={(row) => row.shortid}
                  />
                </Box>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Modal open={openEditItems}>
        <Box sx={{ ...style, }}>
          <Card>
            <CardHeader title="รายละเอียด" />
            <Divider />
            <CardContent>
              <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                  <TextField
                    id="name"
                    label="ชื่อสินค้า"
                    size="small"
                    value={items?.filter((element) => element.shortid === selected?.field)[0]?.name || ""}
                    error={items?.filter((element) => element.shortid === selected?.field)[0]?.name === ""}
                    name="name"
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                  <TextField
                    id="buy_price"
                    label="ราคาซื้อ"
                    size="small"
                    value={items?.filter((element) => element.shortid === selected?.field)[0]?.buy_price || ""}
                    error={items?.filter((element) => element.shortid === selected?.field)[0]?.buy_price === ""}
                    name="buy_price"
                    fullWidth
                    disabled
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                  <TextField
                    id="qty"
                    label="จำนวน"
                    size="small"
                    value={itemQty || ""}
                    error={itemQty === ""}
                    name="qty"
                    fullWidth
                    onChange={handleChangeItems}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={() => setOpenEditItems(false)} sx={{ textTransform: "capitalize" }}>
                    ปิด
                  </Button>
                </Grid>
                <Grid item sx={{ ml: 2 }}>
                  <Button variant="contained" onClick={() => onSubmit()} sx={{ textTransform: "capitalize" }}>
                    บันทึก
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
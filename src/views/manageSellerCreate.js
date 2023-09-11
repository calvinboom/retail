import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, Typography, Button, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { useNavigate, useParams } from "react-router-dom";

export default function ManageSeller() {
  const [state, setState] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchUser({ id: id });
    }
  }, []); // eslint-disable-line

  const fetchUser = async (payload = {}) => {
    const res = await ApiHelper.getSeller(payload);
    if(res?.status === "ok"){
      setState(res?.data)
    }
  };

  const submitUser = async (payload = {}) => {
    if(id){
      payload.id = id;
      const res = await ApiHelper.updateSeller(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-seller/`);
      }
    }else{
      const res = await ApiHelper.createSeller(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-seller/`);
      }
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>เพิ่มตัวแทน | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Typography sx={{ mb: 2, fontSize: "16px" }} gutterBottom>
          { id ? "แก้ไขตัวแทน" : "เพิ่มตัวแทน" }
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" sx={{ px: 2 }}>
              <Grid container rowSpacing={3} columnSpacing={3} mt={1}>
                <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                  <Typography variant="h5">รายละเอียดตัวแทน</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="merchant-name-field"
                    label="รหัสตัวแทน *"
                    size="small"
                    name="seller_id"
                    value={state?.seller_id || ""}
                    error={state?.seller_id === ""}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="อีเมล *"
                    size="small"
                    name="email"
                    value={state?.email || ""}
                    error={state?.email === ""}
                    type="email"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="Line id *"
                    size="small"
                    value={state?.line_id || ""}
                    error={state?.line_id === ""}
                    name="line_id"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="ชื่อ *"
                    size="small"
                    value={state?.fname || ""}
                    error={state?.fname === ""}
                    name="fname"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="สกุล *"
                    size="small"
                    value={state?.lname || ""}
                    error={state?.lname === ""}
                    name="lname"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="เบอร์โทรศัพท์ *"
                    size="small"
                    value={state?.phone || ""}
                    error={state?.phone === ""}
                    name="phone"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="type-select"
                    label="ชื่อร้าน *"
                    size="small"
                    name="shop_name"
                    value={state?.shop_name || ""}
                    error={state?.shop_name === ""}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="merchant-name-field"
                    label="ที่อยู่ *"
                    size="small"
                    value={state?.address || ""}
                    error={state?.address === ""}
                    name="address"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button sx={{ border: "1px solid blue", color: "blue", margin: "5px" }} onClick={ () => navigate(`/app/manage-seller/`) }>กลับสู่หน้าตัวแทน</Button>
                  <Button sx={{ backgroundColor: "green !important;", color: "white", fontSize: "15px", margin: "5px" }} onClick={() => submitUser({ data: state })}>{ id ? "แก้ไขตัวแทน" : "เพิ่มตัวแทน" }</Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
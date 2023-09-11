import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, Typography, Button, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { useNavigate, useParams } from "react-router-dom";

export default function ManageCustomerCreate() {
  const [state, setState] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchUser({ id: id });
    }
  }, []); // eslint-disable-line

  const fetchUser = async (payload = {}) => {
    const res = await ApiHelper.getCustomer(payload);
    if(res?.status === "ok"){
      setState(res?.data)
    }
  };

  const submitUser = async (payload = {}) => {
    if(id){
      payload.id = id;
      const res = await ApiHelper.updateCustomer(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-customer/`);
      }
    }else{
      const res = await ApiHelper.createCustomer(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-customer/`);
      }
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>จัดการสมาชิก | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Typography sx={{ mb: 2, fontSize: "16px" }} gutterBottom>
          { id ? "แก้ไขสมาชิก" : "เพิ่มสมาชิก" }
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" sx={{ px: 2 }}>
              <Grid container rowSpacing={3} columnSpacing={3} mt={1}>
                <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                  <Typography variant="h5">รายละเอียดสมาชิก</Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="merchant-name-field"
                    label="รหัสสมาชิก *"
                    size="small"
                    value={state?.customer_id || ""}
                    error={state?.customer_id === ""}
                    name="customer_id"
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
                    select
                    id="type-select"
                    label="ระดับชั้น *"
                    size="small"
                    name="rank"
                    value={state?.rank || "0"}
                    error={state?.rank === ""}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  >
                    <MenuItem disabled value={"0"}>
                      โปรดเลือกระดับชั้น
                    </MenuItem>
                    <MenuItem key={"bronze"} value={"bronze"}>
                      Bronze
                    </MenuItem>
                    <MenuItem key={"silver"} value={"silver"}>
                      Silver
                    </MenuItem>
                    <MenuItem key={"gold"} value={"gold"}>
                      Gold
                    </MenuItem>
                    <MenuItem key={"platinum"} value={"platinum"}>
                      Platinum
                    </MenuItem>
                    <MenuItem key={"diamond"} value={"diamond"}>
                      Diamond
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
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
                  <Button sx={{ border: "1px solid blue", color: "blue", margin: "5px" }} onClick={ () => navigate(`/app/manage-customer/`) }>กลับสู่หน้าสมาชิก</Button>
                  <Button sx={{ backgroundColor: "green !important;", color: "white", fontSize: "15px", margin: "5px" }} onClick={() => submitUser({ data: state })}>{ id ? "แก้ไขสมาชิก" : "เพิ่มผู้สมาชิก" }</Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
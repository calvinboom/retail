import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, Typography, Button, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { useNavigate, useParams } from "react-router-dom";

export default function CreateProduct() {
  const [state, setState] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchUser({ id: id });
    }
  }, []); // eslint-disable-line

  const fetchUser = async (payload = {}) => {
    const res = await ApiHelper.getUser(payload);
    if(res?.status === "ok"){
      setState(res?.data)
    }
  };

  const submitUser = async (payload = {}) => {
    if(id){
      payload.id = id;
      const res = await ApiHelper.updateUser(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-user/`);
      }
    }else{
      const res = await ApiHelper.createUser(payload);
      if(res?.status === "ok"){
        navigate(`/app/manage-user/`);
      }
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>เพิ่มผู้ใช้งาน | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Typography sx={{ mb: 2, fontSize: "16px" }} gutterBottom>
          { id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน" }
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" sx={{ px: 2 }}>
              <Grid container rowSpacing={3} columnSpacing={3} mt={1}>
                <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                  <Typography variant="h5">รายละเอียดผู้ใช้งาน</Typography>
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
                    label="พาสเวิร์ด *"
                    size="small"
                    value={state?.password || ""}
                    error={state?.password === ""}
                    name="password"
                    fullWidth
                    type="password"
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
                    select
                    id="type-select"
                    label="ประเภทผู้ใช้งาน *"
                    size="small"
                    name="role"
                    value={state?.role || "0"}
                    error={state?.role === ""}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  >
                    <MenuItem disabled value={"0"}>
                      โปรดเลือกประเภทผู้ใช้งาน
                    </MenuItem>
                    <MenuItem key={"user"} value={"user"}>
                      พนักงาน
                    </MenuItem>
                    <MenuItem key={"admin"} value={"admin"}>
                      เจ้าของร้าน
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button sx={{ border: "1px solid blue", color: "blue", margin: "5px" }} onClick={ () => navigate(`/app/manage-user/`) }>กลับสู่หน้าผู้ใช้งาน</Button>
                  <Button sx={{ backgroundColor: "green !important;", color: "white", fontSize: "15px", margin: "5px" }} onClick={() => submitUser({ data: state })}>{ id ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน" }</Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
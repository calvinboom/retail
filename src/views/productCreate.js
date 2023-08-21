import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, Typography, Button, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { useNavigate, useParams } from "react-router-dom";

export default function CreateProduct() {
  const [state, setState] = useState({});
  const [fileImage, setFile] = useState({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchProduct({ prod_id: id });
    }
  }, []); // eslint-disable-line

  const fetchProduct = async (payload = {}) => {
    const res = await ApiHelper.getItem(payload);
    if(res?.status === "ok"){
      setState(res?.data)
    }
  };

  const submitProduct = async (payload = {}) => {
    const formData = new FormData()
    if(fileImage) {
      formData.append('file', fileImage);
    }
    formData.append('name', payload.data.name);
    formData.append('type', payload.data.type);
    formData.append('buy_price', payload.data.buy_price);
    formData.append('sell_price', payload.data.sell_price);
    console.log("formData", formData.values())

    if(id){
      formData.append('prod_id', id)
      console.log("formData", formData.values())
      const res = await ApiHelper.updateItem(formData);
      if(res?.status === "ok"){
        navigate(`/app/product/`);
      }
    }else{
      console.log("formData", formData.values())
      const res = await ApiHelper.createItems(formData);
      if(res?.status === "ok"){
        navigate(`/app/product/`);
      }
    }
  };

  const product_type = [
    "เครื่องดื่ม",
    "อื่นๆ",
    "ขนม",
    "ขนมปัง"
  ]

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUploadImage = (e) => { 
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        setFile(file)
        setState({...state, image: reader.result })
        setImagePreviewUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <Helmet>
        <title>สินค้า | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
      </Helmet>
      <Box style={{ padding: "32px 32px 0px 32px" }}>
        <Typography sx={{ mb: 2, fontSize: "16px" }} gutterBottom>
          { id ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่" }
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" noValidate autoComplete="off" sx={{ px: 2 }}>
              <Grid container rowSpacing={3} columnSpacing={3} mt={1}>
                <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                  <Typography variant="h5">รายละเอียดสินค้า</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="ชื่อสินค้า *"
                    size="small"
                    name="name"
                    value={state?.name || ""}
                    error={state?.name === ""}
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
                    label="ประเภทสินค้า *"
                    size="small"
                    name="type"
                    value={state?.type || "0"}
                    error={state?.type === ""}
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  >
                    <MenuItem disabled value={"0"}>
                      โปรดเลือกประเภทสินค้า
                    </MenuItem>
                    <MenuItem key={"1"} value={"1"}>
                      {product_type[0]}
                    </MenuItem>
                    <MenuItem key={"2"} value={"2"}>
                      {product_type[1]}
                    </MenuItem>
                    <MenuItem key={"3"} value={"3"}>
                      {product_type[2]}
                    </MenuItem>
                    <MenuItem key={"4"} value={"4"}>
                      {product_type[3]}
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="ราคาต้นทุน *"
                    size="small"
                    value={state?.buy_price || ""}
                    error={state?.buy_price === ""}
                    name="buy_price"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="merchant-name-field"
                    label="ราคาขาย *"
                    size="small"
                    value={state?.sell_price || ""}
                    error={state?.sell_price === ""}
                    name="sell_price"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="merchant-name-field"
                    label="บาร์โค้ด"
                    size="small"
                    disabled
                    value={state?.barcode || ""}
                    name="barcode"
                    fullWidth
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                  <img src={state?.image && !imagePreviewUrl ? state?.image : imagePreviewUrl || "/static/no-img.png"} style={{maxWidth: "200px", height: "auto", objectFit: "cover" }} />
                  <Button
                    variant="contained"
                    component="label"
                    sx={{ width: "100px", height: "40px", marginLeft: '10px' }}
                  >
                    อัพโหลดรูป
                    <input
                      type="file"
                      hidden
                      onChange={handleUploadImage}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button sx={{ border: "1px solid blue", color: "blue", margin: "5px" }} onClick={ () => navigate(`/app/product/`) }>กลับสู่หน้าสินค้า</Button>
                  <Button sx={{ backgroundColor: "green !important;", color: "white", fontSize: "15px", margin: "5px" }} onClick={() => submitProduct({ data: state })}>{ id ? "แก้ไขสินค้า" : "เพิ่มสินค้า" }</Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
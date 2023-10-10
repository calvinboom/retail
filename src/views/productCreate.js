import React, { useState, useEffect } from 'react';
import { Card, Box, Grid, TextField, Typography, Button, MenuItem, Modal, CardHeader, Divider } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';
import ApiHelper from '../ApiHelper';
import { useNavigate, useParams } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner-updated";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '90%',
};

export default function CreateProduct() {
  const [state, setState] = useState({});
  const [fileImage, setFile] = useState({});
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const [openBarcode, setOpenBarcode] = useState(false);
  const [data, setData] = useState("Not Found");

  useEffect(() => {
    if (id) {
      fetchProduct({ prod_id: id });
    }
  }, []); // eslint-disable-line

  const fetchProduct = async (payload = {}) => {
    const res = await ApiHelper.getItem(payload);
    if(res?.status === "ok"){
      console.log('res', res)
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
    formData.append('qty', payload.data.qty);
    formData.append('buy_price', payload.data.buy_price);
    formData.append('sell_price', payload.data.sell_price);
    formData.append('expiry_date', payload.data.expiry_date);

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
    if(e?.type === 'expiry_date'){
      setState({ ...state, expiry_date: e?.date });
    }else{
      setState({ ...state, [e.target.name]: e.target.value });
    }
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
                <Grid item xs={ isMobile ? 12 : 6 }>
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
                <Grid item xs={ isMobile ? 12 : 6 }>
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
                <Grid item xs={ isMobile ? 12 : 6 }>
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
                <Grid item xs={ isMobile ? 12 : 6 }>
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
                <Grid item xs={ isMobile ? 12 : 6 }>
                  <TextField
                    id="merchant-name-field"
                    label="จำนวน *"
                    size="small"
                    value={state?.qty || ""}
                    error={state?.qty === ""}
                    name="qty"
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
                    InputLabelProps={{ shrink: true }}
                    autoComplete='off'
                    InputProps={{ endAdornment: <Button style={{ backgroundColor: "white", color: "black", fontSize: "14px", width: "70px" }} onClick={() => setOpenBarcode(true)}>แสกน</Button> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <MobileDatePicker
                      label="วันหมดอายุ"
                      slotProps={{ textField: { size: 'small' } }}
                      name="expiry_date"
                      fullWidth
                      style={{ height: '50px' }}
                      value={moment(state?.expiry_date)}
                      onChange={(newValue) => handleChange({ type: "expiry_date", date: moment(newValue).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).format() })}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                <Button
                    variant="contained"
                    component="label"
                    sx={{ width: "100px", height: "40px", marginLeft: '10px', padding: "10px" }}
                  >
                    อัพโหลดรูป
                    <input
                      type="file"
                      hidden
                      onChange={handleUploadImage}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                  <img src={state?.image && !imagePreviewUrl ? state?.image : imagePreviewUrl || "/static/no-img.png"} style={{maxWidth: "200px", height: "auto", objectFit: "cover" }} />
                  
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
      <Modal open={openBarcode}>
        <Box sx={{ ...style,}}>
          <Card>
            <CardHeader title="สแกนบาร์โค้ด" />
            <Divider />
            <CardContent>
              <BarcodeScannerComponent
                width={'100%'}
                height={350}
                onUpdate={(err, result) => {
                  if (result){
                    setData(result.text);
                    setState({ ...state, barcode: result.text });
                    setOpenBarcode(false);
                  }else{
                    setData("Not Found");
                  }
                }}
              />
              <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                <Grid item>
                  <Button variant="outlined" onClick={() => setOpenBarcode(false)} sx={{ textTransform: "capitalize" }}>
                    ปิด
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
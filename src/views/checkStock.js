import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Box, Grid, Button, Modal, Card, CardHeader, CardContent, Divider, Typography } from "@material-ui/core";
import BarcodeScannerComponent from "react-qr-barcode-scanner-updated";
import { makeStyles } from "@material-ui/styles";
import ApiHelper from '../ApiHelper';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "32px",
    },
}));

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '90%',
};

const CheckStock = () => {
    const classes = useStyles();
    const [openBarcode, setOpenBarcode] = useState(false);
    const [state, setState] = useState(null);
    const [barcode, setBarcode] = useState(null);

    useEffect(() => {
        if (barcode !== null) {
          fetchProduct({ barcode: barcode });
        }
    }, [barcode]); // eslint-disable-line

    const fetchProduct = async (payload = {}) => {
        const res = await ApiHelper.getItem(payload);
        if(res?.status === "ok"){
          setState(res?.data)
        }
    };

    const closeModal = async () => {
        setState(null);
        setBarcode(null);
        setOpenBarcode(false);
    };

    return (
        <>
            <Helmet>
                <title>เช็คสต๊อกด้วยบาร์โค้ด | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
            </Helmet>

            <Box className={classes.root}>
                <Grid container spacing={2} sx={{ mt: 0.75, height: '76vh', ml: '1px' }} alignItems="center" justifyContent="center">
                    <Button style={{ backgroundColor: "green", color: "white", fontSize: "14px", width: "180px" }} onClick={() => setOpenBarcode(true)}>เริ่มการสแกน</Button>
                </Grid>
            </Box>
            <Modal open={openBarcode}>
                <Box sx={{ ...style, }}>
                    { state === null
                        ?
                            <Card>
                                <CardHeader title="สแกนบาร์โค้ด" />
                                <Divider />
                                <CardContent>
                                    <BarcodeScannerComponent
                                        width={'100%'}
                                        height={450}
                                        torch
                                        onUpdate={(err, result) => {
                                            if (result) {
                                                setBarcode(result.text);
                                            }
                                        }}
                                    />
                                    <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                                        <Grid item>
                                            <Button variant="outlined" onClick={closeModal} sx={{ textTransform: "capitalize" }}>
                                                ปิด
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        :
                            <Card>
                                <CardHeader title="รายละเอียด" />
                                <Divider />
                                <CardContent>
                                    <Grid container spacing={2} sx={{ height: '76vh' }} alignItems="center" justifyContent="center" textAlign="center">
                                        <Grid item xs={12}>
                                            <img src={state?.image ? state?.image : "/static/no-img.png"} style={{maxWidth: "200px", height: "auto", objectFit: "cover" }} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="h4">{state?.name}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{"จำนวนคงเหลือ: "+state?.qty}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{"ราคาซื้อ: "+state?.buy_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿"}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{"ราคาขาย: "+state?.sell_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) + " ฿"}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{"บาร์โค้ด: "+state?.barcode}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                                        <Grid item>
                                            <Button variant="outlined" onClick={closeModal} sx={{ textTransform: "capitalize" }}>
                                                ปิด
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                    }
                </Box>
            </Modal>
        </>
    );
};

export default CheckStock;

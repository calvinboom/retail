import React, { useState } from "react";
import { Typography, Modal, Card, CardHeader, CardContent, Box, Divider, Grid, Button } from "@material-ui/core";
import SweetAlert2 from "react-sweetalert2";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 490,
};

const PaymentCard = (props) => {
    let { totalPrice, createTransaction, cart } = props;
    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState("qr");
    const [openmodal, setOpenmodal] = useState(false);

    const onSubmit = async () => {
        let res = await createTransaction({ data: cart, payment_type: paymentType });
        if(res === true) setOpenmodal(false);
    };

    const onClose = async () => {
        setOpenmodal(false);
    };

    return (
        <>
            <Button style={{ backgroundColor: "green", color: "white", fontSize: "18px", width: "100%", marginBottom: "30px" }} onClick={() => setOpenmodal(true)}>จ่ายเงิน</Button>
            <Modal open={openmodal}>
                <Box sx={{ ...style, width: 490 }}>
                    <Card>
                        <CardHeader title="ชำระเงิน" />
                        <Divider />
                        <CardContent>
                            <Button style={{ backgroundColor: (paymentType === "qr") ? "grey" : "blue", color: "white", fontSize: "16px", width: "25%", marginLeft: "5px", marginBottom: "15px" }} onClick={() => setPaymentType("cash")}>เงินสด</Button>
                            <Button style={{ backgroundColor: (paymentType === "cash") ? "grey" : "blue", color: "white", fontSize: "16px", width: "25%", marginLeft: "5px", marginBottom: "15px" }} onClick={() => setPaymentType("qr")}>QR พร้อมเพย์</Button>
                            <Divider />
                            <Box sx={{ width: "100%", mt: 2, textAlign: "center" }}>
                                <Typography sx={{ fontSize: "22px" }}>จำนวน {totalPrice} บาท</Typography>
                            </Box>
                            { paymentType === "qr" &&
                                <>
                                    <Box sx={{ height: "auto", maxWidth: 160, width: "100%", mt: 2 }}>
                                        <img src="/static/qr/qr_code.jpg" style={{ maxWidth: 280, marginLeft: "85px" }} />
                                    </Box>
                                    <Divider />
                                </>
                            }
                            <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                                <Grid item>
                                    <Button variant="outlined" onClick={() => onClose()} sx={{ textTransform: "capitalize" }}>
                                        ยกเลิก
                                    </Button>
                                </Grid>
                                <Grid item sx={{ ml: 2 }}>
                                    <Button variant="contained" onClick={() => onSubmit()} sx={{ textTransform: "capitalize" }}>
                                        ชำระเงินแล้ว
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </>
    );
};

export default PaymentCard;

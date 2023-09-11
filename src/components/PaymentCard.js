import React, { useState, useEffect } from "react";
import { Typography, Modal, Card, CardHeader, CardContent, Box, Divider, Grid, Button, Autocomplete, TextField } from "@material-ui/core";
import SweetAlert2 from "react-sweetalert2";
import ApiHelper from '../ApiHelper';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 490,
};

const PaymentCard = (props) => {
    let { totalPrice, createTransaction, cart } = props;
    const user = JSON.parse(localStorage.getItem('user'));

    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState("qr");
    const [openmodal, setOpenmodal] = useState(false);

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState(null);

    useEffect(() => {
        if (items == null) {
            fetchCustomer();
        }
    }, []); // eslint-disable-line

    const fetchCustomer = async (payload = {}) => {
        const res = await ApiHelper.getCustomers(payload);
        let customers = res?.data?.map((o) => {
            let res = { label: o.customer_id+`(${o.fname})`, value: o.shortid, sp_detail: o.sp_detail }
            return res ;
        })
        setItems(customers);
    };

    const onSubmit = async () => {
        let res = await createTransaction({ data: cart, payment_type: paymentType, customer_shortid: value ? value.value : null, sell_user_shortid: user?.id });
        if (res === true) setOpenmodal(false);
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
                            <Grid container display={"flex"} flexDirection={"column"} justifyContent={"space-between"} sx={{ mt: 2 }}>
                                <Autocomplete
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => {
                                        setInputValue(newInputValue);
                                    }}
                                    id="controllable-states-demo"
                                    options={items}
                                    sx={{ width: "100%" }}
                                    renderInput={(params) => <TextField {...params} label="กรอกสมาชิก *เว้นว่างไว้ถ้าหากคนซื้อไม่ใช่สมาชิก" />}
                                />
                            </Grid>
                            <Box sx={{ width: "100%", mt: 2, textAlign: "center" }}>
                                <Typography sx={{ fontSize: "22px" }}>จำนวน {(value !== null) ? Number(totalPrice) - (Number(totalPrice) * Number("0.0"+String(value?.sp_detail))) : totalPrice} บาท {(value !== null) && `(ลด ${value?.sp_detail}% แล้ว)` }</Typography>
                                { value !== null &&
                                    <Typography sx={{ fontSize: "16px" }}>ได้แต้มสะสม {(Number(totalPrice) * 0.05).toLocaleString(undefined, {minimumFractionDigits: 2})} แต้ม</Typography>
                                }
                            </Box>
                            {paymentType === "qr" &&
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

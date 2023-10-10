import React, { useState, useEffect, useRef } from "react";
import { Typography, Modal, Card, CardHeader, CardContent, Box, Divider, Grid, Button, Autocomplete, TextField } from "@material-ui/core";
import ApiHelper from '../ApiHelper';
import html2canvas from 'html2canvas';
import ReactToPrint from 'react-to-print';
const moment = require('moment');

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 490,
};

const PaymentCard = (props) => {
    let { totalPrice, createTransaction, cart, setCart, setTotalPrice } = props;
    const printRef = useRef();
    const pngRef = useRef();
    const user = JSON.parse(localStorage.getItem('user'));

    const [modalState, setModalState] = useState(1);
    const [paymentType, setPaymentType] = useState("qr");
    const [openmodal, setOpenmodal] = useState(false);

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState(null);
    const [txId, setTxId] = useState('');

    useEffect(() => {
        if (items == null) {
            fetchCustomer();
        }
    }, []); // eslint-disable-line

    const fetchCustomer = async (payload = {}) => {
        const res = await ApiHelper.getCustomers(payload);
        let customers = res?.data?.map((o) => {
            let res = { label: o.customer_id + `(${o.fname})`, value: o.shortid, sp_detail: o.sp_detail }
            return res;
        })
        setItems(customers);
    };

    const onSubmit = async () => {
        let tx_id = moment().valueOf();
        setTxId(tx_id);
        let res = await createTransaction({ data: cart, payment_type: paymentType, customer_shortid: value ? value.value : null, sell_user_shortid: user?.id, tx_id: tx_id });
        if (res === true) setModalState(2);
    };

    const onClose = async () => {
        if (modalState === 2) {
            setCart([]);
            setTotalPrice(0);
        }
        setModalState(1);
        setOpenmodal(false);
    };

    const handleDownloadImage = async () => {
        const element = pngRef.current;
        const canvas = await html2canvas(element);

        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');

        if (typeof link.download === 'string') {
            link.href = data;
            link.download = `ใบเสร็จ_txid_${txId}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setCart([]);
            setTotalPrice(0);
        } else {
            setCart([]);
            setTotalPrice(0);
            window.open(data);
        }
    };

    return (
        <>
            <Button style={{ backgroundColor: "green", color: "white", fontSize: "18px", width: "100%", marginBottom: "30px" }} onClick={() => setOpenmodal(true)}>จ่ายเงิน</Button>
            <Modal open={openmodal}>
                <Box sx={{ ...style, width: 490 }}>
                    {modalState === 1 &&
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
                                    <Typography sx={{ fontSize: "22px" }}>จำนวน {(value !== null) ? Number(totalPrice) - (Number(totalPrice) * Number("0.0" + String(value?.sp_detail))) : totalPrice} บาท {(value !== null) && `(ลด ${value?.sp_detail}% แล้ว)`}</Typography>
                                    {value !== null &&
                                        <Typography sx={{ fontSize: "16px" }}>ได้แต้มสะสม {(Number(totalPrice) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })} แต้ม</Typography>
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
                    }
                    {modalState === 2 &&
                        <>
                            <Card>
                                <CardHeader title="ชำระเงินสำเร็จ" />
                                {/*paymentType !== "qr" &&
                                    <>
                                        <Box sx={{ width: "100%", mt: 2, textAlign: "center" }}>
                                            <Typography sx={{ fontSize: "22px" }}>ทอน</Typography>
                                            <Typography sx={{ fontSize: "16px" }}>{(Number(totalPrice) * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2 })} บาท</Typography>
                                        </Box>
                                        <Divider />
                                    </>
                                */}
                                <CardContent>
                                    <Divider />
                                    <Box sx={{ width: "100%", mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <ReactToPrint
                                            trigger={() => <Button style={{ backgroundColor: "blue", color: "white", fontSize: "16px", width: "40%", marginLeft: "5px", marginBottom: "15px" }}>พิมพ์ใบเสร็จ</Button>}
                                            content={() => printRef.current}
                                        />
                                        <Button style={{ backgroundColor: "grey", color: "white", fontSize: "16px", width: "40%", marginLeft: "5px", marginBottom: "15px" }} onClick={() => handleDownloadImage()}>บันทึกใบเสร็จเป็นรูป</Button>
                                    </Box>
                                    <Grid container justifyContent={"flex-start"} sx={{ mt: 2 }}>
                                        <Grid item>
                                            <Button variant="outlined" onClick={() => onClose()} sx={{ textTransform: "capitalize" }}>
                                                ปิด
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </>
                    }
                </Box>
            </Modal>
            <div ref={printRef} style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between", zIndex: "-1" }}>
                <div ref={pngRef} style={{ width: "370px", fontSize: "14px", position: "fixed", zIndex: "-1" }}>
                    <table style={{ width: "100%" }}>
                        <tr>
                            ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก
                        </tr>
                        <tr>
                            TXID: {txId}
                        </tr>
                        <tr>
                            ใบเสร็จรับเงิน
                        </tr>
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        <tr>
                            <td style={{ textAlign: "left", minWidth: "90px" }}>รายการ</td>
                            <td style={{ textAlign: "right", minWidth: "40px" }}>จำนวน</td>
                            <td style={{ textAlign: "right", minWidth: "50px" }}>ราคา</td>
                            <td style={{ textAlign: "right", minWidth: "50px" }}>ราคารวม</td>
                        </tr>
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        {
                            cart?.map((element) => {
                                let tr_data = <>
                                    <tr>
                                        <td style={{ textAlign: "left", minWidth: "90px" }}>{element.name}</td>
                                        <td style={{ textAlign: "right", minWidth: "40px" }}>{element.qty}</td>
                                        <td style={{ textAlign: "right", minWidth: "50px" }}>{(Number(element.price) / Number(element.qty)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td style={{ textAlign: "right", minWidth: "50px" }}>{Number(element.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                </>
                                return tr_data;
                            })
                        }
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        <tr>
                            <td style={{ textAlign: "left" }}>รวม</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{Number(totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        <tr>
                            <td style={{ textAlign: "left" }}>ส่วนลด</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{value !== null ? value?.sp_detail : 0}%</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "left" }}>สุทธิ</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{value !== null ? Number(Number(totalPrice) - Number(totalPrice) * Number("0.0" + String(value?.sp_detail))).toLocaleString(undefined, { minimumFractionDigits: 2 }) : totalPrice}</td>
                        </tr>
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        <tr>
                            <td style={{ textAlign: "left" }}>เงินทอน</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{Number(0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "left" }}>ชำระด้วย</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{paymentType === "qr" ? "พร้อมเพย์" : "เงินสด"}</td>
                        </tr>
                    </table>
                    -----------------------------------------------------------------------------
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px" }}>
                        <tr>
                            <td style={{ textAlign: "left" }}>พนักงาน</td>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>{user.fname}</td>
                        </tr>
                    </table>
                    <table style={{ width: "100%", paddingLeft: "10px", paddingRight: "10px", marginTop: '50px' }}>
                        <tr>
                            ** วันที่ {moment().format('DD/MM/YYYY HH:mm:ss')} **
                        </tr>
                    </table>
                </div>
            </div>
        </>
    );
};

export default PaymentCard;

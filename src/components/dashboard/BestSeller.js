import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, ListItemAvatar, Typography, Divider, Skeleton } from "@material-ui/core";
import ApiHelper from "../../ApiHelper";
import dayjs from "dayjs";

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const initialFilters = {
    length: 5,
    order: { sort: "desc" },
};

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";

const RecentTransactions = () => {

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState(null);
    const [filters, setFilters] = useState(initialFilters); // eslint-disable-line

    const paymentsRef = useRef(payments);
    const filtersRef = useRef(filters);

    useEffect(() => {
        paymentsRef.current = payments;
    }, [payments]);

    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        if (loading) {

            fetchPayments(filters);
            setLoading(false);
        }
        if (payments == null) {
            setLoading(true);
        }
    }, []); // eslint-disable-line

    const fetchPayments = async (payload = {}) => {

        setLoading(true);
        const last24Hours = dayjs().startOf('month').utc().format(DATE_FORMAT);
        const now = dayjs().utc().format(DATE_FORMAT);
        payload.start = last24Hours;
        payload.end = now;
        payload.type = "bestseller";

        const res = await ApiHelper.getDashboardReport(payload);

        setPayments(res?.data);
        setLoading(false);
    };

    const isLastItem = (index) => index === payments.length - 1;

    return (
        <>
            <Card style={{ borderRadius: "10px" }}>
                <CardHeader title="ขายดีที่สุด" sx={{ "& .MuiCardHeader-action": { alignSelf: "center" } }} />
                <Divider />
                <CardContent sx={{ padding: "0 !important" }}>
                    {payments && Array.isArray(payments) ? (
                        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                            {payments.map((item, index) => (
                                <ListItem key={item?._id} disableGutters divider={!isLastItem(index)} sx={{ px: "16px", py: "0" }}>
                                    <ListItemAvatar sx={{ width: "63px", paddingRight: "15px", color: "green" }}>{"อันดับ " + (Number(index) + 1)}</ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography component="span" variant="h6">
                                                    {item?._id}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    display={"block"}
                                                    variant="body2"
                                                    sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                                >
                                                    จำนวน: {item?.qty} ชิ้น
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemText
                                        sx={{ textAlign: "right", "& .MuiListItemText-primary": { lineHeight: 1 }, minWidth: "132px" }}
                                        primary={
                                            <React.Fragment>
                                                <Typography component="span" variant="h6">
                                                    {parseFloat(item?.sell_price).toLocaleString("th-TH", { style: "currency", currency: "THB" })}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="caption">
                                                    {"กำไร " + parseFloat(item?.profit).toLocaleString("th-TH", { style: "currency", currency: "THB" })}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                            {Array.from({ length: process.env.DASHBOARD_RECENT_LIST_SIZE || 5 }, (_, index) => (
                                <ListItem
                                    key={index}
                                    disableGutters
                                    divider={index !== (process.env.DASHBOARD_RECENT_LIST_SIZE || 5) - 1}
                                    sx={{ px: "16px", py: "0" }}
                                >
                                    <ListItemAvatar sx={{ minWidth: "36px" }}>
                                        <Skeleton variant="circular" width={24} height={24} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Skeleton variant="rounded" width={150} sx={{ mb: 1 }} />
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Skeleton variant="rounded" width={200} />
                                            </React.Fragment>
                                        }
                                    />
                                    <ListItemText
                                        sx={{ textAlign: "right", "& .MuiListItemText-primary": { lineHeight: 1 }, minWidth: "132px" }}
                                        primary={
                                            <React.Fragment>
                                                <Skeleton variant="rounded" width={50} sx={{ ml: "auto", mb: 1 }} />
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Skeleton variant="rounded" width={100} sx={{ ml: "auto" }} />
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default RecentTransactions;

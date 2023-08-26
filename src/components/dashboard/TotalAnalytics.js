import React, { useState, useEffect } from "react";
import { Typography, Stack, Card, CardContent, Grid, Skeleton } from "@material-ui/core";
import PropTypes from "prop-types";
import ApiHelper from "../../ApiHelper";
import { useTheme } from "@mui/material/styles";

import dayjs from "dayjs";

var utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZ";

function TotalCard(props) {
    const { loading, title, children, caption, subtitle, ...other } = props;
    const theme = useTheme();
    return (
        <Card style={{ borderRadius: "10px" }} {...other}>
            <CardContent sx={{ padding: "16px", paddingBottom: "16px !important" }}>
                {!loading ? (
                    <Stack direction="column">
                        <Typography gutterBottom variant="caption" sx={{ textTransform: "uppercase", fontSize: "0.8rem" }}>
                            {title} {subtitle && <span style={{ textTransform: "lowercase", opacity: 0.6 }}>{subtitle}</span>}
                        </Typography>
                        <Typography variant="h4">{children}</Typography>
                        {caption && (
                            <Typography variant="caption" color={theme.palette.primary.main} sx={{ fontWeight: "bold" }}>
                                {caption}
                            </Typography>
                        )}
                    </Stack>
                ) : (
                    <Stack direction="column">
                        <Skeleton variant="text" width={120} height={20} />
                        <Skeleton variant="text" width={240} height={32} />
                        {caption && <Skeleton variant="text" width={100} />}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}

TotalCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string,
    caption: PropTypes.string,
};

const TotalAnalytics = () => {
    const [dashboardReport, setDashboardReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {

            const last24Hours = dayjs().hour(0).minute(0).second(0).millisecond(0).utc().format(DATE_FORMAT);
            const now = dayjs().utc().format(DATE_FORMAT);

            fetchDashboardReport({ start: last24Hours, end: now, type: "recent" });
            setLoading(false);
        }
        if (dashboardReport == null) {
            setLoading(true);
        }
    }, []); // eslint-disable-line

    const fetchDashboardReport = async (payload = {}) => {
        // setLoading(true);

        const res = await ApiHelper.getDashboardReport(payload);

        setDashboardReport(res?.data);
        setLoading(false);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <TotalCard
                    loading={loading && !dashboardReport}
                    title={"ยอดขาย"}
                    subtitle={"(วันนี้)"}
                    children={parseFloat(dashboardReport?.total_sell || 0).toLocaleString("th-TH", { style: "currency", currency: "THB" })}
                    caption={""}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TotalCard
                    loading={loading && !dashboardReport}
                    title={"กำไร"}
                    subtitle={"(วันนี้)"}
                    children={parseFloat(dashboardReport?.total_profit || 0).toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
                    caption={""}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <TotalCard
                    loading={loading && !dashboardReport}
                    title={"จำนวนสินค้าที่ขายไป"}
                    subtitle={"(วันนี้)"}
                    children={String(dashboardReport?.total_qty || 0) + " ชิ้น"}
                    caption={""}
                />
            </Grid>
        </Grid>
    );
};

export default TotalAnalytics;

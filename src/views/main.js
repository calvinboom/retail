import React from "react";
import { Helmet } from "react-helmet";
import { Box, Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import TotalAnalytics from "../components/dashboard/TotalAnalytics";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import BestSeller from "../components/dashboard/BestSeller";
import BestProfit from "../components/dashboard/BestProfit";
import OutOfStock from "../components/dashboard/OutOfStock";
import ExpiryItems from "../components/dashboard/ExpiryItems";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "32px",
    },
}));

const Dashboard = () => {
    const classes = useStyles();

    return (
        <>
            <Helmet>
                <title>หน้าหลัก | ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</title>
            </Helmet>

            <Box className={classes.root}>
                <TotalAnalytics />
                <Grid container spacing={2} sx={{ mt: 0.75 }}>
                    <Grid item xs={12} md={6}>
                        <RecentTransactions />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <BestSeller />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <BestProfit />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <OutOfStock />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <ExpiryItems />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;

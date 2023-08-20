import React from "react";
import { Helmet } from "react-helmet";
import { Box, Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";
import TotalAnalytics from "../components/dashboard/TotalAnalytics";
import RecentTransactions from "../components/dashboard/RecentTransactions";
//import RecentPayouts from "../components/dashboard/RecentPayouts";

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
                        {/*<RecentPayouts />*/}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;

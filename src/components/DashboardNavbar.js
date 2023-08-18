import React from "react";
// import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { AppBar, Box, Hidden, IconButton, Toolbar, Typography } from "@material-ui/core";
import Logo from "./Logo";
import MenuIcon from "@material-ui/icons/Menu";
import InputIcon from "@material-ui/icons/Input";
// import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/";
    };
    return (
        <AppBar elevation={0} {...rest} sx={{ zIndex: 1000 }}>
            <Toolbar>
                <Hidden lgUp>
                    <IconButton color="inherit" onClick={onMobileNavOpen}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>
                <RouterLink to="/">
                    {/* <Logo /> */}
                    <Logo style={{ width: "85px", filter: "none", display: "flex", justifyContent: "center" }} />
                </RouterLink>
                <Typography sx={{ ml: 1 }}>ระบบบริหารจัดการร้านค้าปลีกขนาดเล็ก</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton color="inherit">
                    <InputIcon onClick={handleLogout} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

DashboardNavbar.propTypes = {
    onMobileNavOpen: PropTypes.func,
};

export default DashboardNavbar;

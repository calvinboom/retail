import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Hidden, List, Typography } from "@material-ui/core";
import NavItem from "./NavItem";
import ApiHelper from '../ApiHelper';
import menuSidebarItems from "./menu-items";

const menuItems = menuSidebarItems;

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (openMobile === false) {
            onMobileClose();
        }
    }, [location.pathname, openMobile, onMobileClose]);

    useEffect(() => {
        if (userData == null) {
            fetchUser({ id: user.id });
        }
    }, []); // eslint-disable-line

    const fetchUser = async (payload = {}) => {
        const res = await ApiHelper.getUser(payload);
        setUserData(res?.data);
    };

    const content = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                }}
            >
                <Typography color="textPrimary" variant="h5">
                    ผู้ใช้งาน
                </Typography>
                <Typography color="textSecondary" variant="body2" sx={{ textTransform: "capitalize" }}>
                    {`${user?.fname} ${user?.lname}`}
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
                <List>
                    {menuItems.map((item) => {
                        if(userData != null){
                            let findRole = (item.role.indexOf(userData.role) > -1);
                            if(findRole){
                                return <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />;
                            }
                        }
                    })}
                </List>
            </Box>
        </Box>
    );

    return (
        <>
            <Hidden lgUp>
                <Drawer
                    anchor="left"
                    onClose={onMobileClose}
                    open={openMobile}
                    variant="temporary"
                    PaperProps={{
                        sx: {
                            width: 230,
                            borderTopRightRadius: "15px",
                            borderBottomRightRadius: "15px",
                        },
                    }}
                >
                    {content}
                </Drawer>
            </Hidden>
            <Hidden lgDown>
                <Drawer
                    anchor="left"
                    open
                    variant="persistent"
                    PaperProps={{
                        sx: {
                            width: 230,
                            top: 69,
                            height: "calc(100% - 64px)",
                            borderTopRightRadius: "15px",
                            borderBottomRightRadius: "15px",
                        },
                    }}
                >
                    {content}
                </Drawer>
            </Hidden>
        </>
    );
};

DashboardSidebar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
    onMobileClose: () => {},
    openMobile: true,
};

export default DashboardSidebar;

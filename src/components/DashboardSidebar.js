import React, { useEffect } from "react";
import { Link as RouterLink, useLocation, matchPath } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Divider, Drawer, Hidden, List, Typography } from "@material-ui/core";
import NavItem from "./NavItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import InboxIcon from "@mui/icons-material/MoveToInbox";

import menuSidebarItems from "./menu-items";

const menuItems = menuSidebarItems;

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleClick = () => {
        setOpen(!open);
    };

    const isActive = (href) => {
        const active = href
            ? !!matchPath(
                  {
                      path: href,
                      end: false,
                  },
                  location.pathname
              )
            : false;
        if (active) {
            return "#000000";
        } else {
            return "#668fbe";
        }
    };

    useEffect(() => {
        if (openMobile === false) {
            onMobileClose();
        }
    }, [location.pathname, openMobile, onMobileClose]);

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
                            if (item.items !== undefined)
                                return (
                                    <>
                                        <ListItemButton onClick={handleClick} style={{ padding: "10px 7px" }}>
                                            <ListItemIcon style={{ minWidth: "29px" }}>
                                                <InboxIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography type="body2" style={{ fontSize: "14px", color: "#6b778c" }}>
                                                        {item.title}
                                                    </Typography>
                                                }
                                            />
                                            {open ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {item.items.map((submenu) => {
                                                    return (
                                                        <ListItemButton sx={{ pl: 4 }} component={RouterLink} to={submenu.href}>
                                                            <ListItemIcon style={{ minWidth: "29px" }}>
                                                                <StarBorder />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                disableTypography
                                                                primary={
                                                                    <Typography type="body3" style={{ fontSize: "14px", color: isActive(submenu.href) }}>
                                                                        {submenu.title}
                                                                    </Typography>
                                                                }
                                                            />
                                                        </ListItemButton>
                                                    );
                                                })}
                                            </List>
                                        </Collapse>
                                    </>
                                );
                            else return <NavItem href={item.href} key={item.title} title={item.title} icon={item.icon} />;
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

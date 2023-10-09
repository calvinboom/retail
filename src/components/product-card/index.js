import { Card, ImageListItem, ImageListItemBar, Badge } from "@mui/material";
import React, { useState } from 'react';
import { withSwal } from "react-sweetalert2";

const ProductCard = (props) => {
    let { swal, items, updateCart, cart } = props;

    return (
        <>
            {
                items.map((i) => {
                    let name = i.name;
                    let img = i.image;
                    let price = i.sell_price;
                    let prod_id = i.shortid;
                    let qty = i.qty;
                    if (img === null) img = "/static/no-img.png";
                    let filter_item = cart?.filter((element) => element.prod_id === prod_id);
                    return (
                        <ImageListItem key={img} sx={{ maxHeight: 270 }}
                            onClick={() => (Number(qty) - Number(filter_item[0]?.qty) <= 0) || qty == 0
                                ? 
                                    swal.fire({
                                        title: 'เกิดข้อผิดพลาด',
                                        text: 'จำนวนสินค้าคงเหลือ 0',
                                        icon: 'error',
                                    })
                                :   updateCart(i)
                            }
                        >
                            <img
                                src={`${img}?w=180&fit=crop&auto=format`}
                                srcSet={`${img}?w=180&fit=crop&auto=format&dpr=2 2x`}
                                alt={name}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={name}
                                subtitle={"คงเหลือ "+ qty + " ราคา " + price + " บาท"}
                                actionIcon={
                                    (filter_item.length !== 0) && <Card style={{ borderRadius: "15px", width: "35px", marginRight: '5px', textAlign: "center", backgroundColor: "red", color: "white" }}>{filter_item[0].qty}</Card>
                                }
                            />
                        </ImageListItem>
                    )
                })
            }
        </>
    );

};

export default withSwal(ProductCard);
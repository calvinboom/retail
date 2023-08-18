import { Card, Grid, ImageListItem, ImageListItemBar, Badge } from "@mui/material";
import styles from "./product-card.module.css";
import React, { useEffect, useState } from 'react';

const ProductCard = (props) => {
    let { items, updateCart, cart } = props;

    return (
        <>
            {
                items.map((i) => {
                    let name = i.name;
                    let img = i.image;
                    let price = i.price;
                    let prod_id = i.shortid;
                    if (img === null) img = "/static/no-img.png";
                    let filter_item = cart?.filter((element) => element.prod_id === prod_id);
                    return (
                        <ImageListItem key={img} sx={{ maxHeight: 270 }} onClick={() => updateCart(i)}>
                            <img
                                src={`${img}?w=180&fit=crop&auto=format`}
                                srcSet={`${img}?w=180&fit=crop&auto=format&dpr=2 2x`}
                                alt={name}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={name}
                                subtitle={"ราคา " + price + " บาท"}
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

export default ProductCard;
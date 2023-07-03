import React, { useState } from 'react';
import { Card, Box, Grid, TextField, MenuItem } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import { Helmet } from 'react-helmet';

const initialFilters = {
  field: "all",
  keyword: "",
};

export default function Profile() {
  const [filters, setFilters] = useState(initialFilters);
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Helmet>
        <title>Profile | Retail system POS Project</title>
      </Helmet>
      <Box style={{ padding: "32px", height: '83vh' }}>
        <Box component="form" noValidate autoComplete="off" mb={2}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={2}>
              <TextField
                id="field-select"
                size="small"
                select
                label="ชนิดสินค้า"
                fullWidth
                value={filters?.field}
                style={{ background: 'white' }}
                onChange={(e) => setFilters({ ...filters, field: e.target.value })}
              >
                <MenuItem value={"all"}>ทั้งหมด</MenuItem>
                <MenuItem value={"sweet"}>ขนม</MenuItem>
                <MenuItem value={"drinks"}>เครื่องดื่ม</MenuItem>
                <MenuItem value={"others"}>อื่นๆ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={10}>
              <TextField
                id="keyword-text"
                size="small"
                label="ค้นหา name/serial/barcode"
                fullWidth
                value={filters?.keyword}
                style={{ background: 'white' }}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              ></TextField>
            </Grid>
          </Grid>
        </Box>
        <Card>
          <CardContent>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
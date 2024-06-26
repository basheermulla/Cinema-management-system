import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';

// material-ui
import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'utils/constant-theme';

const ChartHistory = ({ data, theme, user }) => {
    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    {data && data.map((date, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6}>
                                <Card
                                    sx={{
                                        display: 'inline-block',
                                        float: 'right',
                                        bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.grey.light
                                    }}
                                >
                                    <CardContent sx={{ p: 0.5, pb: '2px !important', width: 'fit-content', ml: 'auto' }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <Chip label={Object.keys(date)} size="small"
                                                    sx={{
                                                        background:
                                                            theme.palette.mode === 'dark'
                                                                ? theme.palette.dark.main
                                                                : theme.palette.primary.light,
                                                        color: theme.palette.secondary.dark,
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {Object.values(date)[0].map((history, index) => (
                                <React.Fragment key={index}>
                                    {history.sender !== user.user?.id ? (
                                        <Grid item xs={12}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs={2} />
                                                <Grid item xs={10}>
                                                    <Card
                                                        sx={{
                                                            display: 'inline-block',
                                                            float: 'right',
                                                            bgcolor: theme.palette.mode === 'dark' ? 'grey.600' : theme.palette.primary.light
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 2, pb: '16px !important', width: 'fit-content', ml: 'auto' }}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <Typography variant="body2" color={theme.palette.mode === 'dark' ? 'dark.900' : ''}>
                                                                        {history.content}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography
                                                                        align="right"
                                                                        variant="subtitle2"
                                                                        color={theme.palette.mode === 'dark' ? 'dark.900' : ''}
                                                                    >
                                                                        {new Date(history.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Grid container spacing={gridSpacing}>
                                                <Grid item xs={12} sm={7}>
                                                    <Card
                                                        sx={{
                                                            display: 'inline-block',
                                                            float: 'left',
                                                            background:
                                                                theme.palette.mode === 'dark' ? theme.palette.dark[900] : theme.palette.secondary.light
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 2, pb: '16px !important' }}>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <Typography variant="body2">{history.content}</Typography>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <Typography align="right" variant="subtitle2">
                                                                        {new Date(history.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </Grid>
            </Grid>
        </>
    )
}

ChartHistory.propTypes = {
    theme: PropTypes.object,
    data: PropTypes.array,
    user: PropTypes.object
};

export default ChartHistory;

// material-ui
import { Box, Card, CardContent, Divider, Grid, Paper, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// internal imports
import { gridSpacing } from 'utils/constant-theme';

const RecommendedPlaceholder = () => (
    <Card>

        <CardContent>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    <Grid item xs={2} sm={4} md={4}>
                        <Grid container direction="column" component={Paper} elevation={1} sx={{ p: 2, height: "315px" }}>
                            <Grid item>
                                <Skeleton variant="rectangular" height={30} width={80} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Divider sx={{ mb: 2.5 }} />
                            </Grid>
                            <Grid item display="grid" sx={{ justifyContent: 'center' }} >
                                <Skeleton variant="circular" width={75} height={75} style={{textAlign: "center"}} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item display="grid" sx={{ justifyContent: 'center' }}>
                                <Skeleton variant="rectangular" height={25} width={200} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rectangular" height={25} width={80} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rounded" height={45} sx={{ mb: 1.5 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                        <Grid container direction="column" component={Paper} elevation={1} sx={{ p: 2, height: "215px" }}>
                            <Grid item>
                                <Skeleton variant="rectangular" height={30} width={80} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Divider sx={{ mb: 2.5 }} />
                            </Grid>
                            <Grid item sx={{ mb: 2 }}>
                                <Grid container alignItems="start">
                                    <Grid item sx={{ pr: 1 }}>
                                        <Skeleton variant="rounded" height={42} width={42} />
                                    </Grid>
                                    <Grid item xs>
                                        <Skeleton variant="rounded" height={42} width={200} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <Grid container alignItems="start">
                                    <Grid item sx={{ pr: 1 }}>
                                        <Skeleton variant="rounded" height={42} width={42} />
                                    </Grid>
                                    <Grid item xs>
                                        <Skeleton variant="rounded" height={42} width={200} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2} sm={4} md={4}>
                        <Grid container direction="column" component={Paper} elevation={1} sx={{ p: 2, height: "315px" }}>
                            <Grid item>
                                <Skeleton variant="rectangular" height={30} width={80} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Divider sx={{ mb: 2.5 }} />
                            </Grid>
                            <Grid item display="grid" sx={{ justifyContent: 'center' }} >
                                <Skeleton variant="circular" width={75} height={75} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item display="grid" sx={{ justifyContent: 'center' }}>
                                <Skeleton variant="rectangular" height={25} width={200} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rectangular" height={25} width={80} sx={{ mb: 1.5 }} />
                            </Grid>
                            <Grid item>
                                <Skeleton variant="rounded" height={45} sx={{ mb: 1.5 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </CardContent>
    </Card >
);

export default RecommendedPlaceholder;

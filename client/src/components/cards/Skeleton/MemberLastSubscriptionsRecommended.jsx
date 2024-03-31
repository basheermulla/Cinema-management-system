// material-ui
import { Box, Card, CardContent, Divider, Grid, Paper, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// internal imports
import SubCard from 'components/cards/SubCard';
import { gridSpacing } from 'utils/constant-theme';

const MemberLastSubscriptionsRecommended = () => (
    <SubCard>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container direction="column">
                    <Grid item>
                        <Skeleton variant="rectangular" height={20} width={80} sx={{ mb: 2.3 }} />
                    </Grid>
                    <Grid item>
                        <Divider sx={{ mb: 2.5 }} />
                    </Grid>
                    <Grid item sx={{ mb: 3 }}>
                        <Grid container alignItems="start">
                            <Grid item sx={{ pr: 1 }}>
                                <Skeleton variant="rounded" height={50} width={50} />
                            </Grid>
                            <Grid item xs>
                                <Skeleton variant="rounded" height={50} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sx={{ mb: 3 }}>
                        <Grid container alignItems="start">
                            <Grid item sx={{ pr: 1 }}>
                                <Skeleton variant="rounded" height={50} width={50} />
                            </Grid>
                            <Grid item xs>
                                <Skeleton variant="rounded" height={50} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <Grid container alignItems="start">
                            <Grid item sx={{ pr: 1 }}>
                                <Skeleton variant="rounded" height={50} width={50} />
                            </Grid>
                            <Grid item xs>
                                <Skeleton variant="rounded" height={50} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </SubCard >
);

export default MemberLastSubscriptionsRecommended;

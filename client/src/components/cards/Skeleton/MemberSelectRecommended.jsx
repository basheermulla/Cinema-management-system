// material-ui
import { Box, Card, CardContent, Divider, Grid, Paper, Stack } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// internal imports
import SubCard from 'components/cards/SubCard';
import { gridSpacing } from 'utils/constant-theme';

const MemberSelectRecommended = () => (
    <SubCard>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container direction="column">
                    <Grid item>
                        <Skeleton variant="rectangular" height={20} width={100} sx={{ mb: 2.3 }} />
                    </Grid>
                    <Grid item>
                        <Divider sx={{ mb: 2.5 }} />
                    </Grid>
                    <Grid item display="grid" sx={{ justifyContent: 'center' }} >
                        <Skeleton variant="circular" width={75} height={75} style={{ textAlign: "center" }} sx={{ mb: 1.8 }} />
                    </Grid>
                    <Grid item display="grid" sx={{ justifyContent: 'center' }}>
                        <Skeleton variant="rectangular" height={25} width={200} sx={{ mb: 1 }} />
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rectangular" height={32} width={80} sx={{ mb: 1.5 }} />
                    </Grid>
                    <Grid item>
                        <Skeleton variant="rounded" height={45} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </SubCard >
);

export default MemberSelectRecommended;

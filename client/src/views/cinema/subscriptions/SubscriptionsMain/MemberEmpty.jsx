// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, CardMedia, Grid, Typography } from '@mui/material';

// internal imports
import { gridSpacing } from 'utils/constant-theme';

// assets
import mamberEmpty from 'assets/images/maintenance/empty.svg';
import mamberDarkEmpty from 'assets/images/maintenance/empty-dark.svg';

const MovietEmpty = () => {
    const theme = useTheme();

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Box sx={{ maxWidth: 720, m: '0 auto', textAlign: 'center' }}>
                    <Grid container justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <CardMedia
                                component="img"
                                image={theme.palette.mode === 'dark' ? mamberDarkEmpty : mamberEmpty}
                                title="Slider5 image"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Typography variant="h1" color="inherit" component="div">
                                        There is no Members
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">Your access time may have expired !</Typography>
                                    <Typography variant="body2">Please, Please login again or contact the administrator.</Typography>

                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
};

export default MovietEmpty;
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import AmountMoviesCardSkeleton from 'components/cards/Skeleton/AmountMoviesCardSkeleton';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import TheatersIcon from '@mui/icons-material/Theaters';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                : theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(140.9deg, ${theme.palette.secondary.dark} -14.02%, rgba(144, 202, 249, 0) 85.50%)`
                : theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

const AmountMoviesCard = ({ isLoading, movies }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <AmountMoviesCardSkeleton />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor:
                                                    theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                        >
                                            <TheatersIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>                                    
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {movies?.length}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.secondary[200],
                                                color: theme.palette.secondary.dark
                                            }}
                                        >
                                            <LiveTvIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : theme.palette.secondary[200]
                                    }}
                                >
                                    Amount Of Movies
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

AmountMoviesCard.propTypes = {
    isLoading: PropTypes.bool,
    movies: PropTypes.array
};

export default AmountMoviesCard;
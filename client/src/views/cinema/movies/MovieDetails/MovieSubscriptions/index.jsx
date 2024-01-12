import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Typography } from '@mui/material';

// project imports
import SubscriptionList from './SubscriptionList';
import MainCard from 'components/cards/MainCard';
import { gridSpacing } from 'utils/constant-theme';

// assets
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

const MovieSubscriptions = ({ movie }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        console.log(movie);
    }, [])


    return (
        <MainCard title="Subscriptions Watched" content={false}>

            <SubscriptionList movie={movie} />
            
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination count={10} color="primary" />
                    </Grid>
                    <Grid item>
                        <Button
                            size="large"
                            sx={{ color: theme.palette.grey[900] }}
                            color="secondary"
                            endIcon={<ExpandMoreRoundedIcon />}
                            onClick={handleClick}
                        >
                            10 Rows
                        </Button>
                        {anchorEl && (
                            <Menu
                                id="menu-user-list-style1"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                variant="selectedMenu"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                            >
                                <MenuItem onClick={handleClose}> 10 Rows</MenuItem>
                                <MenuItem onClick={handleClose}> 20 Rows</MenuItem>
                                <MenuItem onClick={handleClose}> 30 Rows </MenuItem>
                            </Menu>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    )
}

MovieSubscriptions.propTypes = {
    movie: PropTypes.object
}

export default MovieSubscriptions
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, ButtonBase, CardContent, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';

// project imports
import SubCard from 'components/cards/SubCard';
import Chip from 'components/extended/Chip';
import { gridSpacing } from 'utils/constant-theme';

// assets
import CloseIcon from '@mui/icons-material/Close';

const MovieFilterView = ({ filter, filterIsEqual, handelFilter, initialState }) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            {!filterIsEqual(initialState, filter) && (
                <Grid container spacing={gridSpacing} sx={{ pb: gridSpacing }} alignItems="center">
                    {!(initialState.search === filter.search) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Chip
                                                size={matchDownMD ? 'small' : undefined}
                                                label={filter.search}
                                                chipcolor="secondary"
                                                onDelete={() => handelFilter('search', '')}
                                                sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(initialState.sort === filter.sort) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Sort</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                size={matchDownMD ? 'small' : undefined}
                                                label={filter.sort}
                                                chipcolor="secondary"
                                                onDelete={() => handelFilter('sort', initialState.sort)}
                                                sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(JSON.stringify(initialState.type) === JSON.stringify(filter.type)) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Type</Typography>
                                        </Grid>

                                        {filter.type.map((item, index) => {
                                            let color = 'secondary';
                                            if (item === 'Reality') color = 'primary';
                                            if (item === 'Animation') color = 'error';
                                            return (
                                                <Grid item key={index}>
                                                    <Chip
                                                        size={matchDownMD ? 'small' : undefined}
                                                        label={item}
                                                        onDelete={() => handelFilter('type', item)}
                                                        chipcolor={color}
                                                        sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(JSON.stringify(initialState.genres) === JSON.stringify(filter.genres)) && filter.genres.length > 0 && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Genres</Typography>
                                        </Grid>
                                        {filter.genres.map((item, index) => (
                                            <Grid item key={index}>
                                                <Chip
                                                    size={matchDownMD ? 'small' : undefined}
                                                    label={item}
                                                    onDelete={() => handelFilter('genres', item)}
                                                    chipcolor="secondary"
                                                    sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(JSON.stringify(initialState.language) === JSON.stringify(filter.language)) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Language</Typography>
                                        </Grid>
                                        {filter.language.map((item, index) => {
                                            let color = 'secondary';
                                            if (item === 'male') color = 'primary';
                                            if (item === 'kids') color = 'error';
                                            return (
                                                <Grid item key={index}>
                                                    <Chip
                                                        size={matchDownMD ? 'small' : undefined}
                                                        label={item}
                                                        onDelete={() => handelFilter('language', item)}
                                                        chipcolor={color}
                                                        sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                                    />
                                                </Grid>
                                            );
                                        })}                                        
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(initialState.premiered === filter.premiered) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Premiered</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                size={matchDownMD ? 'small' : undefined}
                                                label={filter.premiered}
                                                chipcolor="primary"
                                                sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    {!(initialState.rating === filter.rating) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Typography variant="subtitle1">Rating</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Chip
                                                size={matchDownMD ? 'small' : undefined}
                                                label={String(filter.rating)}
                                                chipcolor="warning"
                                                onDelete={() => handelFilter('rating', '', 0)}
                                                sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </SubCard>
                        </Grid>
                    )}
                    <Grid item>
                        <Button variant="outlined" startIcon={<CloseIcon />} color="error" onClick={() => handelFilter('reset', '')}>
                            Clear All
                        </Button>
                    </Grid>
                </Grid>
            )}
        </>
    )
}

MovieFilterView.propTypes = {
    filter: PropTypes.object,
    filterIsEqual: PropTypes.func,
    initialState: PropTypes.object,
    handelFilter: PropTypes.func
}

export default MovieFilterView;
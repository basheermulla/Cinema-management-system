import PropTypes from 'prop-types';

// material-ui
import { Button, ButtonBase, CardContent, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import SubCard from 'components/cards/SubCard';
import Chip from 'components/extended/Chip';
import { gridSpacing } from 'utils/constant-theme';

// assets
import CloseIcon from '@mui/icons-material/Close';

const MovieFilterView = ({ filter, filterSearchAndSort, filterIsEqual, filterSearchAndSortIsEqual, handelFilter, initialState, initialSearchAndSort}) => {
    const theme = useTheme();
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <> 
            {(!filterIsEqual(initialState, filter) || !filterSearchAndSortIsEqual(initialSearchAndSort, filterSearchAndSort)) && (
                <Grid container spacing={gridSpacing} sx={{ pb: gridSpacing }} alignItems="center">
                    {!(initialSearchAndSort.search === filterSearchAndSort.search) && (
                        <Grid item>
                            <SubCard content={false}>
                                <CardContent sx={{ pb: '12px !important', p: 1.5 }}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item>
                                            <Chip
                                                size={matchDownMD ? 'small' : undefined}
                                                label={filterSearchAndSort.search}
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
                    {!(initialSearchAndSort.sort === filterSearchAndSort.sort) && (
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
                                                label={filterSearchAndSort.sort}
                                                chipcolor="secondary"
                                                onDelete={() => handelFilter('sort', initialSearchAndSort.sort)}
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
    filterSearchAndSort: PropTypes.object,
    filterIsEqual: PropTypes.func,
    filterSearchAndSortIsEqual: PropTypes.func,
    handelFilter: PropTypes.func,
    initialState: PropTypes.object,
    initialSearchAndSort: PropTypes.object
}

export default MovieFilterView;
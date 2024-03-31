import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, CardMedia, Divider, Grid, Rating, Stack, Typography } from '@mui/material';

// third-party
import { format } from 'date-fns';

// project imports
import MainCard from './MainCard';
import SubCard from './SubCard';
import AnimateButton from 'components/extended/AnimateButton';

// assets
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import { IconMovie, IconWorld, IconSquareRoundedPlusFilled, IconCircleLetterG, IconCalendarClock } from '@tabler/icons-react';


const MovieDescriptionCard = ({ id, name, genres, image, type, language, summary, premiered, rating, removeMovie }) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const stripHtmlTags = (input) => {
        const regex = /(<([^>]+)>)/gi;
        const newString = input.replace(regex, "");
        return newString;
    }

    const [number, setNumber] = useState(rating)

    const handleDelete = () => {
        removeMovie(id);
    }

    return (
        <MainCard
            sx={{
                p: 2,
                background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100],
            }}
        >
            <Grid container layout={'row'} spacing={2}>
                <Grid item xs={12} md={5} lg={4}>
                    <SubCard>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <CardMedia

                                component="img"
                                src={image.original}
                                title="Movie's image"
                            />
                        </Stack>
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={7} lg={8}>
                    <SubCard sx={{ height: '100%' }}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography
                                    variant="h1"
                                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                >
                                    {name}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Typography
                                    variant="h4"
                                    sx={{ color: 'grey.500' }}
                                >
                                    {format(new Date(premiered), 'E, MMM d yyyy')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Grid container direction="row" alignItems="center" sx={{ color: 'grey.500' }}>
                                    <Rating
                                        size="large"
                                        name="simple-controlled"
                                        value={number}
                                        max={10}
                                        icon={<StarTwoToneIcon fontSize="inherit" />}
                                        emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
                                        precision={0.1}
                                        readOnly
                                    />
                                    <Typography variant="h4" sx={{ color: 'grey.500' }}> &nbsp;({rating}) </Typography>

                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 3 }}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 3 }}>
                                <Grid container direction="row" justifyContent="left" alignItems="center" sx={{ color: 'grey.500' }}>
                                    <IconMovie size={20} stroke={2} />
                                    <Typography variant="h4">&nbsp;   {type} </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{ mb: 3 }}>
                                <Grid item><IconCircleLetterG size={20} stroke={2} /></Grid>
                                {
                                    genres.map((genre, index) => (
                                        <Grid key={index} item>
                                            <Typography variant="h4">
                                                {genre}
                                            </Typography>

                                        </Grid>)
                                    )
                                }
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 3 }}>
                                <Grid container direction="row" justifyContent="left" alignItems="center">
                                    <IconWorld size={20} stroke={2} />
                                    <Typography variant="h4"> &nbsp;{language}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ lineHeight: 2, fontSize: 16 }} >{stripHtmlTags(summary)}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 4 }}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <AnimateButton>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            color="error"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </AnimateButton>
                                    <AnimateButton>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </Button>
                                    </AnimateButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid >
        </MainCard >
    );
};

MovieDescriptionCard.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    genres: PropTypes.array,
    image: PropTypes.object,
    type: PropTypes.string,
    language: PropTypes.string,
    summary: PropTypes.string,
    premiered: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
    ]).isRequired,
    rating: PropTypes.number,
    removeMovie: PropTypes.func
};

export default MovieDescriptionCard;
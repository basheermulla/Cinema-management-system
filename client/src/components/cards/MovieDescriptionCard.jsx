import PropTypes from 'prop-types';
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


const MovieDescriptionCard = ({ id, name, genres, image, type, language, summary, premiered, rating, removeMovie }) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const stripHtmlTags = (input) => {
        const regex = /(<([^>]+)>)/gi;
        const newString = input.replace(regex, "");
        return newString;
    }

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
            <Grid container spacing={2}>

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
                    <SubCard>
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
                                <Rating
                                    size="large"
                                    name="simple-controlled"
                                    value={rating < 4 ? rating + 1 : rating}
                                    icon={<StarTwoToneIcon fontSize="inherit" />}
                                    emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
                                    precision={0.1}
                                    readOnly
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 1 }}>
                                <Divider />
                            </Grid>
                            <Grid container spacing={1} sx={{ mb: 1 }}>
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
                            <Grid container spacing={1} sx={{ mb: 2 }}>
                                <Grid item>
                                    <Typography variant="h4" sx={{ color: 'grey.500' }}>{type}, </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h4" sx={{ color: 'grey.500' }}>{' ' + language}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ mb: 4 }}>
                                <Typography variant="p">{stripHtmlTags(summary)}</Typography>
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
            </Grid>

        </MainCard>
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
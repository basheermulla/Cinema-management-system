import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { Avatar, Grid, Typography, Autocomplete, TextField } from '@mui/material';

// internal imports
import SubCard from 'components/cards/SubCard';
import SkeletonMemberSelectRecommended from 'components/cards/Skeleton/MemberSelectRecommended';

const SelectedMember = ({ isLoading, member, optionsFilms, handleAutocomplete }) => {

    // Default value
    const defaultValue = { label: member.name, _id: member._id };

    // Function to get the label for an option
    const getOptionLabel = (option) => option.label;

    // Custom equality check function
    const isOptionEqualToValue = (option, value) => option._id === value._id;

    return (
        <>
            {isLoading ? (
                <SkeletonMemberSelectRecommended />
            ) : (
                <SubCard title="Selected Member">
                    <Grid container direction="column" spacing={3}>
                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Avatar alt="User 1" src={member.image} sx={{ width: 75, height: 75, margin: '0 auto' }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" align="center">
                                        <Typography
                                            component={Link}
                                            to={`/cinema/subscriptions/member-profile/${member._id}`}
                                            variant="subtitle1"
                                            color="primary"
                                            sx={{ textDecoration: 'none' }}
                                        >
                                            {member.name}
                                        </Typography>
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle2" align="left" mb={0.5}>
                                Choose member:
                            </Typography>
                            {member && member._id && (
                                <Autocomplete
                                    disableClearable
                                    onChange={(e, value) => {
                                        handleAutocomplete(value)
                                    }}
                                    value={defaultValue}
                                    options={optionsFilms}
                                    getOptionLabel={getOptionLabel}
                                    isOptionEqualToValue={isOptionEqualToValue} // Customize equality check
                                    renderInput={(params) => <TextField {...params} label="" />}

                                />)}
                        </Grid>
                    </Grid>
                </SubCard>
            )}
        </>
    );
};

SelectedMember.propTypes = {
    isLoading: PropTypes.bool,
    member: PropTypes.object,
    optionsFilms: PropTypes.array,
    handleAutocomplete: PropTypes.func
};

export default SelectedMember;

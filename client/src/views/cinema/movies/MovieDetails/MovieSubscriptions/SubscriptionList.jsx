import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// third-party
import { format } from 'date-fns';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star'

// internal imports
import Avatar from 'components/extended/Avatar';
import { useDispatch } from 'store';


const SubscriptionList = ({ movie }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(movie?.subscriptionWatched);
        // console.log(data);
        // console.log(movie);
    }, []);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>User Profile</TableCell>
                        <TableCell>City</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}> Watched date </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                                <TableCell>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar alt="User 1" src={row.image} />
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <Typography align="left" variant="subtitle1" component="div">
                                                <Typography
                                                    component={Link}
                                                    to={`/cinema/subscriptions/member-profile/${row.memberId}`}
                                                    variant="subtitle1"
                                                    color="primary"
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    {row.name}
                                                </Typography>
                                            </Typography>
                                            <Typography align="left" variant="subtitle2" noWrap>
                                                {row.email}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>
                                    <List
                                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                        aria-label="contacts"
                                    >
                                        {row.dates.map((date, index) => (
                                            < ListItem disablePadding key={index}>
                                                <ListItemButton>
                                                    <ListItemIcon>
                                                        <StarIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={
                                                        <Typography> {format(new Date(date), 'E, MMM d yyyy')}</Typography>
                                                    } />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer >

    )
}

SubscriptionList.propTypes = {
    movie: PropTypes.object
}

export default SubscriptionList
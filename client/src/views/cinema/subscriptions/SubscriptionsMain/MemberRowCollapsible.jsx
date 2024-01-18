import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar, Box, ButtonBase, Collapse, Icon, IconButton, ListItemIcon, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip,
    Typography
} from '@mui/material';

// internal imports
import SubCard from 'components/cards/SubCard';
import { CSVExport } from '../MemberExports';
import { header } from '../HeaderOptions';
import SecondaryAction from 'components/cards/CardSecondaryAction';
import AddSubscription from './AddSubscription';

// third-party
import { parseISO } from 'date-fns';

// assets
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteMember from '@mui/icons-material/Delete';
import { IconEditCircle, IconBellPlus } from '@tabler/icons-react';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DoneIcon from '@mui/icons-material/Done';
import { Link } from 'react-router-dom';

function MemberRowCollapsible({ ID, member, handleClickOpenMemberDialog, addSubscription, editSubscription, removeSubscription, removeMember, movies }) {
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const subscriptionsMember_ToExport = [];
    member.relatedMovie.forEach((movie) => {
        subscriptionsMember_ToExport.push({
            ...movie.movie,
            date: movie.date
        });
    });

    // Subscription state for creating new subscription or updating future subscription
    const [subscription, setSubscription] = useState({});

    // open a subscribe dialog alert when clicked [addSubscription Dialog]
    const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

    const handleClickOpenSubscribeDialog = (newUpdateSubscription) => {
        setOpenSubscribeDialog(true);
        setSubscription(newUpdateSubscription)
    };

    const handleCloseSubscribeDialog = () => {
        setSubscription(null);
        setOpenSubscribeDialog(false);
    };

    const handleAddSubscription = (movieId) => {
        removeMovie(member._id, movieId);
    }

    const handleAction = (action) => {
        switch (action) {
            case "addSubscription":
                handleClickOpenSubscribeDialog(null);
                break;
            case "updateMember":
                handleClickOpenMemberDialog(member);
                break;
            case "deleteMember":
                removeMember(member._id);
                break;
            default:
                break;
        }
    }

    return (
        <>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ pl: 3, width: 74 }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {ID}
                </TableCell>
                <TableCell align="right">
                    <Avatar alt={`Member ${ID}`} src={member.image} />
                </TableCell>
                <TableCell align="right">
                    <Typography
                        component={Link}
                        to={`/cinema/subscriptions/member-profile/${member._id}`}
                        variant="subtitle1"
                        color="primary"
                        sx={{ textDecoration: 'none' }}
                    >
                        {member.name}
                    </Typography>
                </TableCell>
                <TableCell align="right">{member.email}</TableCell>
                <TableCell align="right">{member.city}</TableCell>
                <TableCell align="center">
                    {member.relatedMovie[0].date !== undefined ? member.relatedMovie.length : 0}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {open && (
                            <Box sx={{ margin: 1 }}>
                                <TableContainer>
                                    <SubCard
                                        sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50', mb: 2 }}
                                        title="Movies Watched"
                                        content={false}
                                        secondary={
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <SecondaryAction
                                                    title="New Subscribe"
                                                    icon={<IconBellPlus />}
                                                    color="secondary"
                                                    action="addSubscription"
                                                    action_func={handleAction}
                                                />
                                                <SecondaryAction
                                                    title="Edit Member"
                                                    icon={<IconEditCircle />}
                                                    color="info"
                                                    action="updateMember"
                                                    action_func={handleAction}
                                                />
                                                <SecondaryAction
                                                    title="Delete Member"
                                                    icon={<DeleteMember />}
                                                    color="error"
                                                    action="deleteMember"
                                                    action_func={handleAction}
                                                />
                                                {member.relatedMovie[0].date !== undefined && <>
                                                    <CSVExport
                                                        data={subscriptionsMember_ToExport?.map((relatedMovieRow) => relatedMovieRow)}
                                                        filename="collapse-table.csv"
                                                        header={header}
                                                    />
                                                </>}
                                            </Stack>
                                        }
                                    >
                                        <Table size="small" aria-label="purchases">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Image</TableCell>
                                                    <TableCell align="right">Name</TableCell>
                                                    <TableCell align="right">Date</TableCell>
                                                    <TableCell align="right" sx={{ pr: 6 }}>
                                                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                                                            Action
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {member.relatedMovie[0].date !== undefined && member.relatedMovie?.map((relatedMovieRow, index) => (
                                                    <TableRow hover key={index}>
                                                        <TableCell component="th" scope="row">
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Avatar
                                                                alt={`Movie ${index + 1}`}
                                                                src={relatedMovieRow.movie.image.medium}
                                                                sx={{ width: 60, height: 76 }}
                                                                variant="rounded"
                                                            />
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <Typography
                                                                component={Link}
                                                                to={`/cinema/movies/movie-details/${relatedMovieRow.movie._id}`}
                                                                variant="subtitle1"
                                                                color="primary"
                                                                sx={{ textDecoration: 'none' }}
                                                            >
                                                                {relatedMovieRow.movie.name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {new Date(relatedMovieRow.date).toLocaleString("en-US",
                                                                {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: '2-digit'
                                                                })}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ pr: 3 }}>
                                                            {new Date(relatedMovieRow.date).getTime() <= Date.now() ?
                                                                <IconButton color="primary" size="large" aria-label="view">
                                                                    <DoneIcon sx={{ fontSize: '1.3rem' }} />
                                                                </IconButton>
                                                                :
                                                                <>
                                                                    <IconButton color="secondary" onClick={() => removeSubscription(member._id, relatedMovieRow.subscriptionId)} size="large" aria-label="edit">
                                                                        <DeleteMember sx={{ fontSize: '1.3rem' }} color="error" />
                                                                    </IconButton>
                                                                    <IconButton color="secondary" onClick={() => handleClickOpenSubscribeDialog(relatedMovieRow)} size="large" aria-label="edit">
                                                                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                                                    </IconButton>
                                                                </>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </SubCard>
                                </TableContainer>
                            </Box>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
            <AddSubscription
                open={openSubscribeDialog}
                member={member}
                subscription={subscription}
                handleCloseSubscribeDialog={handleCloseSubscribeDialog}
                addSubscription={addSubscription}
                editSubscription={editSubscription}
                movies={movies}
            />
        </>
    );
}

MemberRowCollapsible.propTypes = {
    ID: PropTypes.number,
    member: PropTypes.object,
    handleClickOpenMemberDialog: PropTypes.func,
    addSubscription: PropTypes.func,
    editSubscription: PropTypes.func,
    removeSubscription: PropTypes.func,
    removeMember: PropTypes.func,
    movies: PropTypes.array
};

export default MemberRowCollapsible;
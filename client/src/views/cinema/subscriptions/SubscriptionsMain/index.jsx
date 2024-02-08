import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Collapse, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import SubCard from 'components/cards/SubCard';
import { CSVExport } from '../MemberExports';
import { header } from '../HeaderOptions';
import MemberRowCollapsible from './MemberRowCollapsible';
import SecondaryAction from 'components/cards/CardSecondaryAction';
import AddOrEditMember from './AddOrEditMember';
import MemberEmpty from './MemberEmpty';
import { loader, createSubscription, updateSubscription, deleteSubscription, createMember, updateMember, deleteMember } from 'store/slices/member';
import { gridSpacing } from 'utils/constant-theme';

// assets
import { IconUserPlus, IconRefresh } from '@tabler/icons-react';

const SubscriptionsMain = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const navigete = useNavigate();
    
    // member include subscriptions data & movies
    const initialdata = useLoaderData();
    const [subscriptions, setSubscriptions] = useState(initialdata.members);
    const [movies, setMovies] = useState(initialdata.movies);

    const subscriptionsToExport = [];
    if (subscriptions) {
        subscriptions.forEach((subscription) => {
            subscriptionsToExport.push({
                ...subscription,
                relatedMovie: null
            });
        });
    }

    // Member state for creating new member or updating existing member [(add new member dialog) or (edit member dialog)]
    const [member, setMember] = useState({});

    // open a member dialog alert when clicked [addMember Dialog]
    const [openMemberDialog, setOpenMemberDialog] = useState(false);

    const handleClickOpenMemberDialog = (newOrUpdateMember) => {
        setOpenMemberDialog(true);
        setMember(newOrUpdateMember);
    };

    const handleCloseMemberDialog = () => {
        console.log('Here we update member to null');
        setMember(null);
        setOpenMemberDialog(false);
    };

    const addSubscription = (method, memberId, obj_SubscriptionMovie) => {
        dispatch(createSubscription(method, memberId.id, obj_SubscriptionMovie)).then(() => {
            loadDataAfterAction();
        });
    };

    const editSubscription = (memberId, obj_SubscriptionMovie) => {
        dispatch(updateSubscription(memberId.id, obj_SubscriptionMovie)).then(() => {
            loadDataAfterAction();
        });
    };

    const removeSubscription = (memberId, subscriptionId, action) => {
        dispatch(deleteSubscription(memberId, subscriptionId, action)).then(() => {
            loadDataAfterAction();
        });;
    };

    const addMember = (memberNew) => {
        dispatch(createMember(memberNew)).then(() => {
            loadDataAfterAction();
        });;
    };

    const editMember = (id, memberEdit) => {
        dispatch(updateMember(id, memberEdit)).then(() => {
            loadDataAfterAction();
        });;
    };

    const removeMember = (id) => {
        dispatch(deleteMember(id)).then(() => {
            loadDataAfterAction();
        });;
    };

    const loadDataAfterAction = async () => {
        console.log('refresh');
        const initialdata = await loader();
        setSubscriptions(initialdata.members);
        setMovies(initialdata.movies);
    };

    const handleAction = (action) => {
        switch (action) {
            case "addMember":
                handleClickOpenMemberDialog(null);
                break;
            case "refresh":
                loadDataAfterAction();
                break;
            default:
                break;
        }
    }

    let memberResult = <></>;
    if (subscriptions && subscriptions.length > 0) {
        {
            memberResult = [...subscriptions].sort((a, b) => a.name > b.name ? 1 : -1).map((row_member, index) => (
                <MemberRowCollapsible
                    key={row_member._id}
                    ID={index + 1}
                    member={row_member}
                    handleClickOpenMemberDialog={handleClickOpenMemberDialog}
                    addSubscription={addSubscription}
                    editSubscription={editSubscription}
                    removeSubscription={removeSubscription}
                    removeMember={removeMember}
                    movies={movies}
                />
            ))
        }
    } else {
        memberResult = (
            <TableRow>
                <TableCell colSpan={7}>
                    <MemberEmpty />
                </TableCell>
            </TableRow>
        );
    }

    return (
        <MainCard
            content={false}
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Members Subscriptions</Typography>
                    </Grid>
                </Grid >
            }
            secondary={
                < Stack direction="row" spacing={2} alignItems="center" >
                    {subscriptions && subscriptions.length > 0 ? <>
                        <SecondaryAction
                            title="New Member"
                            icon={<IconUserPlus />}
                            color="primary"
                            action="addMember"
                            action_func={handleAction}
                        />
                        <SecondaryAction
                            title="Refresh"
                            icon={<IconRefresh />}
                            color="success"
                            action="refresh"
                            action_func={handleAction}
                        />
                        <CSVExport data={subscriptionsToExport} filename="basic-table.csv" header={header} />
                    </>
                        :
                        null
                    }
                </Stack >
            }
        >
            {/* table */}
            < TableContainer >
                <Table aria-label="Members Subscriptions">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }} />
                            <TableCell>ID</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">City</TableCell>
                            <TableCell align="center">
                                Subscriptions Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {memberResult}
                    </TableBody>
                </Table>
            </TableContainer >
            <AddOrEditMember open={openMemberDialog} member={member} handleCloseMemberDialog={handleCloseMemberDialog} addMember={addMember} editMember={editMember} />
        </MainCard >
    )
}

export default SubscriptionsMain;
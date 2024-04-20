import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Collapse, Grid, IconButton, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

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
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from "store/slices/snackbar";
import { gridSpacing } from 'utils/constant-theme';
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';

// assets
import { IconUserPlus, IconRefresh } from '@tabler/icons-react';

const SubscriptionsMain = () => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const navigete = useNavigate();

    // userLogin
    const { user: userLogin } = useAuth();

    // member include subscriptions data & movies
    const initialdata = useLoaderData();
    const [subscriptions, setSubscriptions] = useState(initialdata.members);
    const [movies, setMovies] = useState(initialdata.movies);

    const [memberLoading, setMemberLoading] = useState(true);

    useEffect(() => {
        setMemberLoading(false);
    }, []);

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
        setMember(null);
        setOpenMemberDialog(false);
    };

    const addSubscription = (method, memberId, obj_SubscriptionMovie) => {
        setMemberLoading(true);
        dispatch(createSubscription(method, memberId.id, obj_SubscriptionMovie)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
    };

    const editSubscription = (memberId, obj_SubscriptionMovie) => {
        setMemberLoading(true);
        dispatch(updateSubscription(memberId.id, obj_SubscriptionMovie)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
    };

    const removeSubscription = (memberId, subscriptionId, action) => {
        setMemberLoading(true);
        dispatch(deleteSubscription(memberId, subscriptionId, action)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
        dispatch(
            openSnackbar({
                open: true,
                message: 'The subscription has deleted successfully !',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                close: false
            })
        );
    };

    const addMember = (memberNew) => {
        setMemberLoading(true);
        dispatch(createMember(memberNew)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
    };

    const editMember = (id, memberEdit) => {
        setMemberLoading(true);
        dispatch(updateMember(id, memberEdit)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
    };

    const removeMember = (id, name) => {
        setMemberLoading(true);
        dispatch(deleteMember(id)).then(() => {
            loadDataAfterAction();
            setMemberLoading(false);
        });
        dispatch(
            openSnackbar({
                open: true,
                message: 'Member of ' + name + ' deleted successfully !',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                close: false
            })
        );
    };

    const loadDataAfterAction = async () => {
        const initialdata = await loader();
        setSubscriptions(initialdata.members);
        setMovies(initialdata.movies);
    };

    const handleRefresh = (action) => {
        handleAction(action);
        dispatch(
            openSnackbar({
                open: true,
                message: 'Successful refresh !',
                variant: 'alert',
                alert: {
                    color: 'success'
                },
                close: false
            })
        );
    }

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

    // Owner user who have all the permissions [View, Update, Create, Delete] of both subscriptions and movies could add, delete and update a member
    let isOwner = (permissionsUser) => {
        let power = true;
        permissionsUser?.forEach(permission => {
            if (!Object.values(permission)[0]) {
                power = false
            }
        })
        return power;
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
                    isOwnerCallback={isOwner}
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

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (memberLoading) return <Loader />;

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
                        {isOwner(userLogin?.permissionsUser) && <SecondaryAction
                            title="New Member"
                            icon={<IconUserPlus />}
                            color="primary"
                            action="addMember"
                            action_func={handleAction}
                        />}
                        <SecondaryAction
                            title="Refresh"
                            icon={<IconRefresh />}
                            color="success"
                            action="refresh"
                            action_func={handleRefresh}
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
                        {memberLoading
                            ? [1, 2, 3, 4].map((item) => (
                                <TableRow key={item}>
                                    <TableCell colSpan={7}>
                                        <Skeleton variant="rectangular" sx={{ height: "42px" }} />
                                    </TableCell>
                                </TableRow>
                            ))
                            :
                            memberResult}
                    </TableBody>
                </Table>
            </TableContainer >
            <AddOrEditMember open={openMemberDialog} member={member} handleCloseMemberDialog={handleCloseMemberDialog} addMember={addMember} editMember={editMember} />
        </MainCard >
    )
}

export default SubscriptionsMain;
import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Fab, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Skeleton, Stack, TableContainer, Tooltip, Typography } from '@mui/material';

// internal imports
import UsersList from './UsersList';
import MainCard from 'components/cards/MainCard';
import UserEmpty from './UserEmpty';
import { gridSpacing } from 'utils/constant-theme';
import { useDispatch, useSelector } from 'store';
import { loader, createUser, updateUser, deleteUser } from 'store/slices/user';
import { openSnackbar } from "store/slices/snackbar";
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';

// assets
import { IconSearch, IconRefresh } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddIcon from '@mui/icons-material/AddTwoTone';
import CachedIcon from '@mui/icons-material/Cached';

const UsersManagementMain = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // userLogin
    const { user: userLogin } = useAuth();

    // users data
    const initialUsers = useLoaderData();
    const [users, setUsers] = useState(initialUsers);

    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        setUserLoading(false);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removeUser = (userId, fullName) => {
        setUserLoading(true);
        dispatch(deleteUser(userId)).then(() => {
            loadDataAfterAction();
            setUserLoading(false);
        });
        dispatch(
            openSnackbar({
                open: true,
                message: 'User of ' + fullName + ' deleted successfully !',
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
        setUsers(initialdata);
    };

    const handleRefresh = () => {
        loadDataAfterAction();
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

    // Owner user who have all the permissions [View, Update, Create, Delete] of both subscriptions and movies could add, delete and update a user
    let isOwner = (permissionsUser) => {
        let power = true;
        permissionsUser?.forEach(permission => {
            if (!Object.values(permission)[0]) {
                power = false
            }
        })
        return power;
    }

    let userResult = <></>;
    if (users && users.length > 0) {
        {
            userResult = (<UsersList users={users} removeUser={removeUser} userLoading={userLoading} isOwnerCallback={isOwner} />)
        }
    } else {
        userResult = (
            <TableContainer>
                <UserEmpty />
            </TableContainer>
        );
    }

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (userLoading) return <Loader />;

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">Users Management</Typography>
                    </Grid>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                        {isOwner(userLogin?.permissionsUser) && <Grid item>
                            <Tooltip title="Add User">
                                <Fab
                                    color="primary"
                                    size="small"
                                    onClick={() => navigate('/management/users/add-user')}
                                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                >
                                    <AddIcon fontSize="small" />
                                </Fab>
                            </Tooltip>
                        </Grid>}
                        <Grid item>
                            <Tooltip title="Refresh">
                                <Fab
                                    variant="circular"
                                    color="secondary"
                                    size="small"
                                    onClick={handleRefresh}
                                    sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                >
                                    <CachedIcon fontSize="small" />
                                </Fab>
                            </Tooltip>
                        </Grid>
                        {/* <Grid item>
                            <OutlinedInput
                                id="input-search-list-style1"
                                placeholder="Search"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={1.5} size="16px" />
                                    </InputAdornment>
                                }
                                size="small"
                            />
                        </Grid> */}
                    </Stack>
                </Grid >
            }
            content={false}
        >
            {userResult}

            {/* <Grid item xs={12} sx={{ p: 3 }}>
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
            </Grid> */}
        </MainCard >
    );
};

export default UsersManagementMain;
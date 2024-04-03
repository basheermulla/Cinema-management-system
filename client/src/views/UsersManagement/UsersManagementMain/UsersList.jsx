import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Chip, Divider, Grid, IconButton, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, Button
} from '@mui/material';

// internal imports
import Avatar from 'components/extended/Avatar';
import useAuth from 'hooks/useAuth';

// third-party
import { format } from 'date-fns';

// assets
import DeleteMember from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const UsersList = ({ users, removeUser, userLoading, isOwnerCallback }) => {

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [usertoDelete, setUsertoDelete] = useState({ userId: '', fullName: '' });

    const theme = useTheme();

    const navigate = useNavigate();

    // userLogin
    const { user: userLogin } = useAuth();

    const handleDelete = (userId, fullName) => {
        console.log(userId, fullName);
        setUsertoDelete({ userId, fullName });
        setOpenDialog(true);
    }

    const handleDialog = () => {
        setOpenDialog(false);
        removeUser(usertoDelete.userId, usertoDelete.fullName);
        setUsertoDelete({ userId: '', fullName: '' });
    }

    let permissionsResult = <></>;
    const permissionAdapter = (action, model) => {
        switch (action) {
            case 'create':
                return model === 'Subscriptions' ? (
                    <Chip label="Create Subscriptions" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.warning.light,
                            color: theme.palette.warning.dark
                        }}
                    />
                ) : (
                    <Chip label="Create Movies" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.warning.light,
                            color: theme.palette.warning.dark
                        }}
                    />
                )
            case 'update':
                return model === 'Subscriptions' ? (
                    <Chip label="Update Subscriptions" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.secondary.light + 60,
                            color: theme.palette.secondary.dark
                        }}
                    />
                ) : (
                    <Chip label="Update Movies" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.secondary.light + 60,
                            color: theme.palette.secondary.dark
                        }}
                    />
                )
            case 'delete':
                return model === 'Subscriptions' ? (
                    <Chip label="Delete Subscriptions" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.orange.light + 80,
                            color: theme.palette.orange.dark
                        }}
                    />
                ) : (
                    <Chip label="Delete Movies" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.orange.light + 80,
                            color: theme.palette.orange.dark
                        }}
                    />
                )
            default:
                return model === 'Subscriptions' ? (
                    <Chip label="View Subscriptions" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.success.light + 60,
                            color: theme.palette.success.dark
                        }}
                    />
                ) : (
                    <Chip label="View Movies" size="small"
                        sx={{
                            background:
                                theme.palette.mode === 'dark'
                                    ? theme.palette.dark.main
                                    : theme.palette.success.light + 60,
                            color: theme.palette.success.dark
                        }}
                    />
                )
        }
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell align='center'>Image</TableCell>
                        <TableCell align='center'>First Name</TableCell>
                        <TableCell align='center'>Last Name</TableCell>
                        <TableCell align='center'>Username</TableCell>
                        <TableCell align='center'>Session time out&nbsp;(minutes)</TableCell>
                        <TableCell align='center'>Published</TableCell>
                        <TableCell align='center'>Permissions</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users && userLoading
                        ? [1, 2, 3, 4].map((item) => (
                            <TableRow key={item}>
                                <TableCell colSpan={9}>
                                    <Skeleton variant="rectangular" sx={{ height: "144px" }} />
                                    <Divider sx={{ mt: 2, mb: 2 }} />
                                </TableCell>
                            </TableRow>
                        ))
                        :
                        users?.map((user, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                                <TableCell align='center'>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar alt="User 1" src={user.user.image} />
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell align='center'>{user.user.firstName}</TableCell>
                                <TableCell align='center'>{user.user.lastName}</TableCell>
                                <TableCell align='center'>{user.username}</TableCell>
                                <TableCell align='center'>{user.user.sessionTimeOut}</TableCell>
                                <TableCell align='center'>{format(new Date(user.user.published), 'E, MMM d yyyy')}</TableCell>
                                <TableCell align='center'>
                                    <Grid container spacing={1}>
                                        {user.permissionsUser.permissionsUser
                                            .filter((per) => { if (!!Object.values(per)[0]) { return per } })
                                            .map((permission, index) => {
                                                permissionsResult = permissionAdapter(Object.keys(permission)[0].split('_')[0], Object.keys(permission)[0].split('_')[1])
                                                return (
                                                    <Grid item lg={6} key={index}>
                                                        {permissionsResult}
                                                    </Grid>
                                                );
                                            })}
                                    </Grid>
                                </TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    {isOwnerCallback(userLogin?.permissionsUser) && <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Delete">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleDelete(user._id, user.user.firstName + ' ' + user.user.lastName)}
                                                aria-label="delete"
                                                size="large"
                                            >
                                                <DeleteMember sx={{ fontSize: '1.1rem' }} color="error" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Edit">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/management/users/add-user/${user._id}`)}
                                                size="large"
                                            >
                                                <EditTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>}
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 500, color: 'secondary.dark' }}>
                        Are you sure you want to delete this user? <br /><br />
                        {usertoDelete.fullName }
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pr: '20px' }}>
                    <Button autoFocus variant='contained' onClick={handleDialog}>
                        Ok
                    </Button>
                    <Button autoFocus variant='contained' color='error' onClick={() => { setOpenDialog(false); setUsertoDelete({ userId: '', fullName: '' }); }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

UsersList.propTypes = {
    users: PropTypes.array,
    removeUser: PropTypes.func,
    userLoading: PropTypes.bool,
    isOwnerCallback: PropTypes.func
};

export default UsersList;
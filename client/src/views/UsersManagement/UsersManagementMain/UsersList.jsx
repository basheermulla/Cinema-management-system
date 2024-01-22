import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Chip, Grid, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tooltip, Typography
} from '@mui/material';

// internal imports
import Avatar from 'components/extended/Avatar';
import { useDispatch } from 'store';
import { Link } from 'react-router-dom';

// third-party
import { format } from 'date-fns';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import DeleteMember from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const UsersList = ({ users, removeUser }) => {
    const theme = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState([]);

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
                    <Chip label="Create Movies" size="small"
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
                    {users &&
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
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Delete">
                                            <IconButton
                                                color="primary"
                                                onClick={() => removeUser(user._id)}
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
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

UsersList.propTypes = {
    users: PropTypes.array,
    removeUser: PropTypes.func
};

export default UsersList;
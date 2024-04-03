import PropTypes from 'prop-types';
import { useEffect, useState, Fragment } from 'react';

// material-ui
import { Chip, Divider, Grid, List, ListItemButton, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// internal imports
import UserAvatar from './UserAvatar';

import { useDispatch, useSelector } from 'store';
import useAuth from 'hooks/useAuth';
import { getUsersWithChatsData } from 'store/slices/chat';

const UserList = ({ alterUserDisplay, messageSocket, onlineUsers, setTypingStatus }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const { user: userLogin } = useAuth();
    const { usersMoreInfo } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(getUsersWithChatsData(userLogin?.id));
    }, [userLogin?.id]);

    useEffect(() => {
        const updateData = usersMoreInfo.map((user) => {
            const onlineUser = onlineUsers.find((userOnline) => userOnline.username === user.username);
            return { ...user, online_status: onlineUser ? onlineUser?.online_status : 'offline' }
        });
        setData(updateData);
    }, [onlineUsers]);

    // View the new messageSocket sent by the socket.io server
    useEffect(() => {
        if (messageSocket.content?.recipient === userLogin?.id) {
            const new_data = data.map((user) => {
                return user._id === messageSocket.content?.sender
                    ? { ...user, unReadChatCount: user.unReadChatCount + 1 }
                    : user
            })

            setData((prevData) => new_data);
        } else {
            // messageSocket.length ? console.log('I got message but it still un read ', messageSocket.length) : null
        }
    }, [messageSocket]);

    const resetUnReadChatCount = (userId) => {
        const copy_data = [...data]
        const index = copy_data.findIndex((user) => user._id === userId);
        copy_data[index].unReadChatCount = 0;
        setData(copy_data);
    }

    return (
        <List component="nav">
            {data?.filter((owner) => owner._id !== userLogin?.id).map((user) => (
                <Fragment key={user._id}>
                    <ListItemButton
                        onClick={() => {
                            alterUserDisplay(user);
                            resetUnReadChatCount(user._id);
                            setTypingStatus('');
                        }}
                    >
                        <ListItemAvatar>
                            <UserAvatar user={user} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Grid container alignItems="center" spacing={1} component="span">
                                    <Grid item xs zeroMinWidth component="span">
                                        <Typography
                                            variant="h5"
                                            color="inherit"
                                            component="span"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'block'
                                            }}
                                        >
                                            {user.user.firstName + ' ' + user.user.lastName}
                                        </Typography>
                                    </Grid>
                                    <Grid item component="span">
                                        <Typography component="span" variant="subtitle2">
                                            {new Date(user.lastMessage).toLocaleDateString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            }
                            secondary={
                                <Grid container alignItems="center" spacing={1} component="span">
                                    <Grid item xs zeroMinWidth component="span">
                                        <Typography
                                            variant="caption"
                                            component="span"
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                display: 'block'
                                            }}
                                        >
                                            {'user.status'}
                                        </Typography>
                                    </Grid>
                                    <Grid item component="span">
                                        {user.unReadChatCount !== 0 && (
                                            <Chip
                                                label={user.unReadChatCount}
                                                component="span"
                                                color="secondary"
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    '& .MuiChip-label': {
                                                        px: 0.5
                                                    }
                                                }}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            }
                        />
                    </ListItemButton>
                    <Divider />
                </Fragment>
            ))}
        </List>
    );
};

UserList.propTypes = {
    alterUserDisplay: PropTypes.func,
    messageSocket: PropTypes.object,
    onlineUsers: PropTypes.array,
    setTypingStatus: PropTypes.func
};

export default UserList;
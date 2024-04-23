import { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react'

// material-ui
import { Box, ClickAwayListener, Divider, Grid, InputAdornment, IconButton, Popper, OutlinedInput, Typography, useMediaQuery, Stack, CardMedia } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';


// third-party
import EmojiPicker, { SkinTones } from 'emoji-picker-react';
import moment from 'moment';

// internal imports
import UserDetails from './UserDetails';
import ChatDrawer from './ChatDrawer';
import ChartHistory from './ChartHistory';
import AvatarStatus from './AvatarStatus';
import Loader from 'components/Loader';
import MainCard from 'components/cards/MainCard';
import Avatar from 'components/extended/Avatar';
import { useDispatch, useSelector } from 'store';
import { getUserChats, insertChat, setReadChatByRecipient } from 'store/slices/chat';
import { appDrawerWidth as drawerWidth, gridSpacing } from 'utils/constant-theme';
import useSocket from 'hooks/useSocket';
import useAuth from 'hooks/useAuth';

// assets
import AttachmentTwoToneIcon from '@mui/icons-material/AttachmentTwoTone';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import MoodTwoToneIcon from '@mui/icons-material/MoodTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import imageMail from 'assets/images/maintenance/mail-svgrepo-com.svg';
import chat_icon from 'assets/images/maintenance/chat_icon.svg';

// drawer content element
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    paddingLeft: open ? theme.spacing(3) : 0,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down('lg')]: {
        paddingLeft: 0,
        marginLeft: 0
    },
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0
    })
}));

//================================================================= ChatMainPage =====================================================//

const ChatMainPage = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const scrollRef = useRef();
    useLayoutEffect(() => {
        if (scrollRef?.current) {
            scrollRef.current.scrollIntoView();
        }
    });

    // set chat details page open when user is selected from sidebar
    const [emailDetails, setEmailDetails] = useState(false);
    const handleUserChange = () => {
        setEmailDetails((prev) => !prev);
    };

    // toggle sidebar
    const [openChatDrawer, setOpenChatDrawer] = useState(true);
    const handleDrawerOpen = () => {
        setOpenChatDrawer((prevState) => !prevState);
    };

    // close sidebar when widow size below 'md' breakpoint
    useEffect(() => {
        setOpenChatDrawer(!matchDownSM);
    }, [matchDownSM]);

    // userLogin
    const { user: userLogin } = useAuth();

    // user data
    const [user, setUser] = useState({});
    const [displayUserId, setDisplayUserId] = useState('');

    // This state will be empty ([]) when the conversation between both userLogin (sender) and user (recipient) has no messages
    const [data, setData] = useState([]);

    // If the data array state is empty [], then the "converstationId" state  will be "undefined"
    const [converstationId, setConverstationId] = useState('');
    const chatState = useSelector((state) => state.chat);

    useEffect(() => {
        setUser(chatState.user);
    }, [chatState.user]);
    useEffect(() => {
        setData(chatState.chats);
        if (chatState.chats.length > 0) {
            const converstationId = Object.values(chatState.chats[0])[0][0]?.converstationId;
            setConverstationId(converstationId);
        } else {
            setConverstationId('');
        }
    }, [chatState.chats]);

    const alterUserDisplay = useCallback((user) => {
        setData([]);
        setDisplayUserId(user._id)
        setUser(user);
        dispatch(getUserChats(userLogin.id, user._id));
    }, []);

    const handleEnter = (event) => {
        if (event?.key !== 'Enter') {
            return;
        }
        handleOnSendMessage();
    };

    const onEmojiClick = (emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };

    const [anchorElEmoji, setAnchorElEmoji] = useState();
    const handleOnEmojiButtonClick = (event) => {
        setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
    };

    const emojiOpen = Boolean(anchorElEmoji);
    const emojiId = emojiOpen ? 'simple-popper' : undefined;
    const handleCloseEmoji = () => {
        setAnchorElEmoji(null);
    };

    //=========================================================================================================================================
    //==                                                       ⚡✅⚡ Socket ⚡✅⚡                                                       ==
    //=========================================================================================================================================
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [messageSocket, setMessageSocket] = useState({});
    const [typingStatus, setTypingStatus] = useState('');
    const userRef = useRef(user);
    const { socket } = useSocket();
    useEffect(() => {
        userRef.current = user;
    });
    //------------------------------------------------------
    // useEffect -> Emit onlineChat event on the chat      -
    //------------------------------------------------------
    useEffect(() => {
        socket?.emit('onlineChat', { username: userLogin.username });
    }, [socket]);
    const handleUsersOnEvents = (incomingUsersArray) => {
        setOnlineUsers(() => incomingUsersArray);
        const old_user = userRef.current;
        if (old_user && old_user._id) {
            const online_status = incomingUsersArray.find((incomingUser) => incomingUser.username === old_user.username)?.online_status;
            old_user.online_status = online_status
            setUser(old_user)
        }
    }

    //--------------------------------------------------------
    // useEffect -> Subscribe to an newUserResponse event    -
    //--------------------------------------------------------
    useEffect(() => {
        socket?.on('newUserResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));

        return () => {
            socket?.off('newUserResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));
        }
    }, [socket]);

    //--------------------------------------------------------
    // useEffect -> Subscribe to an onlineChatResponse event -
    //--------------------------------------------------------
    useEffect(() => {
        socket?.on('onlineChatResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));

        return () => {
            socket?.off('onlineChatResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));
        }
    }, [socket]);

    //--------------------------------------------------------
    // useEffect -> Subscribe to an offlineInSystemResponse event -
    //--------------------------------------------------------
    useEffect(() => {
        socket?.on('offlineInSystemResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));

        return () => {
            socket?.off('offlineInSystemResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));
        }
    }, [socket]);

    //--------------------------------------------------------
    // useEffect -> Subscribe to an availableInSystem event  -
    //--------------------------------------------------------
    useEffect(() => {
        socket?.on('availableInSystemResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));

        return () => {
            socket?.off('availableInSystemResponse', (incomingUsersArray) => handleUsersOnEvents(incomingUsersArray));
        }
    }, [socket]);

    //------------------------------------------------------------
    // Function -> handle a new message  &  emit a message event   -
    //------------------------------------------------------------
    const handleOnSendMessage = () => {
        const date = new Date();
        setMessage('');
        const newMessage = {
            sender: userLogin.id,
            recipient: user._id,
            content: message,
            created_at: date,
            converstationId: converstationId,
            isReadByRecipient: false
        };
        const id = `${socket.id}${Math.random()}`;
        socket.emit('message', { content: newMessage, id: id, socketID: socket.id });

        dispatch(insertChat(newMessage));
    };

    //---------------------------------------------------
    // Function -> handle a new messageResponse event     -
    //---------------------------------------------------
    const handleMessageResponse = (incomingMessage) => {
        //---------------------------------------------------------------------------------------------------------------------------------
        // Definition   -> When a messageResponse event is triggered by a particular user                                                 -
        // Checking     -> If (the sender of this message) =====> is matches this current user [state]                                    -
        // In this case -> We will trigger dispatch(setReadChatByRecipient) to update that the recipient user "read" the certain message  -
        //---------------------------------------------------------------------------------------------------------------------------------
        if (incomingMessage.content['sender'] === user._id) {
            const obj_updateIsReadMessage = { ...incomingMessage.content, isReadByRecipient: true };
            dispatch(setReadChatByRecipient(obj_updateIsReadMessage, incomingMessage.id));
        } else {
            setMessageSocket(incomingMessage);
        }
    }

    //------------------------------------------------------
    // useEffect -> Subscribe to a messageResponse event  -
    //------------------------------------------------------
    useEffect(() => {
        socket?.on('messageResponse', (incomingMessage) => handleMessageResponse(incomingMessage));

        return () => {
            socket?.off('messageResponse', (incomingMessage) => handleMessageResponse(incomingMessage));
        }
    }, [socket, user]);

    //------------------------------------------------------------
    // Function -> handle a start typing  &  emit a typing event   -
    //------------------------------------------------------------
    let sender_timer;
    const handleTyping = () => {
        if (sender_timer === undefined) {
            socket.emit('typing', {
                content: `${userLogin.firstName + ' ' + userLogin.lastName} is typing...`,
                sender: userLogin.id,
                recipient: user._id,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
            sender_timer = setTimeout(() => {
                sender_timer = undefined;
            }, 500);
        }

    }

    //------------------------------------------------------
    // useEffect -> Subscribe to a typingResponse event   -
    //------------------------------------------------------
    useEffect(() => {
        socket?.on('typingResponse', (typingUser) => handleTypingResponse(typingUser));

        return () => {
            socket?.off('typingResponse', (typingUser) => handleTypingResponse(typingUser));
        }
    }, [socket, user]);

    //------------------------------------------------------
    // Function -> handle a typingResponse event          -
    //------------------------------------------------------
    let reciver_timer;
    const handleTypingResponse = (typingUser) => {
        //------------------------------------------------------------------------------------------------
        // Definition   ->  When a typingResponse event is triggered by a particular user                -
        // Checking     ->  If (the sender of this message) =====> is matches this current user [state]  -
        // In this case ->  We will show typingStatus ()                                                 -
        //------------------------------------------------------------------------------------------------
        if (typingUser['sender'] === displayUserId) {
            clearTimeout(reciver_timer);
            setTypingStatus(typingUser.content);
            reciver_timer = setTimeout(() => {
                setTypingStatus('');
            }, 3000);
        }
    }

    //=========================================================================================================================================
    //==                                               ✔️▶️🎬 Loading Page 🎬▶️✔️                                                         ==
    //=========================================================================================================================================
    if (loading) return <Loader />;

    let userChatHistoryResult = <></>;
    if (user && user._id) {
        userChatHistoryResult = (
            <ChartHistory
                theme={theme}
                handleUserDetails={handleUserChange}
                handleDrawerOpen={handleDrawerOpen}
                user={user}
                data={data}
            />
        );
    } else {
        userChatHistoryResult = (
            <Stack alignItems="center" spacing={gridSpacing}>
                <CardMedia
                    component="img"
                    image={theme.palette.mode === 'dark' ? chat_icon : chat_icon}
                    title="Slider5 image"
                    sx={{ maxWidth: 350 }}
                />
                <Stack spacing={1}>
                    <Typography variant="h1" color="inherit" component="div">
                        Welcome to the corporate chat
                    </Typography>
                    <Typography variant="body2" align="center">Here you could chat with our company's users</Typography>
                </Stack>
            </Stack>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <ChatDrawer
                openChatDrawer={openChatDrawer}
                handleDrawerOpen={handleDrawerOpen}
                alterUserDisplay={alterUserDisplay}
                messageSocket={messageSocket}
                onlineUsers={onlineUsers}
                setTypingStatus={setTypingStatus}
            />
            <Main theme={theme} open={openChatDrawer}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs zeroMinWidth sx={{ display: emailDetails ? { xs: 'none', sm: 'flex' } : user._id ? 'blank' : 'blank' }}>
                        <MainCard
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Grid container alignItems="center" spacing={0.5}>
                                        <Grid item>
                                            <IconButton onClick={handleDrawerOpen} size="large" aria-label="click to menu collapse">
                                                <MenuRoundedIcon />
                                            </IconButton>
                                        </Grid>
                                        {user && user._id && (
                                            <Grid item>
                                                <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
                                                    <Grid item>
                                                        <Avatar
                                                            alt={user.user?.firstName + ' ' + user.user?.lastName}
                                                            src={user.user?.image}
                                                        />
                                                    </Grid>
                                                    <Grid item sm zeroMinWidth>
                                                        <Grid container spacing={0} alignItems="center">
                                                            <Grid item xs={12}>
                                                                <Typography variant="h4" component="div">
                                                                    {user.user?.firstName + ' ' + user.user?.lastName}{' '}
                                                                    {user.online_status && <AvatarStatus status={user.online_status} />}
                                                                </Typography>
                                                            </Grid>
                                                            {!typingStatus ? <Grid item xs={12}>
                                                                <Typography variant="subtitle2">
                                                                    Last message at {moment(new Date(user.lastMessage)).fromNow()}

                                                                </Typography>
                                                            </Grid>
                                                                :
                                                                <Grid item xs={12}>
                                                                    <Typography variant="subtitle2" >{typingStatus}</Typography>
                                                                </Grid>}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>)}
                                        <Grid item sm zeroMinWidth />
                                        {user && user._id && (
                                            <Grid item>
                                                <IconButton onClick={handleUserChange} size="large" aria-label="user information options">
                                                    <ErrorTwoToneIcon />
                                                </IconButton>
                                            </Grid>)}
                                    </Grid>
                                    <Divider sx={{ mt: theme.spacing(2) }} />
                                </Grid>
                                <Box
                                    style={{ width: '100%', height: 'calc(100vh - 440px)', overflowX: 'hidden', minHeight: 525 }}
                                >
                                    <Box sx={{ py: 3, pl: 4, pr: 1 }} >
                                        {userChatHistoryResult}
                                        <span ref={scrollRef} />
                                    </Box>
                                </Box >
                                {user && user._id && (
                                    <Grid item xs={12}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item>
                                                {/* <IconButton size="large" aria-label="attachment file">
                                                    <AttachmentTwoToneIcon />
                                                </IconButton> */}
                                                <IconButton
                                                    ref={anchorElEmoji}
                                                    aria-describedby={emojiId}
                                                    onClick={handleOnEmojiButtonClick}
                                                    size="large"
                                                    aria-label="emoji"
                                                >
                                                    <MoodTwoToneIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={12} sm zeroMinWidth>
                                                <OutlinedInput
                                                    id="message-send"
                                                    fullWidth
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    onKeyPress={handleEnter}
                                                    placeholder="Type a Message"
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                disableRipple
                                                                color="primary"
                                                                onClick={handleOnSendMessage}
                                                                aria-label="send message"
                                                            >
                                                                <SendTwoToneIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    aria-describedby="search-helper-text"
                                                    inputProps={{ 'aria-label': 'weight' }}
                                                    onKeyDown={handleTyping}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>)}
                            </Grid>
                            <Popper
                                id={emojiId}
                                open={emojiOpen}
                                anchorEl={anchorElEmoji}
                                disablePortal
                                style={{ zIndex: 1200 }}
                                modifiers={[
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [-20, 20]
                                        }
                                    }
                                ]}
                            >
                                <ClickAwayListener onClickAway={handleCloseEmoji}>
                                    <MainCard elevation={8} content={false}>
                                        <EmojiPicker onEmojiClick={onEmojiClick} defaultSkinTone={SkinTones.DARK} autoFocusSearch={false} />
                                    </MainCard>
                                </ClickAwayListener>
                            </Popper>
                        </MainCard>
                    </Grid>
                    {emailDetails && (
                        <Grid item sx={{ margin: { xs: '0 auto', md: 'initial' } }}>
                            <Box sx={{ display: { xs: 'block', sm: 'none', textAlign: 'right' } }}>
                                <IconButton onClick={handleUserChange} sx={{ mb: -5 }} size="large">
                                    <HighlightOffTwoToneIcon />
                                </IconButton>
                            </Box>
                            <UserDetails user={user} />
                        </Grid>
                    )}
                </Grid>
            </Main>
        </Box>
    )
}

export default ChatMainPage;
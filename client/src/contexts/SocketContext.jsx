import useAuth from 'hooks/useAuth';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from "socket.io-client";
import { SOCKET_URL_DEV, SOCKET_URL_PROD } from "utils/config";

const APP_MODE = import.meta.env.APP_MODE;

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    const [usersCount, setUsersCount] = useState(0);    // count event
    const [usersAvailable, setUsersAvailable] = useState([]); // newUserResponse event

    const { user } = useAuth();
    // Here's a basic socket init.
    useEffect(() => {
        const newSocket = io(APP_MODE === "production" ? SOCKET_URL_PROD : SOCKET_URL_DEV, { transports: ['websocket'] }, { withCredentials: true });
        setSocket(newSocket);

        return () => {
            newSocket.close();
        }
    }, [])

    const usersCountEvent = useCallback((data) => {
        setUsersCount(data);
    }, []);

    const usersAvailableEvent = useCallback((data) => {
        setUsersAvailable(data);
    }, []);

    // Here we listen to global events
    useEffect(() => {
        socket?.on('count', (count) => usersCountEvent(count));
        socket?.on('newUserResponse', (users) => usersAvailableEvent(users));

        return () => {
            socket?.off('count', usersCountEvent);
            socket?.off('newUserResponse', usersAvailableEvent);
        };
    }, [socket]);

    useEffect(() => {
        if (socket?.id) {
            const id = `${socket.id}${Math.random()}`;
            const user_obj = {
                id,
                socketID: socket.id,
                userId: user.id,
                username: user.username,
                online_status: 'available'
            }
            socket?.emit('newUser', { ...user_obj });
        }
    }, [usersCount]);

    return (
        <SocketContext.Provider value={{
            usersCount, setUsersCount,
            usersAvailable, setUsersAvailable,
            socket
        }}
        >
            {children}
        </SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node
};

export default SocketContext
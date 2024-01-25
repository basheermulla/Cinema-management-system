import PropTypes from 'prop-types';
import { createContext, useEffect, useState, useCallback, useRef } from 'react';
import socketio, { io } from "socket.io-client";
import { SOCKET_URL } from "utils/config";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    const [usersCount, setUsersCount] = useState(0);

    // Here's a basic socket init.
    useEffect(() => {
        const newSocket = io(SOCKET_URL, { secure: true }, { transports: ['websocket'] });
        setSocket(newSocket);
        return () => {
            console.log('close');
            newSocket.close();
        }
    }, []);

    const usersCountEvent = useCallback((data) => {
        console.log('Hi');
        setUsersCount(data);
    }, []);

    // Here we listen to count event
    socket?.on('count', usersCountEvent)

    return (
        <SocketContext.Provider value={{ usersCount, setUsersCount, socket }}>{children}</SocketContext.Provider>
    )
}

SocketProvider.propTypes = {
    children: PropTypes.node
};

export default SocketContext
import { useContext } from 'react';

// socket provider
import SocketContext from 'contexts/SocketContext';

const useSocket = () => {
    const con = useContext(SocketContext)
    return con
};

export default useSocket;

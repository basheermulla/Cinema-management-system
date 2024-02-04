import { useContext } from 'react';

// socket provider
import SocketContext from 'contexts/SocketContext';

const useSocket = () => useContext(SocketContext);

export default useSocket;

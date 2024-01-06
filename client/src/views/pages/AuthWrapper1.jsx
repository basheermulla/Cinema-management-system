// material-ui
import { styled } from '@mui/material/styles';

const AuthWrapper1 = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100],
    minHeight: '100vh',
    [theme.breakpoints.down('lg')]: {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
    }


}));

export default AuthWrapper1;

// material-ui
import { useTheme } from '@mui/material/styles';
import systemLogo2 from 'assets/images/systemLogo3.png'

const Logo = () => {
    const theme = useTheme();

    return (
        <img src={theme.palette.mode === 'dark' ? logoDark : systemLogo2} alt="Berry" width='150px' />
    );
};

export default Logo;
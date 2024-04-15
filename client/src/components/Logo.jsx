// material-ui
import { useTheme } from '@mui/material/styles';

const Logo = () => {
    const theme = useTheme();

    return (
        <>
                <img src={theme.palette.mode === 'dark' ? logoDark : "/cinema.svg"} alt="Cinema" width='45px' />
        </>

    );
};

export default Logo;


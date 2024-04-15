import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// internal imports
import { DASHBOARD_PATH } from 'utils/config';
import Logo from 'components/Logo';

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="cinema logo">
        <Logo />
    </Link>
);

export default LogoSection;
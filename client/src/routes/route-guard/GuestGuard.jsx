import PropTypes from 'prop-types'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// internal imports
import useAuth from 'hooks/useAuth';
import { DASHBOARD_PATH } from 'utils/config';

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (isLoggedIn) {
        navigate(DASHBOARD_PATH, { replace: true })
      }
    
    }, [isLoggedIn, navigate])
    
    return children;
}

GuestGuard.propTypes = {
    children: PropTypes.node
}

export default GuestGuard

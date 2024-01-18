import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { ButtonBase, Link, Tooltip } from '@mui/material';

// internal imports
import Avatar from '../extended/Avatar';

const CardSecondaryAction = ({ title, link, icon, color = "primary", action, action_func }) => {
    const theme = useTheme();

    const handleAction = () => {
        switch (action) {
            case "addSubscription":
                action_func(action);
                break;
            case "addMember":
                action_func(action);
                break;
            case "updateMember":
                action_func(action);
                break;
            case "deleteMember":
                action_func(action);
                break;
            case "refresh":
                action_func(action);
                break;
            default:
                break;
        }
    }

    return (
        <Tooltip title={title || 'Reference'} placement="left">
            <ButtonBase onClick={handleAction} disableRipple>
                {icon && (
                    <Avatar component={Link} href={link} target="_blank" size="badge" color={color} outline aria-label="ui material icon">
                        {icon}
                    </Avatar>
                )}
            </ButtonBase>
        </Tooltip>
    );
};

CardSecondaryAction.propTypes = {
    icon: PropTypes.node,
    link: PropTypes.string,
    title: PropTypes.string,
    color: PropTypes.string,
    action: PropTypes.string, //delete, update, new subscribe
    action_func: PropTypes.func
};

export default CardSecondaryAction;

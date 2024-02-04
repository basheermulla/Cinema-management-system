import PropTypes from 'prop-types';

// material-ui
import { Avatar, Badge } from '@mui/material';

// internal imports
import AvatarStatus from './AvatarStatus';

const UserAvatar = ({ user }) => (
    <Badge
        overlap="circular"
        badgeContent={<AvatarStatus status={user.online_status} />}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
    >
        <Avatar alt={user.user?.firstName + ' ' + user.user?.lastName} src={user.user?.image} />
    </Badge>
);

UserAvatar.propTypes = {
    user: PropTypes.object
};

export default UserAvatar;

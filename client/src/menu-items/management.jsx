// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconUserCheck } from '@tabler/icons-react';

const icons = {
    IconUserCheck
};

const management = {
    id: 'management',
    title: <FormattedMessage id="management" />,
    type: 'group',
    children: [
        {
            id: 'User Management',
            title: <FormattedMessage id="User Management" />,
            type: 'item',
            url: '/management/users',
            icon: icons.IconUserCheck,            
        }
    ]
};

export default management;

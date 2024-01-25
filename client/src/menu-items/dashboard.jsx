// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconMessages } from '@tabler/icons-react';

const icons = {
    IconDashboard,
    IconMessages
};

const dashboard = {
    id: 'dashboard',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'control panel',
            title: <FormattedMessage id="control panel" />,
            type: 'item',
            url: '/dashboard/control-panel',
            icon: icons.IconDashboard,            
        }
    ]
};

export default dashboard;

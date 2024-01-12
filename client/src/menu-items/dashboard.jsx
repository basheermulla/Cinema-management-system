// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconDashboard, IconMessages } from '@tabler/icons-react';

const icons = {
    IconDashboard,
    IconMessages
};

const dashboard = {
    id: 'control panel',
    title: <FormattedMessage id="dashboard" />,
    icon: icons.IconDashboard,
    type: 'group',
    children: [
        {
            id: 'default',
            title: <FormattedMessage id="control panel" />,
            type: 'item',
            url: '/dashboard/default',
            icon: icons.IconDashboard,
            breadcrumbs: false
        }
    ]
};

export default dashboard;

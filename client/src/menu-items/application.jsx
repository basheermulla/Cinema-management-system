// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar,
    IconNfc, IconUsersGroup, IconUserCircle, IconUserPlus, IconBellCheck, IconMovie
} from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc,
    IconUsersGroup,
    IconUserCircle,
    IconUserPlus,
    IconBellCheck,
    IconMovie
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application = {
    id: 'application',
    title: <FormattedMessage id="application" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'movies',
            title: <FormattedMessage id="movies" />,
            type: 'collapse',
            icon: icons.IconMovie,
            children: [
                {
                    id: 'all-movies',
                    title: <FormattedMessage id="all-movies" />,
                    type: 'item',
                    url: '/apps/user/social-profile/posts'
                },
                {
                    id: 'add-movie',
                    title: <FormattedMessage id="add-movie" />,
                    type: 'item',
                    url: '/apps/user/social-profile/posts'
                }
            ]
        },
        {
            id: 'members',
            title: <FormattedMessage id="members" />,
            type: 'collapse',
            icon: icons.IconUsersGroup,
            children: [
                {
                    id: 'all-members',
                    title: <FormattedMessage id="all-members" />,
                    type: 'item',
                    url: '/apps/customer/customer-list',
                    breadcrumbs: false
                },
                {
                    id: 'add-member',
                    title: <FormattedMessage id="add-member" />,
                    type: 'item',
                    url: '/apps/customer/order-list',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'subscriptions',
            title: <FormattedMessage id="subscriptions" />,
            type: 'collapse',
            icon: icons.IconBellCheck,
            children: [
                {
                    id: 'subscriptions',
                    title: <FormattedMessage id="subscriptions" />,
                    type: 'item',
                    url: '/apps/customer/customer-list',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default application;

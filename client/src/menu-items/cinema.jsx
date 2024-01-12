// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
    IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar,
    IconNfc, IconUsersGroup, IconUserCircle, IconUserPlus, IconBellCheck, IconMovie, IconStars, IconStar
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
    IconMovie,
    IconStars,
    IconStar
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application = {
    id: 'cinema',
    title: <FormattedMessage id="cinema" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'chat',
            title: <FormattedMessage id="chat" />,
            type: 'item',
            url: '/dashboard/analytics',
            icon: icons.IconMessages,
            breadcrumbs: false
        },
        {
            id: 'movies',
            title: <FormattedMessage id="movies" />,
            type: 'collapse',
            icon: icons.IconMovie,
            children: [
                {
                    id: 'movies',
                    title: <FormattedMessage id="movies" />,
                    type: 'item',
                    url: '/cinema/movies'
                },
                {
                    id: 'add-movie',
                    title: <FormattedMessage id="add-movie" />,
                    type: 'item',
                    url: '/cinema/movies/true'
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
                    id: 'all-members',
                    title: <FormattedMessage id="all-members" />,
                    type: 'item',
                    url: '/members-page',
                    breadcrumbs: false
                },
                {
                    id: 'add-member',
                    title: <FormattedMessage id="add-member" />,
                    type: 'item',
                    url: '/members-page',
                    breadcrumbs: false
                }
            ]
        },
        {
            id: 'recommendations',
            title: <FormattedMessage id="recommendations" />,
            type: 'item',
            icon: icons.IconStars,
            url: '/members-page',
        }
    ]
};

export default application;

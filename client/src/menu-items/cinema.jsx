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
            icon: icons.IconMessages,
            url: '/chat'            
        },
        {
            id: 'movies',
            title: <FormattedMessage id="movies" />,
            type: 'item',
            icon: icons.IconMovie,
            url: '/cinema/movies',
        },
        {
            id: 'subscriptions',
            title: <FormattedMessage id="subscriptions" />,
            type: 'item',
            icon: icons.IconBellCheck,
            url: '/cinema/subscriptions',
        },
        {
            id: 'recommendations',
            title: <FormattedMessage id="recommendations" />,
            type: 'item',
            icon: icons.IconStars,
            url: '/recommendations',
        }
    ]
};

export default application;

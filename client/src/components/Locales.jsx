import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// third-party
import { IntlProvider } from 'react-intl';
import useConfig from 'hooks/useConfig';

// load locales files
const loadLocaleData = (locale) => {
    switch (locale) {
        case 'fr':
            return 'import(utils/locales/fr.json)'; // Not supported
        case 'ro':
            return 'import(utils/locales/ro.json)'; // Not supported
        case 'zh':
            return 'import(utils/locales/zh.json)'; // Not supported
        default:
            return import('utils/locales/en.json'); // 'en' - english language only supported
    }
};

const Locales = ({ children }) => {
    const { locale } = useConfig();
    const [messages, setMessages] = useState();

    useEffect(() => {
        loadLocaleData(locale).then((d) => {
            setMessages(d.default);
        });
    }, [locale]);

    return (
        <>
            {messages && (
                <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
                    {children}
                </IntlProvider>
            )}
        </>
    );
};

Locales.propTypes = {
    children: PropTypes.node
};

export default Locales;

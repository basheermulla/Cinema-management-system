import PropTypes from 'prop-types'
import { createContext } from 'react';

// internal import
import defaultConfig from 'utils/config';
import useLocalStorage from 'hooks/useLocalStorage';

// initial state
const initialState = {
    ...defaultConfig,
    onChangeLayout: () => { },
    onChangeDrawer: () => { },
    onChangeFontFamily: () => { },
    onChangeBorderRadius: () => { },
    onChangeOutlinedField: () => { },
    onChangeMenuType: () => { },
    onChangePresetColor: () => { },
    onChangeLocale: () => { },
    onChangeContainer: () => { },
    onReset: () => { }
};

const ConfigContext = createContext(initialState);

const ConfigProvider = ({ chidren }) => {
    const [config, setConfig] = useLocalStorage('cinema-config', {
        layout: initialState.layout,
        drawerType: initialState.drawerType,
        fontFamily: initialState.fontFamily,
        borderRadius: initialState.borderRadius,
        outlinedFilled: initialState.outlinedFilled,
        navType: initialState.navType,
        presetColor: initialState.presetColor,
        locale: initialState.locale
    });

    const onChangeLayout = (layout) => {
        setConfig({
            ...config,
            layout
        });
    };

    const onChangeDrawer = (drawerType) => {
        setConfig({
            ...config,
            drawerType
        });
    };

    const onChangeFontFamily = (fontFamily) => {
        setConfig({
            ...config,
            fontFamily
        });
    };

    const onChangeBorderRadius = (event, newValue) => {
        setConfig({
            ...config,
            borderRadius: newValue
        });
    };

    const onChangeOutlinedField = (outlinedFilled) => {
        setConfig({
            ...config,
            outlinedFilled
        });
    };

    const onChangeMenuType = (navType) => {
        setConfig({
            ...config,
            navType
        });
    };

    const onChangePresetColor = (presetColor) => {
        setConfig({
            ...config,
            presetColor
        });
    };

    const onChangeLocale = (locale) => {
        setConfig({
            ...config,
            locale
        });
    };

    const onChangeContainer = (container) => {
        setConfig({
            ...config,
            container
        });
    };

    const onReset = () => {
        setConfig({ ...defaultConfig });
    };

    return (
        <ConfigContext.Provider
            value={{
                ...config, onChangeLayout, onChangeDrawer, onChangeFontFamily, onChangeBorderRadius,
                onChangeOutlinedField, onChangeMenuType, onChangePresetColor, onChangeLocale, 
                onChangeContainer, onReset
            }}
        >
        </ConfigContext.Provider>
    )
}

ConfigProvider.propTypes = {
    chidren: PropTypes.node
}

export { ConfigProvider, ConfigContext };
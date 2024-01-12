import PropTypes from 'prop-types'
import { useMemo } from 'react';

// material-ui
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// project import
import useConfig from 'hooks/useConfig';
import Palette from './palette';
import Typography from './typography';
import componentStyleOverrides from './compStyleOverride';
import customShadows from './shadows';

const ThemeCustomization = ({ children }) => {
    const { borderRadius, fontFamily, navType, outlinedFilled, presetColor, rtlLayout } = useConfig();

    const theme = useMemo(() => Palette(navType, presetColor), [navType, presetColor]);
    const themeTypography = useMemo(() => Typography(theme, borderRadius, fontFamily), [theme, borderRadius, fontFamily]);
    const themeCustomShadows = useMemo(() => customShadows(navType, theme), [navType, theme]);

    const themeOptions = useMemo(
        () => ({
            direction: rtlLayout ? 'rtl' : 'ltr',
            palette: theme.palette,
            mixins: {
                toolbar: {
                    minHeight: '48px',
                    padding: '11px',
                    '@media (min-width: 600px)': {
                        minHeight: '48px'
                    }
                }
            },
            typography: themeTypography,
            customShadows: themeCustomShadows
        }),
        [rtlLayout, theme, themeCustomShadows, themeTypography]
    );

    const themes = createTheme(themeOptions);
    themes.components = useMemo(
        () => componentStyleOverrides(themes, borderRadius, outlinedFilled),
        [themes, borderRadius, outlinedFilled]
    );

  return (
    <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes}>
                <CssBaseline />
                {/* {console.log('themes = ', themes)} */}
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
  )
}

ThemeCustomization.propTypes = {
    children: PropTypes.node
}

export default ThemeCustomization
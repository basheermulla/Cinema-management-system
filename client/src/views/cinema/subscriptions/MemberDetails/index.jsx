import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, useLoaderData, useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, CardActions, CardContent, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import { updateMember } from 'store/slices/member';

// internal imports
import MemberProfile from './MemberProfile';
import useConfig from 'hooks/useConfig';
import MainCard from 'components/cards/MainCard';
import AnimateButton from 'components/extended/AnimateButton';
import { gridSpacing } from 'utils/constant-theme';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';

// tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// tabs option
const tabsOption = [
  {
    label: 'Member Profile',
    icon: <PersonOutlineTwoToneIcon />,
    caption: 'Member Settings'
  }
];

const MemberDetails = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();

  const dispatch = useDispatch();

  const member = useLoaderData();

  useEffect(() => {
    console.log(member);
  }, [member]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const editMember = (id, memberEdit) => {
    dispatch(updateMember(id, memberEdit));
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <MainCard title="Member Settings" content={false}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} lg={4}>
              <CardContent>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  orientation="vertical"
                  variant="scrollable"
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      borderBottom: 'none'
                    },
                    '& button': {
                      color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                      minHeight: 'auto',
                      minWidth: '100%',
                      py: 1.5,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      borderRadius: `${borderRadius}px`
                    },
                    '& button.Mui-selected': {
                      color: theme.palette.primary.main,
                      background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
                    },
                    '& button > svg': {
                      marginBottom: '0px !important',
                      marginRight: 1.25,
                      marginTop: 1.25,
                      height: 20,
                      width: 20
                    },
                    '& button > div > span': {
                      display: 'block'
                    },
                    '& > div > span': {
                      display: 'none'
                    }
                  }}
                >
                  {tabsOption.map((tab, index) => (
                    <Tab
                      key={index}
                      icon={tab.icon}
                      label={
                        <Grid container direction="column">
                          <Typography variant="subtitle1" color="inherit">
                            {tab.label}
                          </Typography>
                          <Typography component="div" variant="caption" sx={{ textTransform: 'capitalize' }}>
                            {tab.caption}
                          </Typography>
                        </Grid>
                      }
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              </CardContent>
            </Grid>
            <Grid item xs={12} lg={8}>
              <CardContent
                sx={{
                  borderLeft: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                  height: '100%'
                }}
              >
                <TabPanel value={value} index={0}>
                  <MemberProfile member={member} editMember={editMember} />
                </TabPanel>
              </CardContent>
            </Grid>
          </Grid>
          {/* <Divider />
          <CardActions>
            <Grid container justifyContent="space-between" spacing={0}>
              <Grid item>
                <AnimateButton>
                  <Button variant="outlined" color="error" size="large" onClick={(e) => handleChange(e, value - 1)}>
                    Back
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item>
                <AnimateButton>
                  <Button variant="contained" size="large" onClick={(e) => handleChange(e, 1 + value)}>
                    Update
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </CardActions> */}
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default MemberDetails
import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';
import UsersCardSkeleton from 'components/cards/Skeleton/UsersCardSkeleton';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

const MembersAmountCard = ({ isLoading, members }) => {
    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <UsersCardSkeleton />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 1.8 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor:
                                                theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light,
                                            color: theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.dark
                                        }}
                                    >
                                        <AccountBoxIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={<Typography variant="h4">{members?.length}</Typography>}
                                    secondary={
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0
                                            }}
                                        >
                                            Total Members
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

MembersAmountCard.propTypes = {
    isLoading: PropTypes.bool,
    members: PropTypes.array
};

export default MembersAmountCard;

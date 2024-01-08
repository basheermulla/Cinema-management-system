import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'store/index';
import { increment, decrement, incrementAmountAction } from 'store/slices/counterSlice';
import { getMembers } from 'store/slices/membersSlice'

// material-ui
import { Avatar, Box, Button, ListItem, Typography, Unstable_Grid2 } from '@mui/material';

// internal imports
import MainCard from 'components/cards/MainCard';

const PocMembersPage = () => {
    const [incrementAmount, setIncrementAmount] = useState(2)

    const { members, error } = useSelector((state) => state.members);

    const { value } = useSelector((state) => state.counter);
    const dispatch = useDispatch();

    const getAllMembers = async () => {
        dispatch(getMembers());
    }

    useEffect(() => {
        if (members) { console.log(members); }
        if (error) { console.error(error); }
    }, [members, error])

    return (
        <>
            <MainCard title="Create POC - a connection between the Client and Servers">
                <Typography variant="h5">
                    List of members
                </Typography>
                <Button onClick={getAllMembers} variant='contained' color='primary'>Get Members</Button>
                <Unstable_Grid2>
                    {
                        members?.map((member, index) => {
                            return (
                                <Box key={index} sx={{ display: "flex", p: 2 }}>
                                    <Avatar src={member.image} width="80" />
                                    <ListItem>{member.name}</ListItem>
                                    <ListItem>{member.email}</ListItem>
                                    <ListItem>{member.city}</ListItem>
                                </Box>
                            )
                        })
                    }
                </Unstable_Grid2>
            </MainCard>

            <MainCard title="Counter">
                <Box>
                    <input type='text' value={incrementAmount} onChange={(e) => setIncrementAmount(+e.target.value)}></input>
                </Box>
                <Box className="card">
                    <Button onClick={() => dispatch(decrement())} variant='contained' color='error'>
                        -
                    </Button>
                    {' --- '}
                    <Button onClick={() => dispatch(increment())} variant='contained' color='secondary'>
                        +
                    </Button>
                    {' --- '}
                    <Button onClick={() => dispatch(incrementAmountAction(incrementAmount))} variant='contained' color='primary'>
                        Increment Amount
                    </Button>
                    <p>{value}</p>
                </Box>
            </MainCard>
        </>
    )
}
export default PocMembersPage;

import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { useState } from 'react';

const MainLayout = () => {
    const [container, setContainer] = useState(false)

    return (
        <>
            <Container maxWidth={container ? 'lg' : false} {...(!container && { sx: { px: { xs: 0 } } })}>
                <Outlet />
            </Container>

        </>
    )
};

export default MainLayout;
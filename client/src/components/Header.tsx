import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <AppBar position="static" color="primary">
            <Container maxWidth="md">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Medical Assistance Platform
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        User Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/staff">
                        Staff Dashboard
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;

import { Button, TextField } from "@mui/material";
import download from "downloadjs";
import { SettingsModel } from "../model/model";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleIcon from '@mui/icons-material/Article';
import { ModelContextProps } from "../model/modelcontext";
import settingsLoad from "../actions/settingsload";
import generatePptxFromSettings from "../actions/pptxgen";


import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import CalendarMakerWhite from "../../../public/CalendarMakerWhite.png";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import { DefaultSettings } from '../model/model';
import { useContext, useState } from 'react';
import { ModelContext } from '../model/modelcontext';
import EventIcon from '@mui/icons-material/Event';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PhotoIcon from '@mui/icons-material/Photo';
import Header from '../components/header';
import ResetButton from '../components/resetbutton';
import { useRouter } from 'next/navigation';
import { EVENTS_PATH, FORMAT_SETTINGS_PATH, BANNERS_PATH } from '../model/routes';
import { Router } from "next/router";


const pages = [
    { name: 'Events', icon: <EventIcon />, route: EVENTS_PATH },
    { name: 'Banners', icon: <DisplaySettingsIcon />, route: BANNERS_PATH },
    { name: 'Format Settings', icon: <PhotoIcon />, route: FORMAT_SETTINGS_PATH }
];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function ResponsiveAppBar(props: {slug: string}) {
    let { slug } = props
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar component="nav">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <img 
                            src={CalendarMakerWhite.src} 
                            className="ml-4 my-auto" 
                            style={{height: '25px'}} 
                        />
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu} className="flex">
                                    {page.icon}
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <img 
                            src={CalendarMakerWhite.src} 
                            className="mr-5 my-auto" 
                            style={{height: '25px'}} 
                        />
                        {pages.map((page) => (
                            <Button
                                style={{backgroundColor: (page.route === slug ? "rgba(255, 255, 255, 0.1)" : "transparent") }}
                                startIcon={page.icon}
                                key={page.name}
                                onClick={e => router.push(page.route)}
                                className="text-white flex mx-1"
                                sx={{ my: 2, borderRadius: '28px', paddingLeft: '15px', paddingRight: '15px' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
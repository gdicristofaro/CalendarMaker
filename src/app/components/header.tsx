import { Button } from "@mui/material";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import CalendarMakerWhite from "../../../public/CalendarMakerWhite.png";
import EventIcon from '@mui/icons-material/Event';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import PhotoIcon from '@mui/icons-material/Photo';
import { useRouter } from 'next/navigation';
import { EVENTS_PATH, FORMAT_SETTINGS_PATH, BANNERS_PATH } from '../model/routes';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import { DefaultSettings } from "../model/model";
import { ModelContextProps } from "../model/modelcontext";
import download from "downloadjs";
import settingsLoad from "../actions/settingsload";
import generatePptxFromSettings from "../actions/pptxgen";




export default function Header(props: { slug: string, context: ModelContextProps }) {
    let { slug, context } = props;

    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    // import export settings
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    let pages = [
        { name: 'Events', icon: <EventIcon />, route: EVENTS_PATH },
        { name: 'Banners', icon: <DisplaySettingsIcon />, route: BANNERS_PATH },
        { name: 'Formatting', icon: <PhotoIcon />, route: FORMAT_SETTINGS_PATH },
        {
            name: 'Manage Settings', icon: <SettingsIcon />, subMenu: {
                isMenuOpen: open,
                openMenu: (evt: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(evt.currentTarget),
                closeMenu: () => setAnchorEl(null),
                anchorEl: anchorEl,
                menuItems: [
                    { 
                        title: 'Import Settings', 
                        action: () => {
                            let input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = e => { 
                                settingsLoad(context.update, (e.target as any).files);
                                input.remove();
                             }
                            input.click();
                        }
                    },
                    { 
                        title: 'Export Settings', 
                        action: () => download(JSON.stringify(context.settings), "settings.json", "application/json") },
                    { 
                        title: 'Reset Settings',
                        action: () => context.update(DefaultSettings)
                    },
                ]
            }
        },
        {
            name: 'Generate', icon: <SaveAltIcon />, action: () => {
                generatePptxFromSettings(context.settings);
            }
        }
    ];

    return (
        <AppBar component="nav" position="sticky">
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
                            style={{ height: '25px' }}
                        />
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
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
                            style={{ height: '25px' }}
                        />
                        {pages.map((page, idx) => (
                            <Button
                                startIcon={page.icon}
                                key={page.name}
                                onClick={e => {
                                    if (page.action) {
                                        page.action();
                                    } else if (page.route) {
                                        router.push(page.route);
                                    } else if (page?.subMenu?.openMenu) {
                                        page.subMenu.openMenu(e);
                                    }
                                }}
                                className="text-white flex"
                                disabled={slug.toLowerCase() == page?.route?.toLowerCase()}
                                sx={{
                                    my: 2,
                                    borderRadius: '7px',
                                    marginLeft: '2px',
                                    marginRight: '2px',
                                    paddingLeft: '7px',
                                    paddingRight: '7px',
                                    color: 'white !important',
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.3)"
                                    },
                                    backgroundColor: (slug.toLowerCase() == page?.route?.toLowerCase()
                                        ? "rgba(255, 255, 255, 0.2)"
                                        : undefined)
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                        {pages.map((page, idx) => {
                            return page?.subMenu ?
                                (<Menu
                                    key={"menu_" + idx}
                                    anchorEl={page.subMenu.anchorEl}
                                    open={page.subMenu.isMenuOpen}
                                    onClose={evt => page.subMenu.closeMenu()}

                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {page.subMenu.menuItems.map((menuItem, idx) => (
                                        <MenuItem 
                                            key={idx}
                                            onClick={(evt) => {
                                                menuItem.action();
                                                page.subMenu.closeMenu();
                                            }}>
                                                {menuItem.title}
                                        </MenuItem>
                                    ))}
                                </Menu>) :
                                undefined
                        })}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from 'react';
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
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';



export default function Header(props: { slug: string, context: ModelContextProps }) {
    let { slug, context } = props;

    const router = useRouter();

    // import export settings
    const [settingsAnchorEl, setSettingsAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(settingsAnchorEl);

    const [drawerOpen, setDrawerOpen] = useState(false);

    let pages = [
        { name: 'Events', icon: <EventIcon />, route: EVENTS_PATH },
        { name: 'Banners', icon: <DisplaySettingsIcon />, route: BANNERS_PATH },
        { name: 'Formatting', icon: <PhotoIcon />, route: FORMAT_SETTINGS_PATH },
        {
            name: 'Manage Settings', icon: <SettingsIcon />, subMenu: {
                isMenuOpen: open,
                openMenu: (evt: React.MouseEvent<HTMLButtonElement>) => setSettingsAnchorEl(evt.currentTarget),
                closeMenu: () => setSettingsAnchorEl(null),
                anchorEl: settingsAnchorEl,
                menuItems: [
                    {
                        title: 'Import Settings',
                        icon: <UploadIcon/>,
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
                        icon: <DownloadIcon/>,
                        action: () => download(JSON.stringify(context.settings), "settings.json", "application/json")
                    },
                    {
                        title: 'Reset Settings',
                        icon: <ClearIcon/>,
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
                            color="inherit"
                            onClick={(evt) => setDrawerOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <img
                            src={CalendarMakerWhite.src}
                            className="ml-4 my-auto"
                            style={{ height: '25px' }}
                        />

                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={() => setDrawerOpen(false)}
                        >
                            <List>
                                {pages.map((page, index) => {
                                    let listContents = (<>
                                        <ListItemIcon>{page.icon}</ListItemIcon>
                                        <ListItemText primary={page.name} />
                                    </>);

                                    if (page.action || (page.route && page.route.toLowerCase() != slug.toLowerCase())) {
                                        listContents = (
                                            <ListItemButton onClick={(e) => {
                                                if (page.action) {
                                                    page.action();
                                                } else if (page.route) {
                                                    router.push(page.route);
                                                }
                                            }}>
                                                {listContents}
                                            </ListItemButton>
                                        );
                                    }

                                    let listItem = (<ListItem key={index} disablePadding>{listContents}</ListItem>)
                                    if (page.subMenu) {
                                        listItem = <>
                                            {listItem}
                                            <List>
                                            {
                                                page.subMenu.menuItems.map((item, idx) => {
                                                    return (
                                                        <ListItem disablePadding>
                                                            <ListItemButton onClick={(e) => item.action()}>
                                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                                <ListItemText primary={item.title} />
                                                            </ListItemButton>
                                                        </ListItem>
                                                    )
                                                })
                                            }
                                            </List>
                                        </>;
                                    }

                                    return listItem;
                                })}
                            </List>
                        </Drawer>

                        {/* <Menu
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
                        </Menu> */}
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
                                            <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                            <ListItemText>{menuItem.title}</ListItemText>
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
// ASCII file - normalized encoding
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

export default function Layout({ children, user, onLogout }: any) {
  const navigate = useNavigate();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => setOpen((v) => !v);

  // Normalize possible CJS default export wrappers (e.g. { default: Comp })
  const norm = (c: any) => (c && c.default ? c.default : c);
  console.log('Layout: icon types', {
    MenuIcon: typeof MenuIcon,
    DashboardIcon: typeof DashboardIcon,
    PeopleIcon: typeof PeopleIcon,
    ExitToAppIcon: typeof ExitToAppIcon,
    LoginIcon: typeof LoginIcon,
    PersonAddIcon: typeof PersonAddIcon,
  });

  const primaryItems = [
    { text: 'Dashboard', icon: norm(DashboardIcon), path: '/dashboard' },
    { text: 'Currículos', icon: norm(DashboardIcon), path: '/resumes' },
  ];

  const adminItems = [{ text: 'Usuarios', icon: norm(PeopleIcon), path: '/users' }];

  const authItems = user
    ? [
        { text: 'Perfil', icon: norm(AccountCircleIcon), path: '/profile' },
        { text: 'Sair', icon: norm(ExitToAppIcon), action: onLogout },
      ]
    : [
        { text: 'Login', icon: norm(LoginIcon), path: '/login' },
        { text: 'Registrar', icon: norm(PersonAddIcon), path: '/register' },
      ];

  const diag = {
    primary: primaryItems.map(it => ({ t: it.text, type: typeof it.icon })),
    admin: adminItems.map(it => ({ t: it.text, type: typeof it.icon })),
    auth: authItems.map(it => ({ t: it.text, type: typeof it.icon })),
    menu: typeof MenuIcon
  };
  console.log('Layout: icons resolved', diag);
  const diagSummary = `primary:${diag.primary.map(d=>d.type).join(',')};admin:${diag.admin.map(d=>d.type).join(',')};auth:${diag.auth.map(d=>d.type).join(',')};menu:${diag.menu}`;

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation" onClick={() => !mdUp && setOpen(false)}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Projeto</Typography>
      </Box>
      <Divider />
      <List>
        {primaryItems.map((it) => (
          <ListItem button key={it.text} onClick={() => navigate(it.path)}>
            <ListItemIcon>{it.icon ? React.createElement(it.icon) : null}</ListItemIcon>
            <ListItemText primary={it.text} />
          </ListItem>
        ))}
        {user && user.access_level === 'admin' && (
          <>
            <Divider />
            {adminItems.map((it) => (
              <ListItem button key={it.text} onClick={() => navigate(it.path)}>
                <ListItemIcon>{it.icon ? React.createElement(it.icon) : null}</ListItemIcon>
                <ListItemText primary={it.text} />
              </ListItem>
            ))}
          </>
        )}
      </List>

      <Divider />
      <List>
        {authItems.map((it) => (
          <ListItem
            button
            key={it.text}
            onClick={() => {
              if ('path' in it && it.path) {
                navigate(it.path);
              } else if ('action' in it) {
                it.action();
              }
            }}
          >
            <ListItemIcon>{it.icon ? React.createElement(it.icon) : null}</ListItemIcon>
            <ListItemText primary={it.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {!mdUp && (
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleToggle} sx={{ mr: 2 }}>
              {React.createElement(norm(MenuIcon))}
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Projeto Lavarel React
          </Typography>
          {mdUp && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user ? `${user.name} (${user.role ?? user.access_level ?? 'user'})` : 'Visitar'}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      {mdUp ? (
        <Drawer variant="permanent" open sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="temporary" open={open} onClose={handleToggle} ModalProps={{ keepMounted: true }}>
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container>
          {/* <Box sx={{ mb: 2, p: 1, bgcolor: '#e3f2fd' }} id="debug-banner">{"DEBUG: Layout rendered ? " + diagSummary}</Box> */}
          {children}
        </Container>
        <Box component="footer" sx={{ p: 2, textAlign: 'center', mt: 4 }}>
          <Typography variant="caption">(c) Projeto Lavarel React</Typography>
        </Box>
      </Box>
    </Box>
  );
}

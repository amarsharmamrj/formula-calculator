import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import HelpBox from './HelpBox';

import styles from './Navbar.module.css'

import { useDispatch, useSelector } from 'react-redux';

// icons
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import { toggleTheme } from '../../redux/slice/themeSlice';

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const theme = useSelector((store: any) => store.theme)

  const dispatch = useDispatch()

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleTheme = () => {
    if (theme) {
      document.body.style.backgroundColor = 'white'
      document.body.style.color = 'black'

    } else {
      document.body.style.backgroundColor = 'black'
      document.body.style.color = 'white'
    }

    dispatch(toggleTheme(''))

  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Formula Calculator
          </Typography>

          {/* dark mode */}
          <IconButton className={styles.darkMode} onClick={handleTheme}>
            {
              theme ? (<ModeNightIcon />) : (<LightModeIcon />)
            }
          </IconButton>

          {/* help button */}
          <Button
            color="inherit"
            onClick={toggleDrawer(true)}
            className={styles.helpButton}
          >
            Help ?
          </Button>

        </Toolbar>
      </AppBar>

      <HelpBox open={open} toggleDrawer={toggleDrawer} />
    </Box>
  );
}

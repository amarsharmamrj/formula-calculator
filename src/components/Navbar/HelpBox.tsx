import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import styles from './HelpBox.module.css'
import { Button } from '@mui/material';

import { useSelector } from 'react-redux'

const uses = [
  "Enter the formula inside the input field",
  "For each variables, select it's value using the slider below",
  "Result will be shown below the formula input field after the '=' sign",
  "Click on the 'ADD FORMULA' button to create new formula input",
  "Click on 'SAVE FORMULA' button to save the formula"
]

const HelpBox = (props: any) => {
  const { open, toggleDrawer } = props
  const theme = useSelector((store: any) => store.theme)

  const DrawerList = (
    <Box className={`${styles.helpBox} ${theme ? styles.dark : styles.light}`} role="presentation">
      <Button className={styles.closeButton} variant='contained' onClick={toggleDrawer(false)}>Close</Button>

      <div className={styles.section}>

        {/* how to use */}
        <h4>How to use:</h4>
        <Divider></Divider>
        <ul>
          {
            uses?.map((item: string, index: number) => (
              <li key={`first${index}`}>{item}</li>
            ))
          }
        </ul>

        {/* about */}
        <h4>About:</h4>
        <Divider></Divider>
        <p className={styles.subHeading}>We can perform formula calculations like addition,
          substraction, multiplication, division etc., for example:</p>
        <ul>
          {
            ["2+4", "a*b-(c+2)", "ab+(c-(d*(4-2)))", "a+b(c/d)"].map((item: string, index: number) => (
              <li key={`first${index}`}><i>{item}</i></li>
            ))
          }
        </ul>

        <p className={styles.subHeading}>We can perform formula calculations like log, sin, cos, tan etc., for example:</p>
        <ul>
          {
            ["log(10)", "sin(a+80)", "cos(a*2)", "a+b+log(c+d)"].map((item: string, index: number) => (
              <li key={`first${index}`}><i>{item}</i></li>
            ))
          }
        </ul>
      </div>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default HelpBox
import { Grid } from '@mui/material'
import Calculator from './components/Calculator'
import SavedFormulas from './components/SavedFormulas'
import Navbar from './components/Navbar/Navbar'
import './App.css'

function App() {

  return (
    <>
      <div>

        {/* navbar */}
        <Navbar />

        <div className="main-container">
          <Grid container>
            <Grid item xs={12} sm={12} md={8}>
              <Calculator />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <SavedFormulas />
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}

export default App

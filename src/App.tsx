import { Grid } from '@mui/material'
import Calculator from './components/Calculator'
import SavedFormulas from './components/SavedFormulas'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <>
      <div>
        <Provider store={store}>
          <Navbar />
          <div className="main-container">
            <Grid container>
              <Grid item xs={12} sm={8} md={8}>
                <Calculator />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <SavedFormulas />
              </Grid>
            </Grid>
          </div>
        </Provider>
      </div>
    </>
  )
}

export default App

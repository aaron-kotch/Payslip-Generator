import './App.scss';
import { useState } from 'react';
import PayrollView from './Payroll/PayrollView'
import { FiBox, FiMoon, FiSun, FiChevronRight } from 'react-icons/fi';

function App() {

  const [isDarkMode, setDarkMode] = useState(false);

  return (
    <div className={isDarkMode ? "dark-theme" : "light-theme"}>
      <div className="App">
      
        <div className={isDarkMode ? "menu-panel menu-panel-dark" : "menu-panel"}>

          <div className='menu-top'>

            <div className='icon-wrapper' id='menu-selected'>
              <FiBox/>
            </div>

            {/* <div className='icon-wrapper' id='menu-unselected' onClick={() => setDarkMode(!isDarkMode)}>
              { isDarkMode
                ? <FiMoon/>
                : <FiSun/>
              }
            </div> */}
            
          </div>

          <div className='button-wrapper'>
            <FiChevronRight/>
          </div>

        </div>

        <div className='main-panel'>
          <PayrollView/>
        </div>

      </div>
    </div>
  );
}

export default App;

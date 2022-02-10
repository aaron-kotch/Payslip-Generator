import './App.scss';
import PayrollView from './Payroll/PayrollView'
import { FiBox, FiCode, FiChevronRight } from 'react-icons/fi';

function App() {
  return (
    <div className="App">
      
      <div className='menu-panel'>

        <div className='menu-top'>

          <div className='icon-wrapper' id='menu-selected'>
            <FiBox/>
          </div>

          <div className='icon-wrapper' id='menu-unselected'>
            <FiCode/>
          </div>
        </div>

        <div className='button-wrapper'>
          <FiChevronRight/>
        </div>

      </div>

      <div className='main-panel'>
        <PayrollView/>
      </div>

    </div>
  );
}

export default App;

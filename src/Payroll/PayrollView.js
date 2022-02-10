import './PayrollView.scss';
import PayrollSection from './PayrollSection';
import { useState } from 'react';
import useWindowDimensions from '../useWindowDimiension';
import { FiRefreshCw, FiChevronRight, FiX } from 'react-icons/fi';
import { FcFolder } from 'react-icons/fc'

const { ipcRenderer } = window.require('electron');

const PayrollView = () => {

    const { height, width } = useWindowDimensions();
    const [payrollList, setPayrollList] = useState([]);
    const [currentFile, setCurrentFile] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);

    async function openFile() {
        const result = await ipcRenderer.invoke('open-file', payrollList);
        setPayrollList(result['data']);
        // setCurrentFile(result['filepath'].split("\\")[0]);
        setCurrentFile(result['filepath'].split("\\").at(-1));
        console.log(result['data']);
    }

    function generatePayslip() {

        ipcRenderer.invoke('generate-payslip', payrollList[0]['data'][0]).then((result) => {
            console.log(result);
        })

    }

    return (
        <div className='payroll-view'>

            <div className='title-row'>
                <h1 className='title'>Generate Payslip</h1>
                <div className='date-wrapper'>
                    <h2>?</h2>
                </div>
            </div>

            { payrollList.length === 0 

                ? <div className='empty-list-body'>
                    <div className='empty-body'>
                        <div className='icon-wrapper'>
                            <FcFolder/>
                        </div>
                        <h2>Import File</h2>
                        <h5>Select or drag and drop payroll file to start working.</h5>
                    </div>
                    <div className='import-button' onClick={openFile}>
                        <h3>Select file</h3>
                    </div>
                </div>
                : <div className='list-body'>

                    <div className='filename-wrapper'>

                        <h5>SELECTED FILE</h5>
                        <div className='chev-wrapper'><FiChevronRight/></div>
                        <h6>{currentFile}</h6>
                        <div className='remove-button' onClick={() => {setPayrollList([])}}>
                            <div className='icon-wrapper'><FiX/></div>
                            <h3>Reset</h3>
                        </div>

                    </div>

                    <div className='tab-row'>

                        <div className='tab-wrapper'>
                            { payrollList.map((item, index) => {
                                return <div className='tab-item' key={item['abv']} id={currentIndex === index ? "active-tab" : "inactive-tab"}  onMouseUp={() => {setCurrentIndex(index)}}>
                                    <h3>{item['abv']}</h3>
                                </div>
                            })}
                        </div>

                        <div className='row'>

                            <div className='import-button' onClick={generatePayslip}>
                                <FiRefreshCw/>
                                <h6>Generate</h6>
                            </div>
                        </div>

                    </div>

                    <div className='list-panel'>
                        <div className='list-section'>

                        <PayrollSection key={payrollList[currentIndex]['abv']} data={payrollList[currentIndex]}/>
                            
                        </div>

                        { width > 1600 &&
                            <div className='list-detail'>
                                <h1>Details</h1>
                            </div>
                        }
                    </div>
                </div>

            }
            
        </div>
    );

}

export default PayrollView;
import './PayrollView.scss';
import PayrollSection from './PayrollSection';
import PayrollSummary from './PayrollSummary';
import { useEffect, useState } from 'react';
import useWindowDimensions from '../useWindowDimiension';
import { FiRefreshCw, FiChevronRight, FiCheckCircle, FiX } from 'react-icons/fi';
import { FcFolder } from 'react-icons/fc'
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css'

const { ipcRenderer } = window.require('electron');

const PayrollView = () => {

    const { width } = useWindowDimensions();
    const [payrollList, setPayrollList] = useState([]);
    const [currentFile, setCurrentFile] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [outputDir, setOutputDir] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isGeneratingPayslip, setGeneratingPayslip] = useState(false);
    const [isCompletedGenerating, setCompletedGenerating] = useState(false);
    const [loadPercent, setLoadPercent] = useState(0);
    const [listIndex, setListIndex] = useState(0);

    async function openFile() {
        const result = await ipcRenderer.invoke('open-file');
        
        if (result !== undefined) {
            setPayrollList(result['data']);
            setCurrentFile(result['filepath'].split("\\").at(-1));
        } else {
            setPayrollList([]);
        }
        // setCurrentFile(result['filepath'].split("\\")[0]);
        
        console.log(result['data']);
    }

    async function openFolder() {

        const result = await ipcRenderer.invoke('open-folder');

        if (result !== undefined) {
            setOutputDir(result)
        }
    }

    async function viewFolder() {
        await ipcRenderer.invoke('view-folder', outputDir);
    }

    async function getDefaultDir() {

        const result = await ipcRenderer.invoke('get-home-dir');

        if (result !== undefined) {
            setOutputDir(result)
            console.log(result)
        }
    }

    const openGenerateDialog = () => {
        setDialogOpen(true);
    }

    const closeGenerateDialog = () => {
        setDialogOpen(false);
        setGeneratingPayslip(false)
        setCompletedGenerating(false)
    }

    const generatePayslip = async() => {

        let length = 0
        let currIndex = 0

        setGeneratingPayslip(true)

        payrollList.forEach(item => {
            length = length + item['data'].length
            console.log(length)
        })

        const forLoop = async (item) => {
            for (const crew of item['data']) {
    
                await ipcRenderer.invoke('generate-payslip', {"data": crew, "filepath": outputDir, "month": item.month, "abv": item.abv});
    
                currIndex += 1;

                let perc = currIndex / length * 100

                setLoadPercent(parseInt(perc))

                if (currIndex === length) {
                    setCompletedGenerating(true)
                    console.log("COMPLETE")
                } 
            }
        }

        payrollList.forEach(item => {
            forLoop(item)
        })
    }

    const handleCurrentIndex = (index) => {
        setListIndex(index)
    }

    const barStyle = {
        width: loadPercent + "%", 
        height: "100%",
        backgroundColor: "#412BEB",
        borderRadius: "2px",
        transition: "width 0.2s linear"
    }

    useEffect(() => {
        
        getDefaultDir()
        
    }, []);

    return (
        <SimpleBar className={payrollList && payrollList.length ? 'payroll-view has-list' : 'payroll-view'}>

            <div className='title-row'>
                <h1 className='title'>Payslip Generator</h1>
            </div>

            { payrollList && payrollList.length

                ? <div className='list-body'>

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

                        <div className='hide-scroll-wrapper'>
                            <div className='tab-wrapper scrollbar-hide'>
                                { payrollList.map((item, index) => {
                                    return <div className='tab-item' key={item['abv']} id={currentIndex === index ? "active-tab" : "inactive-tab"}  onMouseUp={() => {setCurrentIndex(index)}}>
                                        <h3>{item['abv']}</h3>
                                    </div>
                                })}
                            </div>
                        </div>

                        <div className='generate-button' onClick={openGenerateDialog}>
                            <FiRefreshCw/>
                            <h6>Generate Payslip</h6>
                        </div>

                    </div>

                    <div className='list-panel'>
                        <div className='list-section'>

                            <PayrollSection key={payrollList[currentIndex]['abv']} data={payrollList[currentIndex]} handleIndex={handleCurrentIndex}/>
                            
                        </div>
                    </div>

                    { isDialogOpen &&
                        <div className='generate-payslip-wrapper'>
                            <div className='generate-payslip-box'>
                                
                                { isGeneratingPayslip 
                                    ? !isCompletedGenerating && isGeneratingPayslip
                                        ? <div className='loading-wrapper'>
                                            <div className='loading-title'>
                                                <h5>Generating payslips</h5>
                                                
                                            </div>
                                            <div className='bar-wrapper'>
                                                <div className='loading-bar' style={barStyle}></div>
                                            </div>
                                        </div>
                                        : <div className='completed-wrapper'>
                                            <div className='completed-icon'>
                                                <FiCheckCircle/>
                                            </div>   
                                            <h5>Task Complete</h5>
                                            <div className='complete-text'>
                                                <p>Done exporting payslips</p>
                                            </div>
                                            <div className='actions-complete'>
                                                <div className='button cancel-button' onClick={viewFolder}>
                                                    <h4>View</h4>
                                                </div>
                                                
                                                <div className='button confirm-button' onMouseUp={closeGenerateDialog}>
                                                    <h4>Done</h4>
                                                </div>
                                            </div>
                                        </div>
                                    : <div className='prepare-generate'>
                                        <h2>Generate Payslip</h2>

                                        <h3>Output location</h3>
                                        <div className='output-wrapper'>
                                            <p>{outputDir}</p>
                                            <div className='choose-button' onClick={openFolder}>
                                                <h4>CHANGE LOCATION</h4>
                                            </div>
                                        </div>

                                        <div className='actions-row'>
                                            <div className='button cancel-button' onClick={closeGenerateDialog}>
                                                <h4>Cancel</h4>
                                            </div>
                                            <div className='button confirm-button' onMouseUp={generatePayslip}>
                                                <h4>Confirm</h4>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                        </div>
                    }

                    { width > 1200 &&
                        <div className='large-summary'>
                            { listIndex!== null
                                ? <PayrollSummary item={payrollList[currentIndex]['data'][listIndex]}/>
                                : <div className='empty-summary'>
                                    <img src='./images/gummy-printer.png'/>
                                    <h2>No Item Selected</h2>
                                    <p>Select an item from the list to preview</p>
                                </div>
                            }
                        </div> 
                       
                    }

                </div>
                : <div className='empty-list-body'>
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

            }
            
        </SimpleBar>
    );

}

export default PayrollView;
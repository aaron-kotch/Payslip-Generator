import './PayrollSectionItem.scss';
import { useState } from 'react';
import useWindowDimensions from '../useWindowDimiension';
import { FiChevronDown, FiHash } from 'react-icons/fi';

const PayrollSectionItem = ({data}) => {

    const { height, width } = useWindowDimensions();
    const [ isOpen, setIsOpen ] = useState(false);
    
    return(

        <div className='section-item'>

            <div className='section-main' id={isOpen ? 'header-focus' : null}  onClick={() => {setIsOpen(!isOpen)}}>

                <div className='name-section'>
                    {/* <div className='icon-wrapper'>
                        <FiHash/>
                    </div> */}
                    <div className='name-wrapper'>
                        <h1>{data['name'].toLowerCase()}</h1>
                    </div>
                </div>
                
                <div className='section-end'>

                    { !isOpen && 
                        <div className='inner-end'>
                            { width > 1042 && 
                                <div className='pay-section'>
                                    <h2>RM {data['total-deduction']}</h2>
                                    <h5>Total Deductions</h5>
                                </div>
                            }

                            <div className='pay-section'>
                                <h2>RM {data['net-pay']}</h2>
                                <h5>Net Pay</h5>
                            </div>
                        </div>
                    }

                    <div className='expand-button'>
                        <FiChevronDown id={isOpen ? 'button-isExpand' : 'button-isCollapsed'}/>
                    </div>
                </div>
            </div>

            { isOpen && 
                <div className='section-data'>

                    <div className='item-section salary'>

                        <h1>Salary</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>Total Basic + PH &amp; AL</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Gross Salary</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Net Pay</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>

                    <div className='item-section rate'>

                        <h1>Rate</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>Basic @ 8 \ HRS / Day</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Fixed OT @ 4 Hrs / Day</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Rate / Day</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>No. of Days</h6>
                                <h3>20</h3>
                            </div>
                        </div>
                    </div>

                    <div className='item-section overtime'>

                        <h1>Overtime</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>Fixed 4 Hrs</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Exceed  4 Hrs</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>

                    <div className="item-section deductions">

                        <h1>Employee Deductions</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>EPF</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>SOCSO</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>EIS</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Other</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Baitulmal</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Advance</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Total Deductions</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>

                    <div className='item-section tax'>

                        <h1>Income Tax</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>Fixed 4 Hrs</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>Exceed  4 Hrs</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>

                    <div className='item-section employer'>

                        <h1>Employer Contribution</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>EPFs</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>SOCSO</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>EIS</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>

                    <div className='item-section contribution'>

                        <h1>Total Contribution</h1>
                        <div className='section-row'>

                            <div className='section-column'>
                                <h6>EPFs</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>SOCSO</h6>
                                <h3>RM 5230.32</h3>
                            </div>

                            <div className='section-column'>
                                <h6>EIS</h6>
                                <h3>RM 5230.32</h3>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>

    );

}

export default PayrollSectionItem;
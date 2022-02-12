import './PayrollSummary.scss'

const PayrollSummary = ({item}) => {

    return (
        <div className='payroll-summary'>
            <div className='section-data'>
                <h2 className='sub-heading'>{item['name'].toLowerCase()}</h2>
                <div className='item-section salary' id='salary'>

                    <h1>Salary</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>Total Basic + PH &amp; AL</h6>
                            <h3>RM{item['basic-pay']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Gross Salary</h6>
                            <h3>RM{item['gross-pay']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Net Pay</h6>
                            <h3>RM{item['net-pay']}</h3>
                        </div>
                    </div>
                </div>

                <div className='item-section rate'>

                    <h1>Rate</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>Basic @ 8 \ HRS / Day</h6>
                            <h3>RM{item['basic-rate']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Fixed OT @ 4 Hrs / Day</h6>
                            <h3>RM{item['fixed-ot-rate']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Rate / Day</h6>
                            <h3>RM{item['day-rate']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>No. of Days</h6>
                            <h3>{item['day-count']}</h3>
                        </div>
                    </div>
                </div>

                <div className='item-section overtime'>

                    <h1>Overtime</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>Fixed 4 Hrs</h6>
                            <h3>RM{item['total-ot-fixed']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Exceed  4 Hrs</h6>
                            <h3>RM{item['total-ot-exceed']}</h3>
                        </div>
                    </div>
                </div>

                <div className="item-section deductions">

                    <h1>Employee Deductions</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>EPF</h6>
                            <h3>RM{item['employee']['epf']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>SOCSO</h6>
                            <h3>RM{item['employee']['socso']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>EIS</h6>
                            <h3>RM{item['employee']['eis']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Other</h6>
                            <h3>RM{item['other-deduction']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Baitulmal</h6>
                            <h3>RM{item['baitulmal']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Advance</h6>
                            <h3>RM{item['advance-deduction']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>Total Deductions</h6>
                            <h3>RM{item['total-deduction']}</h3>
                        </div>
                    </div>
                </div>

                <div className='item-section tax'>

                    <h1>Income Tax</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>PCB</h6>
                            <h3>RM{item['pcb']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>CP38</h6>
                            <h3>RM{item['cp38']}</h3>
                        </div>
                    </div>
                </div>

                <div className='item-section employer'>

                    <h1>Employer Contribution</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>EPFs</h6>
                            <h3>RM{item['employer']['epf']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>SOCSO</h6>
                            <h3>RM{item['employer']['socso']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>EIS</h6>
                            <h3>RM{item['employer']['eis']}</h3>
                        </div>
                    </div>
                </div>

                <div className='item-section contribution'>

                    <h1>Total Contribution</h1>
                    <div className='section-row'>

                        <div className='section-column'>
                            <h6>EPFs</h6>
                            <h3>RM{item['total-epf']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>SOCSO</h6>
                            <h3>RM{item['total-socso']}</h3>
                        </div>

                        <div className='section-column'>
                            <h6>EIS</h6>
                            <h3>RM{item['total-eis']}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayrollSummary;
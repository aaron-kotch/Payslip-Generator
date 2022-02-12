import './PayrollSection.scss';
import PayrollSectionItem from './PayrollSectionItem';
import { FiPlus } from 'react-icons/fi'
import { useState } from 'react';


const PayrollSection = ({data, handleIndex}) => {

    const setCurrentIndex = (index) => {
        handleIndex(index)
    }

    return (
        <div className='payroll-section'>

            {/* location */}
            <div className='section-header'>
                
                <div className="divider">
                    <h4>Location</h4>
                    <h3>{data['name']}</h3>
                </div>
                <div className="divider">
                    <h4>Month</h4>
                    <h3>{data['month']}</h3>
                </div>
                <div className="divider">
                    <h4>Period</h4>
                    <h3>{data['period']}</h3>
                </div>
                
            </div>

            <div className='list-wrapper'>
                { data['data'].length !== 0 &&
                    data['data'].map((item, index) => {
                        return <div onClick={() => {setCurrentIndex(index)}}>
                            <PayrollSectionItem key={item['name']} data={item}/>
                        </div>
                    })
                }
            </div>

        </div>
    );

}

export default PayrollSection;
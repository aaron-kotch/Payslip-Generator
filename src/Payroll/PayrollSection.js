import './PayrollSection.scss';
import PayrollSectionItem from './PayrollSectionItem';
import uuid from 'react-uuid';
import { useEffect, useState } from 'react';

const PayrollSection = ({data, handleIndex}) => {

    const [activeIndex, setActiveIndex] = useState()

    const setCurrentIndex = (index) => {

        if (index !== activeIndex) {
            handleIndex(index)
            setActiveIndex(index)
        } else {
            handleIndex(null)
            setActiveIndex(null)
        }
        
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

                        const id = uuid()

                        return <div key={item['name']} onMouseUp={() => {setCurrentIndex(index)}}>
                            <PayrollSectionItem data={item} index={index} currIndex={activeIndex}/>
                        </div>
                    })
                }
            </div>

        </div>
    );

}

export default PayrollSection;
import React from "react";

const Tabs = (props) => {

    const currentStep = props.current
    const count = props.steps.length

    return(
        <>

            <div className="stepperNav">
                <button type="buttton" onClick={()=> currentStep>1 ? props.setStep(currentStep-1) : null} className="prev"><span className="icon-prev"/></button>
                {props.steps && props.steps.map((item,index)=>{
                    return(
                        <button type="button" className={`item ${(index+1)===currentStep ? 'current' : ''}  ${(index+1) <= currentStep ? 'active' : ''} ${((index+1)<currentStep || (index+1)===(currentStep+1)) ? '' : 'cursor-default'}`} key={index} onClick={()=>((index+1)<currentStep || (index+1)===(currentStep+1)) ? props.setStep(index+1) : null}>
                            <span className="title">{item.title}</span>
                        </button>
                    )
                })}
                <button type="buttton" onClick={()=> currentStep<props.steps.length ? props.setStep(currentStep+1) : null} className="next"><span className="icon-next"/></button>
            </div>

        </>
    )
}

export default Tabs

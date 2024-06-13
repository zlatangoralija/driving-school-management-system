import React from "react";

const CardFlashNotification = (props) => {
    return(
        <div className={`text-white p-6 rounded-lg shadow-box mb-3 ${props.type==='success' ? 'bg-primary' : 'bg-secondary'}`}>
            <div className="w-full flex justify-between items-start">
                <div className="w-full relative">
                    <p className="font-bold">{props.title}</p>
                    {props.list &&
                        <ul className="pl-3 list-disc">
                            {props.list.map((item,index)=>{
                                return <li key={index}>{item}</li>
                            })}
                        </ul>
                    }
                </div>
                {props.button && props.button}
            </div>
        </div>
    )
}

export default CardFlashNotification

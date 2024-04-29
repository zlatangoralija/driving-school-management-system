import React, { Fragment } from 'react';
import ReactSelect from 'react-select';


export default function SelectDefaultNoForm({ name, label, ...props }) {

    const selectRef = React.useRef(null);
    const [ isfocused, setIsFocused ] = React.useState(false)
    const [ currentValue, setCurrentValue ] = React.useState(null)

    // 
    // 
    const _onFocus = () => {
        setIsFocused(true)
    }


    // 
    // 
    const _onBlur = () => {
        setIsFocused(false)
    }

  
    // 
    // 
    const handleChange = (e) => {
        if (props.isMulti) {
            if(props.onChange){
                props.onChange(e)
            }
            setCurrentValue(e.length > 0 ? e : null)
        }else{
            if(props.onChange){
                props.onChange(e.value)
            }
            setCurrentValue(e.value)
        }
    }


    // 
    // 
    React.useEffect(()=>{
        if(props.value){
            setCurrentValue(props.value)
        }
    },[props.value])

    
    //   
    // 
    return (
        <Fragment>
            <div className={`formGroupMaterial _select ${isfocused  ? 'focused' : ''} ${(currentValue || props.placeholder)  ? 'filled' : ''}`}>
                {label && <label>{label}</label>}
                <ReactSelect
                    defaultValue={props.value ? props.value : null}
                    ref={selectRef}
                    classNamePrefix="react-select"
                    onChange={handleChange}
                    onFocus={_onFocus} 
                    onBlur={_onBlur} 
                    isDisabled={props.disabled ? true : false}
                    placeholder=""
                    {...props}
                />
            </div>
        </Fragment>
    );
};
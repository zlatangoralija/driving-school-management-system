import React, { Fragment } from 'react'
import { useField } from '@unform/core'
import InputMask from 'react-input-mask';


// controllers
// import { _copy } from '../../controllers/Helpers'


//
export default function InputTextMasked({name, label, className, ...props}) {

    const inputRef = React.useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name)
    const [ isfocused, setIsFocused ] = React.useState(false)
    const [ currentValue, setCurrentValue ] = React.useState('')


    // 
    // 
    const _onFocus = () => {
        setIsFocused(true)
        clearError()
    }


    // 
    // 
    const _onBlur = () => {
        setIsFocused(false)
    }


    // 
    // 
    const handleChange = (e) => {
        if(props.onChange){
            props.onChange(e.target.value)
        }
        setCurrentValue(e.target.value)
    }


    // 
    // 
    React.useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current,
            getValue: ref => {
                return ref.value
            },
            setValue: (ref, value) => {
                ref.value = value
                setCurrentValue(value || '')
            },
            clearValue: ref => {
                ref.value = ''
            },
        })
    }, [fieldName, registerField])


    return (
        <Fragment>
            <div className={`formGroupMaterial ${isfocused  ? 'focused' : ''} ${(currentValue || props.maskPlaceholder)  ? 'filled' : ''} ${error ? 'error' : ''}`}>
                {label && <label>{label}</label>}
                <div className='relative'>
                <InputMask onChange={handleChange} value={props.presetValue ? props.presetValue : undefined} readOnly={props.test || !!props.presetValue} type="text" className={`formControlMaterial ${error ? 'error' : ''} ${className && className}`} ref={inputRef} defaultValue={defaultValue} onFocus={clearError} {...props}/>
                {/* {props.copy && <button type="button" className='button onInput' onClick={()=>_copy(inputRef.current.value)}>copy</button>} */}
                </div>
                { error && <span className="error">{error}</span> }
            </div>
        </Fragment>
    );
};
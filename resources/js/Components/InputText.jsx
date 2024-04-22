import React, { Fragment } from 'react'
import { useField } from '@unform/core'


//
export default function InputText({name, label, ...props}) {

    const inputRef = React.useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name)
    const [ isfocused, setIsFocused ] = React.useState(false)
    const [ currentValue, setCurrentValue ] = React.useState(props.defaultValue ? props.defaultValue : '')


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
        if(props.onExternalChange){
            props.onExternalChange(e.target.value)
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


    //
    //
    return (
        <Fragment>
            <div className={`formGroupMaterial ${isfocused  ? 'focused' : ''} ${(currentValue || props.placeholder)  ? 'filled' : ''} ${error ? 'error' : ''}`}>
                {label && <label>{label}</label>}
                <div className='relative'>
                    <input
                        type="text"
                        autoComplete="off"
                        onChange={handleChange}
                        className={`formControlMaterial border-none focus:ring-0 ${props.css ? props.css : ''}`}
                        ref={inputRef}
                        defaultValue={defaultValue}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        {...props}
                    />
                    {/* {props.copy && <button type="button" className='button onInput' onClick={()=>null}>copy</button>} */}
                </div>
                { error && <span className="error">{error}</span> }
            </div>
        </Fragment>
    );
};

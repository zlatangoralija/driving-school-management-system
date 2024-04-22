import React, { Fragment } from 'react';
import ReactSelect from 'react-select';
import { useField } from '@unform/core';


export default function SelectDefault({ name, label, ...props }) {

    const selectRef = React.useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(name);
    const [ isfocused, setIsFocused ] = React.useState(false)
    const [ currentValue, setCurrentValue ] = React.useState(null)

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
    React.useEffect(() => {
        registerField({
            name: fieldName,
            ref: selectRef.current,
            getValue: (ref) => {
                if (props.isMulti) {
                    if (!ref.state.selectValue) {
                        return [];
                    }
                    return ref.state.selectValue.map((option) => props.idField ? option[props.idField] : option.value);
                }
                if (!ref.state.selectValue) {
                    return '';
                }
                return ref.state.selectValue;
            },
            setValue: (ref, value) => {
                if (props.isMulti) {
                    ref.state.selectValue = value ? value : []
                    setCurrentValue(value.length > 0 ? value : null)
                }else{
                    ref.state.selectValue = value ? [value] : []
                    setCurrentValue(value || null)
                }
            },
            clearValue: ref => {
                ref.state.selectValue = []
                setCurrentValue(null)
            },
        });
    }, [fieldName, registerField, props.isMulti, props.idField]);


    //
    //
    React.useEffect(()=>{
        if(props.defaultValue){
            setCurrentValue(props.defaultValue)
        }
    },[])


    //
    //
    return (
        <Fragment>
            <div className={`formGroupMaterial _select ${isfocused  ? 'focused' : ''} ${(currentValue || props.placeholder)  ? 'filled' : ''} ${error ? 'error' : ''}`}>
                {label && <label>{label}</label>}
                <ReactSelect
                    defaultValue={props.defaultValue ? props.defaultValue : null}
                    ref={selectRef}
                    classNamePrefix="react-select"
                    onChange={handleChange}
                    onFocus={_onFocus}
                    onBlur={_onBlur}
                    isDisabled={props.disabled ? true : false}
                    placeholder=""
                    {...props}
                />
                { error && <span className="error">{error}</span> }
            </div>
        </Fragment>
    );
};

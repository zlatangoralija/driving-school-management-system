import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import {useField} from "@unform/core";

const defaultMaskOptions = {
    prefix: '$',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2, // how many digits allowed after the decimal
    integerLimit: 7, // limit length of integer numbers
    allowNegative: false,
    allowLeadingZeroes: false,
}

const InputCurrency = ({ maskOptions, ...inputProps }) => {
    const inputRef = React.useRef(null);
    const { fieldName, defaultValue, registerField, error, clearError } = useField(inputProps.name)
    const [ isfocused, setIsFocused ] = React.useState(false)
    const [ currentValue, setCurrentValue ] = React.useState('')

    const currencyMask = createNumberMask({
        ...defaultMaskOptions,
        ...maskOptions,
    })

    const _onFocus = () => {
        setIsFocused(true)
        clearError()
    }

    const _onBlur = () => {
        setIsFocused(false)
    }

    const handleChange = (e) => {
        if(inputProps.onChange){
            inputProps.onChange(e.target.value)
        }
        setCurrentValue(e.target.value)
    }

    //
    //
    React.useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef.current.inputElement,
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
            <div className={`formGroupMaterial ${isfocused  ? 'focused' : ''} ${(currentValue || inputProps.placeholder)  ? 'filled' : ''} ${error ? 'error' : ''}`}>
                {inputProps.label && <label>{inputProps.label}</label>}
                <div className='relative'>
                    <MaskedInput
                        mask={currencyMask}
                        autoComplete="off"
                        onChange={handleChange}
                        className={`formControlMaterial border-none focus:ring-0`}
                        ref={inputRef}
                        defaultValue={defaultValue}
                        onFocus={_onFocus}
                        onBlur={_onBlur}
                        name={inputProps.name}
                        {...inputProps}
                    />
                </div>
            </div>
        </Fragment>
    )
}

InputCurrency.defaultProps = {
    inputMode: 'numeric',
    maskOptions: {},
}

InputCurrency.propTypes = {
    inputmode: PropTypes.string,
    maskOptions: PropTypes.shape({
        prefix: PropTypes.string,
        suffix: PropTypes.string,
        includeThousandsSeparator: PropTypes.bool,
        thousandsSeparatorSymbol: PropTypes.string,
        allowDecimal: PropTypes.bool,
        decimalSymbol: PropTypes.string,
        decimalLimit: PropTypes.string,
        requireDecimal: PropTypes.bool,
        allowNegative: PropTypes.bool,
        allowLeadingZeroes: PropTypes.bool,
        integerLimit: PropTypes.number,
    }),
}

export default InputCurrency

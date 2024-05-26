import React from "react";
import {Head, router, usePage} from "@inertiajs/react";
import * as Yup from "yup";
import FlashNotification from "@/Components/FlashNotification.jsx";
import {Form} from "@unform/web";
import InputText from "@/Components/InputText.jsx";
import InputTextarea from "@/Components/InputTextarea.jsx";
import SelectDefault from "@/Components/SelectDefault.jsx";
import InputCurrency from "@/Components/InputCurrency.jsx";

export default function Account(props) {
    const formRef = React.useRef(null);
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [ modal, setModal ] = React.useState(false)
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)

    const submit = async() => {
        try{
            const formData = formRef.current.getData();

            // Remove all previous errors
            formRef.current.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Name is required.'),
                email: Yup.string().required('Email is required.'),
                password: Yup.string().nullable(),
                timezone: Yup.array().required('Please select your timezone.').min(1, 'Please select your timezone'),
                password_confirmation: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    .when('password', {
                        is: (password) => password && password.length > 0,
                        then: (schema) => schema.required('Password confirmation is required.'),
                        otherwise: (schema) => schema.nullable(),
                    }),
            });

            await schema.validate(formData, {
                abortEarly: false,
            });

            let finalData = {
                ...formData,
                timezone: formData.timezone.length>0 ? formData.timezone[0].value : null,
            }

            return router.put(route('students.update-account-settings'), finalData, {
                onError: (errors) => {
                    formRef.current.setErrors(errors);
                }
            })

        } catch (err) {
            console.log(err)
            wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            const validationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                formRef.current.setErrors(validationErrors);
            }

        }

    }

    React.useEffect(()=>{
        if (formRef.current && props.account) {
            formRef.current.setFieldValue('name', props.account.name);
            formRef.current.setFieldValue('email', props.account.email);
        }
    },[props.account])

    React.useEffect(()=>{
        if(flash && Object.keys(flash).length){
            if(flash.success){
                setSuccessNotice(flash.success)
            }

            if(flash.errors){
                setErrorNotice(flash.errors)
            }

            if(successNotice || errorNotice){
                wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    },[flash])

    return (
        <>
            <Head title="Account settings" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Account settings</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            {successNotice && flash.success &&
                <FlashNotification
                    type="success"
                    title={flash.success}
                />
            }

            {errorNotice && flash &&
                <FlashNotification
                    type="error"
                    title="Please fix the following errors"
                    list={errorNotice}
                    button={<button type="button" className="_button small !whitespace-nowrap" onClick={()=>setErrorNotice(null)}>close</button>}
                />
            }

            <div className="grid grid-cols-0 md:grid-cols-0 gap-6">
                <Form ref={formRef} onSubmit={submit} className="card p-5 mb-3">

                    <InputText name="name" label="Name*"/>
                    <InputText name="email" label="Email*"/>
                    <SelectDefault
                        name="timezone"
                        label="Timezone*"
                        options={Object.entries(props.timezones).map(([value, label]) => ({ value, label }))}
                        defaultValue={(props.timezones && props.current_timezone) ? Object.entries(props.timezones).map(([value, label]) => ({ value, label })).find(x => x.value==props.current_timezone) : ''}
                    />
                    <InputText name="password" type="password" label="Password*"/>
                    <InputText name="password_confirmation" type="password" label="Password confirmation*"/>

                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <button type="submit" className="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:ring-primary-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Save</button>
                        </div>
                    </div>

                </Form>
            </div>

        </>
    );
}

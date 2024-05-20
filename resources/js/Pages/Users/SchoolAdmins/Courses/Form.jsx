import React, { Fragment } from 'react'
import {Head, router, usePage} from "@inertiajs/react";
import InputText from "@/Components/InputText.jsx";
import { Form } from '@unform/web'
import * as Yup from "yup";
import SelectDefault from "@/Components/SelectDefault.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import InputTextarea from "@/Components/InputTextarea.jsx";
import InputTextMasked from "@/Components/InputTextMasked.jsx";
import InputCurrency from "@/Components/InputCurrency.jsx";

export default function CreateForm(props) {
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
                name: Yup.string().required('Course name is required.'),
                description: Yup.string().required('Course description is required.'),
                number_of_lessons: Yup.string().matches(/^[0-9]+$/, 'Number of lessons has to be a number.').required('Please input number of lessons for this course.'),
                payment_option: Yup.array().required('Please select payment option.'),
                instructor_id: Yup.array().required('Please select instructor.'),
                price: Yup.string().required('Price is required.'),
                duration: Yup.number().integer('Please enter a valid integer number.').required('Please enter a number.')
            });

            await schema.validate(formData, {
                abortEarly: false,
            });

            let finalData = {
                ...formData,
                payment_option: formData.payment_option.length>0 ? formData.payment_option[0].value : null,
                instructor_id: formData.instructor_id.length>0 ? formData.instructor_id[0].value : null,
                price: formData.price ? parseFloat(formData.price.replace("$", '').replace(/,/g, '')) : null
            }

            if(props.course){
                router.put(route('school-administrators.courses.update', {course:props.course}), finalData, {
                    onError: (errors) => {
                        formRef.current.setErrors(errors);
                    }
                })
            }else{
                router.post(route('school-administrators.courses.store'), finalData, {
                    onError: (errors) => {
                        formRef.current.setErrors(errors);
                    }
                })
            }

            return

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
        if (formRef.current && props.course) {
            formRef.current.setFieldValue('name', props.course.name);
            formRef.current.setFieldValue('description', props.course.description);
            formRef.current.setFieldValue('number_of_lessons', props.course.number_of_lessons);
            formRef.current.setFieldValue('duration', props.course.duration);
            formRef.current.setFieldValue('payment_option', props.course.payment_option);
            formRef.current.setFieldValue('price', props.course.price);
        }
    },[props.course])

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
            <Head title={props.course ? 'Edit course' : 'Create course'} />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{props.course ? 'Edit course' : 'Create course'}</h1>
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
                    <InputTextarea name="description" label="Description*"/>
                    <SelectDefault
                        options={Object.entries(props.instructors).map(([value, label]) => ({ value, label }))}
                        defaultValue={(props.instructors && props.course) ? Object.entries(props.instructors).map(([value, label]) => ({ value, label })).find(x =>  x.value==props.course.instructor_id) : ''}
                        label="Instructor*"
                        name="instructor_id"
                    />
                    <InputText name="number_of_lessons" label="Number of lessons*"/>
                    <InputText name="duration" label="Duration*"/>
                    <SelectDefault
                        options={props.payment_options}
                        defaultValue={(props.payment_options && props.course) ? props.payment_options.find(x => x.value===props.course.payment_option) : props.payment_options[0]}
                        label="Payment option*"
                        name="payment_option"
                    />
                    <InputCurrency placeholder="$0.00" type="text" label="Price*" name="price" />

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

import React, { Fragment } from 'react'
import {Head, router, usePage} from "@inertiajs/react";
import InputText from "@/Components/InputText.jsx";
import { Form } from '@unform/web'
import * as Yup from "yup";
import SelectDefault from "@/Components/SelectDefault.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import Upload from "@/Components/Upload.jsx";
import { _fetch } from "@/Components/Helpers.jsx";

export default function CreateForm(props) {
    const formRef = React.useRef(null);
    const wrapperRef = React.useRef(null)
    const { flash } = usePage().props

    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)
    const [ uploadedPhoto, setUploadedPhoto ] = React.useState(null)

    const submit = async() => {
        try{
            const formData = formRef.current.getData();

            // Remove all previous errors
            formRef.current.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('School name is required.'),
                address: Yup.string().required('Address is required.'),
                phone_number: Yup.string().required('Phone is required.'),
                kvk_number: Yup.string().required('KVK number is required.'),
            });

            await schema.validate(formData, {
                abortEarly: false,
            });

            let finalData = {
                ...formData,
                logo:uploadedPhoto ? JSON.stringify(uploadedPhoto) : null,
            }

            if(props.school){
                router.put(route('school-administrators.settings.update', {setting:props.school}), finalData, {
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

    console.log(route('upload-file'))

    const _removeTempFile = async(file) => {
        const formData = new FormData()
        formData.append('file', file[0])
        const removing = await _fetch(route('upload-file'), {
            method:'DELETE',
            body: JSON.stringify({
                path: uploadedPhoto.path
            })
        })
        setUploadedPhoto(null)
    }

    const _removeCloudFile = async(file) => {
        const formData = new FormData()
        formData.append('file', file[0])
        const removing = await _fetch(route('upload-file'), {
            method:'DELETE',
            body: JSON.stringify({
                path: uploadedPhoto.path
            })
        })
        setUploadedPhoto(null)
    }

    const _uploadFile = async(file) => {
        const formData = new FormData()
        formData.append('file', file[0])
        const uploading = await _fetch(route('upload-file'), {
            body:formData
        })
        setUploadedPhoto({
            ...uploading,
            preview: URL.createObjectURL(file[0]),
            name: file[0].name,
            isNew: true
        })
    }

    React.useEffect(()=>{
        if (formRef.current && props.school) {
            formRef.current.setFieldValue('name', props.school.name);
            formRef.current.setFieldValue('address', props.school.address);
            formRef.current.setFieldValue('phone_number', props.school.phone_number);
            formRef.current.setFieldValue('kvk_number', props.school.kvk_number);
            if(props.school.logo_url && props.school.logo_url !== ""){
                setUploadedPhoto({
                    path: props.school.logo_url,
                    preview: props.school.logo_url,
                    name: props.school.logo_url.split('/')[props.school.logo_url.split('/').length - 1],
                    isNew: false
                })
            }
        }
    },[props.school])

    React.useEffect(()=>{
        if(flash && Object.keys(flash).length){
            if(flash.success){
                setSuccessNotice(flash.success)
            }

            if(flash.errors){
                setErrorNotice(flash.errors)
            }

            if(errorNotice || successNotice){
                wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        }
    },[flash])

    return (
        <>
            <Head title="School settings" />

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">School settings</h1>
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

                    <InputText name="name" label="School name*"/>
                    <InputText name="address" label="Address*"/>
                    <InputText name="phone_number" label="Phone*"/>
                    <InputText name="kvk_number" label="KVK number*"/>

                    <Upload
                        isSingle
                        current={uploadedPhoto}
                        title="Drag and drop your image here"
                        text="Allowed .jpg .png .jpeg"
                        accept={['images']}
                        actionUpload={(e)=>_uploadFile(e)}
                        actionDelete={(e)=> uploadedPhoto?.isNew ? _removeTempFile(e) : null}
                    />

                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <button type="submit" className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Save</button>
                        </div>
                    </div>

                </Form>
            </div>

        </>
    );
}

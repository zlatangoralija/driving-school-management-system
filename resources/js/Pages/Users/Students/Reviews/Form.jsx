import React, {Fragment} from "react";
import {Head, router, usePage} from "@inertiajs/react";
import InputText from "@/Components/InputText.jsx";
import {Form} from "@unform/web";
import * as Yup from "yup";
import SelectDefault from "@/Components/SelectDefault.jsx";
import FlashNotification from "@/Components/FlashNotification.jsx";
import InputTextarea from "@/Components/InputTextarea.jsx";
import InputTextMasked from "@/Components/InputTextMasked.jsx";
import InputCurrency from "@/Components/InputCurrency.jsx";

export default function CreateForm(props) {
    const formRef = React.useRef(null);
    const wrapperRef = React.useRef(null);
    const {flash} = usePage().props;

    const [modal, setModal] = React.useState(false);
    const [successNotice, setSuccessNotice] = React.useState(null);
    const [errorNotice, setErrorNotice] = React.useState(null);

    const ratings = [
        { value: '1', label: '1', },
        { value: '2', label: '2', },
        { value: '3', label: '3', },
        { value: '4', label: '4', },
        { value: '5', label: '5', },
    ];

    const submit = async () => {
        try {
            const formData = formRef.current.getData();

            // Remove all previous errors
            formRef.current.setErrors({});

            const schema = Yup.object().shape({
                feedback: Yup.string().required("Course name is required."),
                rating: Yup.array().required("Please select payment option."),
            });

            await schema.validate(formData, {
                abortEarly: false,
            });

            let finalData = {
                ...formData,
                course: props.course.id,
                instructor: props.instructor.id,
                pivot_id: props.pivot_id,
                rating:
                    formData.rating.length > 0
                        ? formData.rating[0].value
                        : null,
            };

            router.post(route("students.reviews.store"), finalData, {
                onError: (errors) => {
                    formRef.current.setErrors(errors);
                },
            });

            return;
        } catch (err) {
            console.log(err);
            wrapperRef.current.scrollIntoView({behavior: "smooth"});
            const validationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                formRef.current.setErrors(validationErrors);
            }
        }
    };

    React.useEffect(() => {
        if (flash && Object.keys(flash).length) {
            if (flash.success) {
                setSuccessNotice(flash.success);
            }

            if (flash.errors) {
                setErrorNotice(flash.errors);
            }

            if (successNotice || errorNotice) {
                wrapperRef.current.scrollIntoView({behavior: "smooth"});
            }
        }
    }, [flash]);

    return (
        <>
            <Head title={'Leave a review'}/>

            <div className="mx-auto mt-6 mb-10" ref={wrapperRef}>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Leave a review
                </h1>
                <p className="mt-2 text-sm">Lorem ipsum text</p>
            </div>

            {successNotice && flash.success && (
                <FlashNotification type="success" title={flash.success}/>
            )}

            {errorNotice && flash && (
                <FlashNotification
                    type="error"
                    title="Please fix the following errors"
                    list={errorNotice}
                    button={
                        <button
                            type="button"
                            className="_button small !whitespace-nowrap"
                            onClick={() => setErrorNotice(null)}
                        >
                            close
                        </button>
                    }
                />
            )}

            <div className="grid grid-cols-0 md:grid-cols-0 gap-6">
                <Form ref={formRef} onSubmit={submit} className="card p-5 mb-3">
                    <InputTextarea name="feedback" label="Leave your feedback here*"/>
                    <SelectDefault
                        options={ratings}
                        label="Rating"
                        name="rating"
                    />


                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <button type="submit" className="button button-blue">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}

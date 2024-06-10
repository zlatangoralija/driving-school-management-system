import React, { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import {Head, Link, router, useForm, usePage} from '@inertiajs/react';
import Logo from "../../../images/full-logo-vertical.png";
import FlashNotification from "@/Components/FlashNotification.jsx";

export default function Register(props) {
    const { flash } = usePage().props
    const [ successNotice, setSuccessNotice ] = React.useState(null)
    const [ errorNotice, setErrorNotice ] = React.useState(null)
    const wrapperRef = React.useRef(null)

    console.log(successNotice, errorNotice);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        school_name: '',
        email: '',
        address: '',
        phone: '',
        password: '',
        password_confirmation: '',
        plan_id: props.plan_id,
        plan_name: props.plan_name,
        plan_qty: props.plan_qty,
        trial: props.trial,
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        router.post(route('register'), data, {
            onSuccess: (res) => {
                console.log(res)
            },
            onError: (errors) => {
                console.log(errors);
            }
        })
    };

    console.log(flash, props);

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
            <Head title="Register" />

            <div className="min-h-screen min-w-full flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div ref={wrapperRef}>
                    <Link href="/">
                        <img src={Logo} className="h-20 mr-3 sm:h-40" alt="Landwind Logo"/>
                    </Link>
                </div>

                <p>Register Driving School: Instructors and Owners Only</p>

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

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <form onSubmit={submit}>
                        <div>

                            <InputLabel htmlFor="school_name" value="School name*" />

                            <TextInput
                                id="school_name"
                                name="school_name"
                                value={data.school_name}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('school_name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="name" value="Name*" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="address" value="Address *" />

                            <TextInput
                                id="address"
                                name="address"
                                value={data.address}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('address', e.target.value)}
                                required
                            />

                            <InputError message={errors.address} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="phone" value="Phone *" />

                            <TextInput
                                id="phone"
                                name="phone"
                                value={data.phone}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email *" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Link
                                href={route('login')}
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Already registered?
                            </Link>

                            <button className="ml-3 text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:ring-primary-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none" disabled={processing}>
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

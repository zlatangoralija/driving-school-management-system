import Logo from '../../images/logo.png'
import {Link} from "@inertiajs/react";
import React from "react";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {_navItem, _timeout} from "@/Components/Helpers.jsx";

export default function Header(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    const handleClick = async(e) => {
        if(mobileMenuOpen){
            await _timeout(100)
            setMobileMenuOpen(false)
        }
    };

    React.useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    });

    return (
        <>
            <header className="bg-white border-b mb-10">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6" aria-label="Global">
                    <div className="flex items-center gap-x-12">
                        <a href={route('home')} className="flex items-center">
                            <img src={props.layout.logo ? props.layout.logo : Logo} className="h-6 mr-3 sm:h-10" alt="DrivePlanX Logo"/>
                        </a>
                        <div className="hidden lg:flex lg:gap-x-12">
                            <Link href="#" className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                Link 1
                            </Link>
                            <Link href="#" className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                Link 2
                            </Link>
                            <Link href="#" className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                Link 3
                            </Link>
                        </div>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex items-center gap-3">
                        {props.auth?.user
                            ?
                                <a href={props.auth.dashboard_url} className="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:ring-primary-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Dashboard</a>
                            :
                                <>
                                    <a href="https://calendly.com/asimdeveloper23" target="_blank" className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                        Book a demo
                                    </a>
                                    <p>|</p>
                                    <Link href={route('login')} className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:ring-primary-800 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Start trial</Link>
                                </>
                        }
                    </div>
                </nav>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 !z-[99999]" />
                    <Dialog.Panel className="fixed inset-y-0 right-0 !z-[99999] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href={route('home')} className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img className="h-8 w-auto" src={Logo}
                                    alt=""
                                />
                            </a>
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <Link href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Link 1
                                    </Link>

                                    <Link href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Link 2
                                    </Link>

                                    <Link href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                        Link 3
                                    </Link>
                                </div>
                                <hr/>

                                <div className="py-6">
                                    {props.auth?.user
                                        ?
                                            <>
                                                <a href={props.auth.dashboard_url} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Dashboard</a>
                                                {!props.layout.hide_sidebar &&
                                                    <>
                                                        {props.layout?.sidebar_menu && props.layout?.sidebar_menu.map((item,index)=>{
                                                            if(item.name !== 'Dashboard'){
                                                                return <Link key={index} href={item.url} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">{item.name}</Link>
                                                            }
                                                        })}
                                                    </>
                                                }
                                            </>
                                        :
                                        <>
                                            <a href="https://calendly.com/asimdeveloper23" target="_blank" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                Book a demo
                                            </a>
                                            <Link replace preserveState={false} href={route('login')} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                                                Log in
                                            </Link>
                                            <Link href={route('register')} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Start trial</Link>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>
        </>
    );
}

import Logo from '../../images/logo.jpg'
import {Link} from "@inertiajs/react";
import React from "react";
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Product', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Marketplace', href: '#' },
    { name: 'Company', href: '#' },
]

export default function Header(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    return (
        <>
            <header className="bg-white border-b">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6" aria-label="Global">
                    <div className="flex items-center gap-x-12">
                        <a href={route('home')} className="flex items-center">
                            <img src={props.layout.logo ? props.layout.logo : Logo} className="h-6 mr-3 sm:h-9" alt="DrivePlanX Logo"/>
                            <span className="self-center text-xl font-semibold whitespace-nowrap">DrivePlanX</span>
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
                                <a href={props.auth.dashboard_url} className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Dashboard</a>
                            :
                                <>
                                    <a href="https://calendly.com/asimdeveloper23" target="_blank" className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                        Book a demo
                                    </a>
                                    <p>|</p>
                                    <Link href={route('login')} className="font-semibold leading-6 text-gray-900 hover:text-primary">
                                        Log in
                                    </Link>
                                    <Link href={route('register')} className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Start trial</Link>
                                </>
                        }
                    </div>
                </nav>
                <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
                    <div className="fixed inset-0 z-10" />
                    <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
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
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                                <div className="py-6">
                                    <a
                                        href="#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                    >
                                        Log in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Dialog>
            </header>
            {/*<header className="fixed w-full border-b border-r-gray-100 z-[99999]">*/}
            {/*    <nav className="bg-white border-gray-200 py-2.5">*/}
            {/*        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">*/}
            {/*            <a href={route('home')} className="flex items-center">*/}
            {/*                <img src={props.layout.logo ? props.layout.logo : Logo} className="h-6 mr-3 sm:h-9" alt="DrivePlanX Logo"/>*/}
            {/*                <span className="self-center text-xl font-semibold whitespace-nowrap">DrivePlanX</span>*/}
            {/*            </a>*/}
            {/*            <div className="flex items-center lg:order-2">*/}
            {/*                {props.auth?.user*/}
            {/*                    ? <a href={props.auth.dashboard_url} className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Dashboard</a>*/}
            {/*                    :*/}
            {/*                    <div className="flex items-center gap-2">*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Book a demo</a>*/}
            {/*                        <p>|</p>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Login</a>*/}
            {/*                        <Link href={route('register')} className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none">Start trial</Link>*/}
            {/*                    </div>*/}
            {/*                }*/}

            {/*                <button data-collapse-toggle="mobile-menu-2" type="button"*/}
            {/*                        className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"*/}
            {/*                        aria-controls="mobile-menu-2" aria-expanded="false">*/}
            {/*                    <span className="sr-only">Open main menu</span>*/}
            {/*                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"*/}
            {/*                         xmlns="http://www.w3.org/2000/svg">*/}
            {/*                        <path fillRule="evenodd"*/}
            {/*                              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"*/}
            {/*                              clipRule="evenodd"></path>*/}
            {/*                    </svg>*/}
            {/*                    <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"*/}
            {/*                         xmlns="http://www.w3.org/2000/svg">*/}
            {/*                        <path fillRule="evenodd"*/}
            {/*                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"*/}
            {/*                              clipRule="evenodd"></path>*/}
            {/*                    </svg>*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*            <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1"*/}
            {/*                 id="mobile-menu-2">*/}
            {/*                <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">*/}
            {/*                    <li>*/}
            {/*                        <a href="#"*/}
            {/*                           className="block py-2 pl-3 pr-4 text-white bg-purple-700 rounded lg:bg-transparent lg:text-purple-700 lg:p-0"*/}
            {/*                           aria-current="page">Home</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Link 1</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Link 2</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Link 3</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Link 4</a>*/}
            {/*                    </li>*/}
            {/*                    <li>*/}
            {/*                        <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0">Contact</a>*/}
            {/*                    </li>*/}
            {/*                </ul>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </nav>*/}
            {/*</header>*/}
        </>
    );
}

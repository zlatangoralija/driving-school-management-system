import Logo from "../../images/full-logo-white-bg.png";
import {Link, router} from "@inertiajs/react";
import React from "react";
import {Dialog, Disclosure, Menu, Transition} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import {_navItem, _timeout} from "@/Components/Helpers.jsx";
import {
    ChevronDownIcon,
    ChevronRightIcon,
} from "@heroicons/react/16/solid/index.js";
import {Fragment} from "react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Header(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleClick = async (e) => {
        if (mobileMenuOpen) {
            await _timeout(100);
            setMobileMenuOpen(false);
        }
    };

    // React.useEffect(() => {
    //     document.addEventListener("mousedown", handleClick);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClick);
    //     };
    // });

    return (
        <>
            <header className="bg-white border-b">
                <div className="container">
                    <nav
                        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6"
                        aria-label="Global"
                    >
                        <div className="flex items-center gap-x-12">
                            <a href={route("home")} className="flex items-center">
                                <img
                                    src={props.layout.logo ? props.layout.logo : Logo}
                                    className="h-6 mr-3 sm:h-10"
                                    alt="DrivePlanX Logo"
                                />
                            </a>
                            <div className="hidden lg:flex lg:gap-x-12">
                                <Link
                                    href="#"
                                    className="font-semibold leading-6 text-gray-900 hover:text-primary"
                                >
                                    Link 1
                                </Link>
                                <Link
                                    href="#"
                                    className="font-semibold leading-6 text-gray-900 hover:text-primary"
                                >
                                    Link 2
                                </Link>
                                <Link
                                    href="#"
                                    className="font-semibold leading-6 text-gray-900 hover:text-primary"
                                >
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
                                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="hidden lg:flex items-center gap-3">
                            {props.auth?.user ? (
                                <>
                                    {props.layout.is_homepage ?
                                        <a
                                            href={props.auth.dashboard_url}
                                            className="button button-blue"
                                        >
                                            Dashboard
                                        </a>
                                        :
                                        <Menu as="div" className="relative inline-block text-left">
                                            <div>
                                                <Menu.Button
                                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                    {props.auth.user.name}
                                                    <ChevronDownIcon
                                                        className="-mr-1 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </Menu.Button>
                                            </div>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items
                                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[9999]">
                                                    <div className="py-1">
                                                        <Menu.Item>
                                                            {({active}) => (
                                                                <a
                                                                    href={props.auth.dashboard_url}
                                                                    className={classNames(
                                                                        active
                                                                            ? "bg-gray-100 text-gray-900"
                                                                            : "text-gray-700",
                                                                        "block px-4 py-2 text-sm"
                                                                    )}
                                                                >
                                                                    Dashboard
                                                                </a>
                                                            )}
                                                        </Menu.Item>

                                                        {props.layout.settings_menu &&
                                                            props.layout.settings_menu.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <Menu.Item>
                                                                            {({active}) => (
                                                                                <a
                                                                                    key={index}
                                                                                    href={item.url}
                                                                                    className={classNames(
                                                                                        active
                                                                                            ? "bg-gray-100 text-gray-900"
                                                                                            : "text-gray-700",
                                                                                        "block px-4 py-2 text-sm"
                                                                                    )}
                                                                                >
                                                                                    {item.name}
                                                                                </a>
                                                                            )}
                                                                        </Menu.Item>
                                                                    </>
                                                                );
                                                            })}

                                                        <Menu.Item>
                                                            {({active}) => (
                                                                <a
                                                                    href={route("logout")}
                                                                    className={classNames(
                                                                        active
                                                                            ? "bg-gray-100 text-gray-900"
                                                                            : "text-gray-700",
                                                                        "block px-4 py-2 text-sm"
                                                                    )}
                                                                >
                                                                    Log out
                                                                </a>
                                                            )}
                                                        </Menu.Item>
                                                    </div>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    }
                                </>
                            ) : (
                                <>
                                    <a
                                        href="https://calendly.com/asimdeveloper23"
                                        target="_blank"
                                        className="font-semibold leading-6 text-gray-900 hover:text-primary"
                                    >
                                        Book a demo
                                    </a>
                                    <p>|</p>
                                    <Link
                                        href={route("login")}
                                        className="font-semibold leading-6 text-gray-900 hover:text-primary"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register", {trial: true})}
                                        className="button button-blue"
                                    >
                                        Start trial
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                    <Dialog
                        as="div"
                        className="lg:hidden"
                        open={mobileMenuOpen}
                        onClose={setMobileMenuOpen}
                    >
                        <div className="fixed inset-0 !z-[99999]"/>
                        <Dialog.Panel
                            className="fixed inset-y-0 right-0 !z-[99999] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <a href={route("home")} className="-m-1.5 p-1.5">
                                    <span className="sr-only">Your Company</span>
                                    <img className="h-8 w-auto" src={Logo} alt=""/>
                                </a>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        <Link
                                            href="#"
                                            onClick={() => handleClick()}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Link 1
                                        </Link>

                                        <Link
                                            href="#"
                                            onClick={() => handleClick()}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Link 2
                                        </Link>

                                        <Link
                                            href="#"
                                            onClick={() => handleClick()}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Link 3
                                        </Link>
                                    </div>
                                    <hr/>

                                    <div className="py-6">
                                        {props.auth?.user ? (
                                            <>
                                                <a
                                                    href={props.auth.dashboard_url}
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                >
                                                    Dashboard
                                                </a>
                                                {!props.layout.hide_sidebar && (
                                                    <>
                                                        {props.layout?.sidebar_menu &&
                                                            props.layout?.sidebar_menu.map((item, index) => {
                                                                if (item.name !== "Dashboard") {
                                                                    return (
                                                                        <Link
                                                                            onClick={() => handleClick()}
                                                                            key={index}
                                                                            href={item.url}
                                                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                                        >
                                                                            {item.name}
                                                                        </Link>
                                                                    );
                                                                }
                                                            })}

                                                        <Disclosure as="div">
                                                            {({open}) => (
                                                                <>
                                                                    <Disclosure.Button
                                                                        className={classNames(
                                                                            "hover:bg-gray-50",
                                                                            "flex items-center w-full text-left -mx-4 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                                        )}
                                                                    >
                                                                        <ChevronRightIcon
                                                                            className={classNames(
                                                                                open
                                                                                    ? "rotate-90 text-gray-500"
                                                                                    : "text-gray-400",
                                                                                "h-5 w-5 shrink-0 text-base font-semibold text-gray-900"
                                                                            )}
                                                                            aria-hidden="true"
                                                                        />
                                                                        Settings
                                                                    </Disclosure.Button>
                                                                    <Disclosure.Panel
                                                                        as="ul"
                                                                        className="mt-1 px-2"
                                                                    >
                                                                        {props.layout.settings_menu.map(
                                                                            (subItem) => (
                                                                                <li key={subItem.name}>
                                                                                    <Disclosure.Button
                                                                                        as="a"
                                                                                        href={subItem.url}
                                                                                        className={classNames(
                                                                                            subItem.current
                                                                                                ? "bg-gray-50"
                                                                                                : "hover:bg-gray-50",
                                                                                            "block rounded-md py-2 pr-2 pl-9 text-base font-semibold leading-7 text-gray-900"
                                                                                        )}
                                                                                    >
                                                                                        {subItem.name}
                                                                                    </Disclosure.Button>
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </Disclosure.Panel>
                                                                </>
                                                            )}
                                                        </Disclosure>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <a
                                                    href="https://calendly.com/asimdeveloper23"
                                                    target="_blank"
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                >
                                                    Book a demo
                                                </a>
                                                <Link
                                                    replace
                                                    preserveState={false}
                                                    href={route("login")}
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                >
                                                    Log in
                                                </Link>
                                                <Link
                                                    href={route("register", {trial: true})}
                                                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                                >
                                                    Start trial
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                </div>
            </header>
        </>
    );
}

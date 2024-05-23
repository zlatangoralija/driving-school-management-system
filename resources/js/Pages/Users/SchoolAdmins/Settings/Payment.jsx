import React from "react";
import {Head} from "@inertiajs/react";

export default function Payment(props) {
    return (
        <>

            <Head title="Payment settings" />

            <div className="mx-auto mt-6 mb-10">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Payment settings</h1>
                <p className="mt-2 text-sm">
                    Lorem ipsum text
                </p>
            </div>

            {props.active_integration
                ?
                    <>
                        <div className="bg-white shadow sm:rounded-lg mb-3">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Stripe integration</h3>
                                <div className="mt-5">
                                    <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                                        <h4 className="sr-only">Stripe</h4>
                                        <p>Checkout your personal stripe dashboard.</p>
                                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                            <a href={props.express_dashboard}
                                               target="_blank"
                                               type="button"
                                               className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Dashboard
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                :
                    <>
                        <div className="bg-white shadow sm:rounded-lg mb-3">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-base font-semibold leading-6 text-gray-900">Stripe integration</h3>
                                <div className="mt-5">
                                    <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                                        <h4 className="sr-only">Stripe</h4>
                                        <p>Connect your stripe account to be eligible for payouts.</p>
                                        <div className="mt-4 sm:ml-6 sm:mt-0 sm:flex-shrink-0">
                                            <a href={props.connect_url}
                                               type="button"
                                               className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                Connect
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
            }
        </>
    );
}

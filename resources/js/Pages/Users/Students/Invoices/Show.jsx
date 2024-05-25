import {Head} from "@inertiajs/react";
import React from "react";
import DataTableComponent from "@/Components/DataTable.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";

export default function Show(props) {

    return (
        <>
            <Head title={"Invoices"} />

            <div className="mx-auto mt-6 mb-10 flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Invoices</h1>
                    <p className="mt-2 text-sm">
                        Lorem ipsum text
                    </p>
                </div>
            </div>

            <div className="card grid grid-cols-0 md:grid-cols-0 gap-6 p-5 mb-3">
                <p>Description: {props.invoice.description}</p>
                <p>Amount: ${props.invoice.amount}</p>
                <p>Date: {timezoneDate(props.invoice.created_at).format('DD/MM/YYYY HH:mm')}</p>
            </div>
        </>
    );
}

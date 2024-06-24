import {Head} from "@inertiajs/react";
import React from "react";
import DataTableComponent from "@/Components/DataTable.jsx";
import {timezoneDate} from "@/Components/Helpers.jsx";
import Logo from "../../../../../images/full-logo-white-bg.png"

export default function Show(props) {

    return (
        <>
            <Head title={"Invoices"} />

            <div className="mx-auto mt-6 mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Invoices</h1>
                    <p className="mt-2 text-sm">
                        Lorem ipsum text
                    </p>
                </div>
                <a href={route('students.download-invoice', {'invoice': props.invoice})} target="_blank" className="button button-blue">Download</a>
            </div>

            <div class="bg-white rounded-lg shadow-lg px-8 py-10 mx-auto">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center">
                        <img className="h-10 mr-2"
                             src={Logo}
                             alt="Logo"/>
                    </div>
                    <div class="text-gray-700">
                        <div class="font-bold text-xl mb-2">INVOICE</div>
                        <div class="text-sm">Date: {timezoneDate(props.invoice.created_at).format("DD/MM/YYYY")}</div>
                        <div class="text-sm">Invoice #DPX-{props.invoice.id}</div>
                    </div>
                </div>
                <div class="border-b-2 border-gray-300 pb-8 mb-8">
                    <h2 class="text-2xl font-bold mb-4">Bill To:</h2>
                    <div class="text-gray-700 mb-2">{props.invoice.student.name}</div>
                    <div class="text-gray-700">{props.invoice.student.email}</div>
                </div>
                <table className="w-full text-left mb-8">
                    <thead>
                    <tr>
                        <th className="text-gray-700 font-bold uppercase py-2">Description</th>
                        <th className="text-gray-700 font-bold uppercase py-2">Price</th>
                        <th className="text-gray-700 font-bold uppercase py-2 text-right">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="py-4 text-gray-700">{props.invoice.description}</td>
                        <td className="py-4 text-gray-700">{props.invoice.amount} EUR</td>
                        <td className="py-4 text-gray-700 text-right">{props.invoice.amount} EUR</td>
                    </tr>
                    </tbody>
                </table>
                <div class="flex justify-end mb-8">
                    <div class="text-gray-700 mr-2">Subtotal:</div>
                    <div class="text-gray-700">{props.invoice.amount} EUR</div>
                </div>
                <div class="flex justify-end mb-8">
                    <div class="text-gray-700 mr-2">Total:</div>
                    <div class="text-gray-700 font-bold text-xl">{props.invoice.amount} EUR</div>
                </div>
                <div class="border-t-2 border-gray-300 pt-8 mb-8">
                    <div class="text-gray-700 mb-2">Lorem ipsum text.</div>
                </div>
            </div>
        </>
    );
}

import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 text-gray-900">You're logged in as school admin!</div>
        </>
    );
}

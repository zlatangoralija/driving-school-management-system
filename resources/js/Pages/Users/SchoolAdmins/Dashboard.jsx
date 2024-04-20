import { Head } from '@inertiajs/react';

export default function Dashboard(props) {
    console.log(props);
    return (
        <>
            <Head title="Dashboard" />

            <div className="p-6 text-gray-900">You're logged in as school admin!</div>

            {props.admins &&
                <>
                    <p>Admins</p>
                    <ul className="list-disc pl-5">
                        {props.admins.map((admin) => {
                            return <li>{admin.name} - {admin.email}</li>
                        })}
                    </ul>
                </>
            }

            {props.instructors &&
                <>
                    <p className="mt-5">Instructors</p>
                    <ul className="list-disc pl-5">
                        {props.instructors.map((instructor) => {
                            return <li>{instructor.name} - {instructor.email}</li>
                        })}
                    </ul>
                </>
            }

            {props.students &&
                <>
                    <p className="mt-5">Students</p>
                    <ul className="list-disc pl-5">
                        {props.students.map((student) => {
                            return <li>{student.name} - {student.email}</li>
                        })}
                    </ul>
                </>
            }

        </>
    );
}

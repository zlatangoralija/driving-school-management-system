import {Head, router} from "@inertiajs/react";
import React from "react";
import {Menu, Transition} from "@headlessui/react";
import {
    ArchiveBoxIcon,
    ArrowRightCircleIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon,
    HeartIcon,
    PencilSquareIcon,
    TrashIcon,
    UserPlusIcon,
} from "@heroicons/react/16/solid/index.js";
import {Fragment} from "react";
import {Form} from "@unform/web";
import SelectDefault from "@/Components/SelectDefault.jsx";
import Modal from "@/Components/Modal.jsx";
import * as Yup from "yup";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Show(props) {
    const [bookingInviteModal, setBookingInviteModal] = React.useState();
    const [studentBookingModal, setStudentBookingModal] = React.useState();
    const [studentID, setStudentID] = React.useState();

    const bookingInviteForm = React.useRef(null);

    const submitBookingInvitation = async (data) => {
        try {
            //Validate form
            const schema = Yup.object().shape({
                student_id: Yup.array()
                    .min(1, "Please select a student")
                    .required("Please select a student"),
            });

            await schema.validate(data, {
                abortEarly: false,
            });

            let finalData = {
                ...data,
                student_id:
                    data.student_id.length > 0 ? data.student_id[0].value : null,
                course_id: bookingInviteModal?.course_id,
            };

            router.post(route("instructors.courses.invite-to-book"), finalData, {
                onSuccess: (dres) => {
                    setBookingInviteModal(false);
                },
                onError: (errors) => {
                    bookingInviteForm.current.setErrors(errors);
                },
            });
        } catch (err) {
            const validationErrors = {};
            if (err instanceof Yup.ValidationError) {
                err.inner.forEach((error) => {
                    validationErrors[error.path] = error.message;
                });
                bookingInviteForm.current.setErrors(validationErrors);
            }
        }
    };

    return (
        <>
            <Head title={props.course.name}/>

            <div className="mx-auto mt-6 mb-10 flex justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        {props.course.name}
                    </h1>
                    <p className="mt-2 text-sm">Lorem ipsum text</p>
                </div>

                {/*<Menu as="div" className="relative inline-block text-left">*/}
                {/*    <div>*/}
                {/*        <Menu.Button*/}
                {/*            className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">*/}
                {/*            Booking options*/}
                {/*            <ChevronDownIcon*/}
                {/*                className="-mr-1 h-5 w-5 text-gray-400"*/}
                {/*                aria-hidden="true"*/}
                {/*            />*/}
                {/*        </Menu.Button>*/}
                {/*    </div>*/}

                {/*    <Transition*/}
                {/*        as={Fragment}*/}
                {/*        enter="transition ease-out duration-100"*/}
                {/*        enterFrom="transform opacity-0 scale-95"*/}
                {/*        enterTo="transform opacity-100 scale-100"*/}
                {/*        leave="transition ease-in duration-75"*/}
                {/*        leaveFrom="transform opacity-100 scale-100"*/}
                {/*        leaveTo="transform opacity-0 scale-95"*/}
                {/*    >*/}
                {/*        <Menu.Items*/}
                {/*            className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">*/}
                {/*            <div className="py-1">*/}
                {/*                <Menu.Item>*/}
                {/*                    {({active}) => (*/}
                {/*                        <a*/}
                {/*                            href="#"*/}
                {/*                            className={classNames(*/}
                {/*                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",*/}
                {/*                                "group flex items-center px-4 py-2 text-sm"*/}
                {/*                            )}*/}
                {/*                            onClick={() =>*/}
                {/*                                setBookingInviteModal({*/}
                {/*                                    invitation_url: props.course.invitation_url,*/}
                {/*                                    course_id: props.course.id,*/}
                {/*                                })*/}
                {/*                            }*/}
                {/*                        >*/}
                {/*                            <PencilSquareIcon*/}
                {/*                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"*/}
                {/*                                aria-hidden="true"*/}
                {/*                            />*/}
                {/*                            Invite to book*/}
                {/*                        </a>*/}
                {/*                    )}*/}
                {/*                </Menu.Item>*/}
                {/*                <Menu.Item>*/}
                {/*                    {({active}) => (*/}
                {/*                        <a*/}
                {/*                            href="#"*/}
                {/*                            className={classNames(*/}
                {/*                                active ? "bg-gray-100 text-gray-900" : "text-gray-700",*/}
                {/*                                "group flex items-center px-4 py-2 text-sm"*/}
                {/*                            )}*/}
                {/*                            onClick={() =>*/}
                {/*                                setStudentBookingModal({course_id: props.course.id})*/}
                {/*                            }*/}
                {/*                        >*/}
                {/*                            <DocumentDuplicateIcon*/}
                {/*                                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"*/}
                {/*                                aria-hidden="true"*/}
                {/*                            />*/}
                {/*                            Book for a student*/}
                {/*                        </a>*/}
                {/*                    )}*/}
                {/*                </Menu.Item>*/}
                {/*            </div>*/}
                {/*        </Menu.Items>*/}
                {/*    </Transition>*/}
                {/*</Menu>*/}
            </div>

            <div className="w-full mb-6">
                <div className="card-gray-label flex gap-2">
                    <span className="title">Course:</span>
                    <span className="data">{props.course.name}</span>
                </div>
                <div className="card card-gray">
                    <div className="flex gap-2">
                        <span className="title">Description:</span>
                        <span className="data">{props.course.description}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Number of lessons:</span>
                        <span className="data">{props.course.number_of_lessons}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Payment option:</span>
                        <span className="data">{props.course.payment_option_label}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="title">Price:</span>
                        <span className="data">{props.course.price} EUR</span>
                    </div>
                </div>
            </div>

            <Modal
                className="max-w-3xl"
                status={bookingInviteModal}
                close={() => setBookingInviteModal(false)}
                title={"Invite to book"}
                content={
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex justify-center flex-col mb-3 text-center">
                                <p className="text-lg">
                                    Send this link to your student directly
                                </p>
                                <p className="text-lg text-primary">
                                    {bookingInviteModal?.invitation_url}
                                </p>
                            </div>

                            <p className="text-lg mb-3">OR</p>

                            <p className="text-lg">
                                Send them an invitation to book to via email
                            </p>

                            <Form
                                ref={bookingInviteForm}
                                onSubmit={submitBookingInvitation}
                                className="w-full"
                            >
                                <SelectDefault
                                    name="student_id"
                                    label="Student*"
                                    options={Object.entries(props.students).map(
                                        ([value, label]) => ({value, label})
                                    )}
                                />
                            </Form>
                        </div>
                    </div>
                }
                footer={
                    <div className="footer-modal">
                        <button
                            type="button"
                            onClick={() => setBookingInviteModal(false)}
                            className="button button-blue-outline w-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => bookingInviteForm.current.submitForm()}
                            className="button button-blue w-full"
                        >
                            Invite to book
                        </button>
                    </div>
                }
            />

            <Modal
                className="max-w-3xl"
                status={studentBookingModal}
                close={() => setBookingInviteModal(false)}
                title={"Invite to book"}
                content={
                    <div>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-lg">
                                Select a student you want to book this course for
                            </p>

                            <Form
                                ref={bookingInviteForm}
                                onSubmit={submitBookingInvitation}
                                className="w-full"
                            >
                                <SelectDefault
                                    name="student_id"
                                    label="Student*"
                                    options={Object.entries(props.students).map(
                                        ([value, label]) => ({value, label})
                                    )}
                                    onChange={(e) => setStudentID(e.value)}
                                />
                            </Form>
                        </div>
                    </div>
                }
                footer={
                    <div className="footer-modal">
                        <button
                            type="button"
                            onClick={() => setStudentBookingModal(false)}
                            className="button button-blue-outline w-full"
                        >
                            Cancel
                        </button>
                        <a
                            href={route("instructors.bookings-calendar", {
                                course_id: props.course.id,
                                student_id: studentID,
                            })}
                            onClick={()=> book(startDate)}
                            className="button button-blue w-full"
                        >
                            Go to booking
                        </a>
                    </div>
                }
            />
        </>
    );
}

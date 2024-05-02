import {Link} from "@inertiajs/react";
import {ChevronRightIcon, HomeIcon} from "@heroicons/react/16/solid/index.js";

export default function Breadcrumbs(props) {
    return (
        <>
            <>
                {props.breadcrumbs && props.breadcrumbs.length &&
                    <>
                        <nav className="flex mt-7" aria-label="Breadcrumb">
                            <ol role="list" className="flex items-center space-x-4">
                                <li>
                                    <div>
                                        <a href={route('home')} className="text-gray-400 hover:text-gray-500">
                                            <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            <span className="sr-only">Home</span>
                                        </a>
                                    </div>
                                </li>
                                {props.breadcrumbs.map((item, index) => (
                                    <li key={index}>
                                        <div className="flex items-center">
                                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                            <Link
                                                href={item.url}
                                                className={`ml-4 text-sm font-medium ${item.active ? "text-primary hover:text-primary-800" : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                {item.page}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </>
                }
            </>
        </>
    );
}

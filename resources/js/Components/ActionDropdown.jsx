import React from "react";
import { Menu } from "@headlessui/react";
import { Link } from "@inertiajs/react";

const ActionDropdown = ({ row, index }) => {
  const items = [
    {
      label: "View",
      href: route("students.bookings.show", { booking: row.id }),
    },
    ...(!row.status
      ? [
          {
            label: "Book",
            href: route("students.bookings.edit", { booking: row.id }),
          },
        ]
      : []),
    ...(row.status && !row.payment_status
      ? [
          {
            label: "Pay",
            href: route("students.bookings.pay", { booking: row.id }),
          },
        ]
      : []),
  ];

  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button>...</Menu.Button>
            <Menu.Items
              className={`absolute ${
                index === 0
                  ? "origin-top-right top-full"
                  : "origin-bottom-right bottom-full"
              } right-0 z-50 mt-2 w-56 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="py-1">
                {items.map((item, idx) => (
                  <Menu.Item key={idx}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={`${
                          active ? "bg-gray-100" : ""
                        } block px-4 py-2 text-sm text-gray-700`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  );
};

export default ActionDropdown;

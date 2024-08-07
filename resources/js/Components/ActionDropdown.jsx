import React from "react";
import { Menu } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import { FiMoreVertical } from "react-icons/fi";
import { HiMiniEye } from "react-icons/hi2";

const ActionDropdown = ({ items, index }) => {
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button>
              <FiMoreVertical />
            </Menu.Button>
            <Menu.Items
              className={`absolute ${
                index === 0
                  ? "origin-top-right top-[-80px]"
                  : "origin-bottom-right bottom-0"
              } right-[16px] max-h-[97px] overflow-auto z-50 mt-2 w-56 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
            >
              <div className="py-1">
                {items.map((item, idx) => (
                  <Menu.Item key={idx}>
                    {({ active }) => (
                      <>
                        {item.blank ? (
                          <a
                            href={item.href || "#"}
                            target="_blank"
                            onClick={(e) => {
                              if (item.action) {
                                e.preventDefault();
                                item.action();
                              }
                            }}
                            className={`${active ? "bg-gray-100" : ""} ${
                              item.color ? item.color : "text-gray-700"
                            } flex items-center gap-3 px-4 py-2 text-md`}
                          >
                            {item.icon ? item.icon : ""} {item.label}
                          </a>
                        ) : (
                          <Link
                            href={item.href || "#"}
                            onClick={(e) => {
                              if (item.action) {
                                e.preventDefault();
                                item.action();
                              }
                            }}
                            className={`${active ? "bg-gray-100" : ""} ${
                              item.color ? item.color : "text-gray-700"
                            } flex items-center gap-3 px-4 py-2 text-md`}
                          >
                            {item.icon ? item.icon : ""} {item.label}
                          </Link>
                        )}
                      </>
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

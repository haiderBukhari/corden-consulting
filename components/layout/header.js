import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import Notification from '../common/notifications/NotificationsComponents'
import Image from 'next/image';

const userNavigation = [
    { name: 'Sign out', href: '#' },
]

const roleOptions = [
    { value: 'manager', label: 'Manager', description: 'View-only access' },
    { value: 'hr_manager', label: 'HR Manager', description: 'Edit access with controlled history tracking' },
    { value: 'business_manager', label: 'Business Configuration Manager', description: 'Full system admin + configuration access' },
];

const Header = ({ user }) => {
    const [currentRole, setCurrentRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem('role');
        setCurrentRole(role);
    }, []);

    const handleRoleChange = (newRole) => {
        localStorage.setItem('role', newRole);
        setCurrentRole(newRole);
        // Refresh the page to update the view
        window.location.href = '/demo/dashboard'
        // window.location.reload();
    };
    return (
        <header className="text-default_text">
            <div className="sticky top-0 capitalize z-40 flex lg:ml-64 shadow-md  h-14 items-center gap-x-4 border-b border-gray-200 bg-white px-4">
                {user &&
                    <div className='text-sm  sm:text-base'>
                        Welcome Back, {user?.role === 'admin' || user?.role === 'HR' ? `${user?.role}` : user?.name} ☀
                    </div>


                }
                <div className='flex-1' />

                {/* Role Selector Dropdown */}
                <Menu as="div" className="relative mr-4">
                    <Menu.Button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <span className="mr-2">Role: {currentRole ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1).replace('_', ' ') : 'Select Role'}</span>
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-20 mt-1 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {roleOptions.map((role) => (
                                    <Menu.Item key={role.value}>
                                        {({ active }) => (
                                            <button
                                                onClick={() => handleRoleChange(role.value)}
                                                className={`${
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } block px-4 py-3 text-sm w-full text-left hover:bg-gray-50`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{role.label}</div>
                                                        <div className="text-xs text-gray-500">{role.description}</div>
                                                    </div>
                                                    {currentRole === role.value && (
                                                        <div className="text-blue-600">
                                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>

                {user?.role !== 'staff' &&
                    <Notification />
                }

                <div className="flex justify-end">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative">
                        <Menu.Button className=" flex items-center p-4">
                            <span className="sr-only">Open user menu</span>
                            <div>
                                <span className="hidden lg:flex lg:items-center">
                                    <div>
                                        <Image
                                            src={"https://media.licdn.com/dms/image/v2/C4D03AQEidZ-CEcQe9A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1576281019201?e=1755734400&v=beta&t=APj4JDrKON6jiuOTKnt46JQJn8NEkw-4uAq6EgESRyQ"}
                                            alt='User'
                                            className='h-8 w-8 rounded-full object-contain'
                                            height={200}
                                            width={400}
                                        />
                                    </div>
                                    <ChevronDownIcon className=" h-5 w-5 text-gray-400" />
                                </span>
                            </div>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-7 z-10 mt-1.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">

                                <Menu.Item >
                                    <div className='block px-3 py-1 text-base cursor-pointer leading-6 text-gray-900'
                                        onClick={() => {

                                            router.push(user.role === 'Admin' ? '/admin/profile' : '/profile/overview');
                                        }}>
                                        Profile
                                    </div>

                                </Menu.Item>

                                <Menu.Item >
                                    <div className='block px-3 py-1 text-base cursor-pointer leading-6 text-gray-900'
                                        onClick={() => {
                                            localStorage.removeItem('authToken');
                                            localStorage.removeItem('user');
                                            localStorage.removeItem('endTime');
                                            localStorage.removeItem('role');
                                            router.push('/');
                                        }}>
                                        Sign out
                                    </div>

                                </Menu.Item>


                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>

            </div>
        </header>
    );
};

export default Header;

import React from 'react';
import { BellIcon, InfoIcon, CheckCircleIcon } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { UseGetNotifications } from '../../../hooks/query/HR/getNotifications';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import UseReadSingleNotification from '../../../hooks/mutations/readSingleNotification';
import UseReadAllNotifications from '../../../hooks/mutations/readAllNotifications';
import { XMarkIcon } from '@heroicons/react/24/solid';

const Notification = () => {
  const { data: profile } = UseGetProfile();

  // Conditionally fetch notifications if the user is HR
  const { data: notificationsData, isLoading } = UseGetNotifications();
  const readSingleNotification = UseReadSingleNotification();
  const readAllNotifications = UseReadAllNotifications();

  const handleReadSingleNotification = (notificationId) => {
    if (notificationId) {
      readSingleNotification.mutate(notificationId);
    }
  };

  const handleReadAllNotifications = () => {
    readAllNotifications.mutate();
  };

  const unreadNotifications = notificationsData?.filter(
    (notification) => notification.is_read === '0'
  ) || [];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'loan_request':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'leave_request':
        return <InfoIcon className="h-6 w-6 text-primary" />;
      case 'salary_request':
        return <BellIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <InfoIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type) => {
    switch (type) {
      case 'loan_request':
        return <span className="text-xs text-green-600 bg-green-100 px-4 py-1 rounded-2xl">Loan</span>;
      case 'leave_request':
        return <span className="text-xs text-primary bg-primary bg-opacity-20 px-4 py-1 rounded-2xl">Leave</span>;
      case 'salary_request':
        return <span className="text-xs text-yellow-600 bg-yellow-100 px-4 py-1 rounded-2xl">Advance Salary</span>;
      default:
        return null;
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="relative py-3 hover:text-default_text">
        <BellIcon className="h-6 w-6 cursor-pointer" aria-hidden="true" />
        {unreadNotifications?.length > 0 && (
          <span className="rounded-full w-5 h-5 bg-secondary text-white text-xs absolute top-1 right-0">
            {unreadNotifications?.length}
          </span>
        )}
      </Menu.Button>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-[500px] bg-white border border-gray-300 divide-y divide-gray-300 rounded-md shadow-lg">
          <div className="p-2 max-h-96 overflow-y-auto">
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex py-2 justify-between text-default_text border-b border-gray-400 bg-white p-2"
                >
                  <div className="flex space-x-2">
                    <span>{getNotificationIcon(notification.type)}</span>
                    <div className="flex flex-col items-left justify-between">
                      <div className="text-sm text-default_text w-96 mb-2">
                        <span className="font-bold capitalize">
                          {notification.message}
                        </span>
                       
                      </div>
                      <div className="text-xs text-gray-600 flex items-center ">
                      <div className="mt-1 mr-4">{getNotificationBadge(notification.type)}</div>  
                        {notification.created_at}
                      
                      </div>
                    </div>
                  </div>

                  <div className=" ">
                    <span
                      onClick={() => handleReadSingleNotification(notification.id)}
                      className="cursor-pointer text-darkred "
                      title="Mark as read"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No new notifications
              </div>
            )}
          </div>

          {unreadNotifications.length > 0 && (
            <div className="p-4 flex justify-end">
              <button
                className="text-sm text-primary hover:underline"
                onClick={handleReadAllNotifications}
              >
                Mark all as read
              </button>
            </div>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Notification;

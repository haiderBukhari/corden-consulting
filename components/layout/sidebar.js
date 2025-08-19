import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronRight, LogOutIcon, Menu, X } from "lucide-react";

const Sidebar = ({ navigation }) => {
  const router = useRouter();
  const [openedSubmenu, setOpenedSubmenu] = useState(null);
  const [openedNestedSubmenu, setOpenedNestedSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href, basePath) => {
    if (basePath) {
      return router.asPath.startsWith(basePath);
    }
    return href && router.asPath.startsWith(href);
  };

  const handleMainMenuItemClick = (item) => {
    if (item.subItems) {
      const isCurrentlyOpen = openedSubmenu === item.name;
      setOpenedSubmenu(isCurrentlyOpen ? null : item.name);
      setOpenedNestedSubmenu(null);
    } else {
      router.push(item.href);
      setOpenedSubmenu(null);
      setIsMobileMenuOpen(false);
    }
  };

  const handleNestedMenuItemClick = (subItem) => {
    if (subItem.subItems) {
      const isCurrentlyOpen = openedNestedSubmenu === subItem.name;
      setOpenedNestedSubmenu(isCurrentlyOpen ? null : subItem.name);
    } else {
      router.push(subItem.href);
      setOpenedNestedSubmenu(null);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderMenuItems = () => (
    <>
      <div className="flex items-center justify-center pt-5 bg-white border-b px-4">
        <Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="py-4 w-full h-24" priority="" />
      </div>

      <div className="flex flex-1 rounded-tl-lg flex-col text-default_text">
        <div className="flex flex-1 h-auto flex-col overflow-y-auto py-1.5 my-1 mx-3">
          <nav className="flex-1" aria-label="Sidebar">
            <div className="space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <div
                    onClick={() => !item.isDisabled && handleMainMenuItemClick(item)}
                    className={`group flex items-center p-2.5 text-sm rounded-lg ${item.isDisabled
                      ? 'cursor-not-allowed opacity-60 bg-secondary'
                      : 'hover:text-white hover:bg-[#009D9D] cursor-pointer'
                      } ${isActive(item.href, item.basePath) || item.subItems?.some(subItem => isActive(subItem.href, subItem.basePath))
                        ? 'bg-[#009D9D] text-white'
                        : 'bg-white text-default_text'
                      }`}
                  >
                    <item.icon
                      className={`mr-2 h-6 w-6 ${isActive(item.href, item.basePath) || item.subItems?.some(subItem => isActive(subItem.href, subItem.basePath))
                        ? 'text-white'
                        : item.isDisabled
                          ? 'text-gray-500'
                          : 'text-default_text group-hover:text-white'
                        }`}
                      aria-hidden="true"
                    />
                    <div className="grid grid-cols-12">
                      <div className="col-span-11">{item.name}</div>
                      {item.subItems && <ChevronRight className={`h-5 w-5 ${item.isDisabled
                        ? 'text-gray-500'
                        : 'text-blue-white'}`} />}
                    </div>
                  </div>

                  {item.subItems && (openedSubmenu === item.name || item.subItems.some(subItem => isActive(subItem.href, subItem.basePath))) ? (
                    <ul>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <div
                            onClick={() => !subItem.isDisabled && handleNestedMenuItemClick(subItem)}
                            className={`group flex items-center pl-8 pr-2 py-1 text-sm rounded-md ${subItem.isDisabled
                              ? 'cursor-not-allowed opacity-50'
                              : 'hover:text-[#009D9D] cursor-pointer'
                              } ${isActive(subItem.href, subItem.basePath) || subItem.subItems?.some(nestedSubItem => isActive(nestedSubItem.href, nestedSubItem.basePath))
                                ? 'text-[#009D9D] font-bold'
                                : 'text-default_text'
                              }`}
                          >
                            {subItem.name}
                            {subItem.subItems && <ChevronRight className="h-4 w-4 ml-1 text-gray-400" />}
                          </div>

                          {subItem.subItems && (openedNestedSubmenu === subItem.name || subItem.subItems.some(nestedSubItem => isActive(nestedSubItem.href, nestedSubItem.basePath))) ? (
                            <ul>
                              {subItem.subItems.map((nestedSubItem) => (
                                nestedSubItem.isDisabled ? (
                                  <li
                                    key={nestedSubItem.name}
                                    className="cursor-not-allowed opacity-50 ml-14 text-sm py-1.5"
                                    aria-hidden="true"
                                  >
                                    {nestedSubItem.name}
                                  </li>
                                ) : (
                                  <Link href={nestedSubItem.href} key={nestedSubItem.name}>
                                    <li
                                      className={`${isActive(nestedSubItem.href, nestedSubItem.basePath)
                                        ? 'text-primary font-semibold'
                                        : 'text-default_text hover:text-primary'
                                        } ml-14 text-sm py-1.5 cursor-pointer`}
                                      aria-hidden="true"
                                    >
                                      {nestedSubItem.name}
                                    </li>
                                  </Link>
                                )
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </nav>
          <div
            className="flex px-3 py-2 text-base items-center cursor-pointer bg-white text-default_text rounded-xl hover:bg-[#009D9D] hover:text-white mt-3"
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              localStorage.removeItem('endTime');
              router.push('/');
            }}
          >
            <LogOutIcon className="mr-3 h-5 w-5" /> <span>Logout</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex min-h-screen sm:w-64 bg-[#F6F6F6] lg:flex-col text-default_text">
        <div className="flex flex-grow flex-col overflow-y-auto border-r">
          {renderMenuItems()}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-[#F6F6F6] shadow-lg">
          <div className="flex flex-col h-full overflow-y-auto">
            {renderMenuItems()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

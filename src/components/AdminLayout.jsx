import React, { useEffect, useState } from 'react';
import useTheme from '../hooks/useTheme';
import ModeToggle from './ModeToggle';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, Package, Upload, LogOut, Bell, Search } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard',      label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
  // { key: 'users',          label: 'Users',     icon: Users,           path: 'users'     },
  // { key: 'roles',          label: 'Roles',     icon: ShieldCheck,     path: 'roles'     },
  { key: 'merchandise',          label: 'Merchendise',     icon: Package,         path: 'merchandise'     },
  { key: 'falcon ids',          label: 'Falcon Ids',     icon: Package,         path: 'falcon_ids'     },
  { key: 'uploaders',      label: 'Uploaders', icon: Upload,          path: 'bulk-uploaders' },
  { key: 'employees',      label: 'Employees', icon: Users,          path: 'employees' },
];

const AdminLayout = () => {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState(JSON.parse(sessionStorage.getItem('userDetails')) || {});

  const activeKey = (() => {
    const p = location.pathname;
    if (p.includes('users'))         return 'users';
    if (p.includes('roles'))         return 'roles';
    if (p.includes('merchandise'))         return 'merchandise';
    if (p.includes('falcon_ids'))         return 'falcon_ids';
    if (p.includes('employees'))         return 'employees';
    if (p.includes('bulk-uploaders')) return 'uploaders';
    return 'dashboard';
  })();

  const handleNavigate = (path) => {
    navigate(`/${path}`);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Hamburger */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700"
        aria-label="Toggle Sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`
        w-60 bg-white dark:bg-gray-900
        border-r border-gray-100 dark:border-gray-800
        flex flex-col
        fixed inset-y-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:shrink-0
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9"/>
              <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.5"/>
              <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.5"/>
              <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">Admin Panel</p>
            <p className="text-xs text-gray-400 mt-0.5">Management suite</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mb-2">Overview</p>
          {NAV_ITEMS.slice(0, 1).map(({ key, label, icon: Icon, path }) => (
            <NavButton key={key} label={label} icon={<Icon size={15} />} active={activeKey === key} onClick={() => handleNavigate(path)} />
          ))}
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mt-4 mb-2">Manage</p>
          {NAV_ITEMS.slice(1).map(({ key, label, icon: Icon, path }) => (
            <NavButton key={key} label={label} icon={<Icon size={15} />} active={activeKey === key} onClick={() => handleNavigate(path)} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-xs font-semibold text-violet-700 dark:text-violet-300 shrink-0">
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{user?.username ?? 'User'}</p>
            <p className="text-xs text-gray-400 truncate">Administrator</p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('token-auth'); window.location.href = '/login'; }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center px-5 gap-3 shrink-0">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white flex-1 capitalize">
            {activeKey}
          </h1>
          {/* <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-400 w-48">
            <Search size={12} />
            <span>Search...</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors relative">
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button> */}
          <ModeToggle />
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150
      ${active
        ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-100'
      }
    `}
  >
    <span className={active ? 'text-violet-600 dark:text-violet-400' : ''}>{icon}</span>
    {label}
  </button>
);

export default AdminLayout;










// import React, { useEffect, useState } from 'react';
// import useTheme from '../hooks/useTheme';
// import ModeToggle from './ModeToggle';
// import { Outlet, useNavigate } from 'react-router-dom';
// import { LogOut } from 'lucide-react';

// const AdminLayout = ({ children }) => {
//     const { theme } = useTheme();
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const [selectedOpt, setSelectedOpt] = useState("dashboard");
//     const navigate = useNavigate();
//     const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("userDetails")) || "")
//     console.log(user, "user", sessionStorage.getItem("userDetails"))

//     const handleNavigate = (path) => {
//         navigate(`/${path}`);
//         setIsSidebarOpen(false);
//     };

//     useEffect(() => {
//         const location = window.location.href
//         if (location?.includes("users")) {
//             setSelectedOpt("users")
//         }
//         else if (location?.includes("roles")) {
//             setSelectedOpt("roles")
//         }
//         else if (location?.includes("items")) {
//             setSelectedOpt("items")
//         }
//         else if (location?.includes("bulk-uploaders")) {
//             setSelectedOpt("uploaders")
//         }
//         else {
//             setSelectedOpt("dashboard")
//         }
//     }, [window.location.href])

//     return (
//         <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

//             <div className=' fixed right-2 top-2'>
//                 <ModeToggle />
//             </div>

//             {isSidebarOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                     onClick={() => setIsSidebarOpen(false)}
//                 ></div>
//             )}

//             <button
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 className="lg:hidden fixed top-2 -left-2 z-50 p-2 "
//                 aria-label="Toggle Sidebar"
//             >
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
//                 </svg>
//             </button>

//             <aside
//                 className={`
//                     w-64 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col rounded-md m-4
//                     fixed inset-y-0 left-0 z-50 transform
//                     ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full hidden'}
//                     transition-transform duration-300 ease-in-out
//                     lg:relative lg:translate-x-0 lg:flex lg:shrink-0 overflow-y-auto
//                 `}
//             >
//                 <h2 className="text-2xl font-bold mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">Admin Panel</h2>
//                 <nav className="flex-grow">
//                     <ul>
//                         <li className="mb-4">
//                             <button
//                                 onClick={() => handleNavigate('dashboard')} // Use handleNavigate
//                                 className={`w-full text-left px-4 py-2 rounded-md ${selectedOpt == "dashboard" ? "bg-gray-200 dark:bg-gray-700" : ""} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"`}
//                             >
//                                 Dashboard
//                             </button>
//                         </li>
//                         <li className="mb-4">
//                             <button
//                                 onClick={() => handleNavigate('users')} // Use handleNavigate
//                                 className={`w-full text-left px-4 py-2 rounded-md ${selectedOpt == "users" ? "bg-gray-200 dark:bg-gray-700" : ""} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
//                             >
//                                 Users
//                             </button>
//                         </li>
//                         <li className="mb-4">
//                             <button
//                                 onClick={() => handleNavigate('roles')} // Use handleNavigate
//                                 className={`w-full text-left px-4 py-2 rounded-md ${selectedOpt == "roles" ? "bg-gray-200 dark:bg-gray-700" : ""} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
//                             >
//                                 Roles
//                             </button>
//                         </li>
//                         <li className="mb-4">
//                             <button
//                                 onClick={() => handleNavigate('items')} // Use handleNavigate
//                                 className={`w-full text-left px-4 py-2 rounded-md ${selectedOpt == "items" ? "bg-gray-200 dark:bg-gray-700" : ""} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
//                             >
//                                 Items
//                             </button>
//                         </li>
//                         <li className="mb-4">
//                             <button
//                                 onClick={() => handleNavigate('bulk-uploaders')} // Use handleNavigate
//                                 className={`w-full text-left px-4 py-2 rounded-md ${selectedOpt == "uploaders" ? "bg-gray-200 dark:bg-gray-700" : ""} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200`}
//                             >
//                                 Uploaders
//                             </button>
//                         </li>
//                     </ul>
//                 </nav>
//                 <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
//                     <div className=' flex flex-wrap justify-between'>
//                         <p>
//                             {user?.username}
//                         </p>
//                         <LogOut
//                             className=' cursor-pointer hover:opacity-50'
//                             onClick={() => {
//                                 sessionStorage.removeItem("token-auth")
//                                 window.location.href = "/login";
//                             }}
//                         />
//                     </div>
//                 </div>
//             </aside>

//             <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
//                 <div className="container mx-auto">
//                     <Outlet />
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default AdminLayout;
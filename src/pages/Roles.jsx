import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Pencil, Trash, X, Check, Eye } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import Spinner from '../components/Spinner';


const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/roles`;

export const Roles = () => {
    const token = sessionStorage.getItem('token-auth');
    const [allRoles, setAllRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [totalUsers, setTotalUsers] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshData, setRefreshData] = useState(false);


    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role_name: '',
        isActive: true,
    });

    const rolesArr = [
        { label: 'Sub Admin', value: 'sub-admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Admin', value: 'admin' },
    ];

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            let response = await axios.get(API_BASE_URL, {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response?.status === 200) {
                setAllRoles(response?.data?.roles);
                setTotalUsers(response.data.totalRoles);
            }
        } catch (err) {
            toast.error("Failed to fetch allRoles. Please try again.")
            setAllRoles([])
            setTotalUsers(0)
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchUsers()
    }

    useEffect(() => {
        fetchUsers();
    }, [refreshData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, role_name: value }));
    };

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            role_name: "admin",
            description: '',
            isActive: true,
        });
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setFormData({
            role_name: user.name || "",
            description: user.description || "",
            isActive: user.isActive,
        });
        setIsModalOpen(true);
    };

    const openViewModal = (user) => {
        setModalMode('view');
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMode('add');
        setCurrentUser(null);
        setFormData({ username: '', email: '', password: '', role_name: '', isActive: true });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (modalMode === 'add') {
                let res = await axios.post(API_BASE_URL, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 201) {
                    toast.success("Role added successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }
            } else if (modalMode === 'edit') {
                let res1 = await axios.put(`${API_BASE_URL}/${currentUser._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res1.status === 200) {
                    toast.success("Role updated successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }
            }
        } catch (err) {
            toast.error(`Failed to ${modalMode} user.`)
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            setLoading(true);
            let res = await axios.patch(`${API_BASE_URL}/${userId}/status`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            }
            );
            if (res.status === 200) {
                toast.success("Status updated!")
                setRefreshData(!refreshData)
            }
        } catch (err) {
            toast.error("Failed to update Role status.")
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            setLoading(true);
            let res = await axios.delete(`${API_BASE_URL}/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                toast.success("Role deleted!")
                setRefreshData(!refreshData)
            }
        } catch (err) {
            toast.error("Failed to delete Role.")
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };



    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <ToastContainer />
            {/* User Modal (Add/Edit/View) using shadcn/ui Dialog */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'add' && 'Add New Role'}
                            {modalMode === 'edit' && 'Edit Role'}
                            {modalMode === 'view' && 'View Role Details'}
                        </DialogTitle>
                        <DialogDescription>
                            {modalMode === 'add' && 'Enter the details for the new role.'}
                            {modalMode === 'edit' && 'Make changes to the role details here.'}
                            {modalMode === 'view' && 'Details of the selected role.'}
                        </DialogDescription>
                    </DialogHeader>
                    {modalMode === 'view' ? (
                        <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Name:</Label>
                                <span className="col-span-3">{currentUser?.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Email:</Label>
                                <span className="col-span-3">{currentUser?.description}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Status:</Label>
                                <span className="col-span-3">{currentUser?.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} >
                            <div className="grid gap-4 px-3 py-4 mb-5 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="role" className="text-right">Role</Label>
                                    <Select disabled={modalMode == "edit" ? true : false} onValueChange={handleSelectChange} value={formData.role_name} required>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rolesArr.map(role => (
                                                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="description" className="text-right">Description</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        type="text"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="isActive" className="text-right">Active</Label>
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={handleSwitchChange}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : (modalMode === 'add' ? 'Add User' : 'Save Changes')}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                    {modalMode === 'view' && (
                        <DialogFooter>
                            <Button type="button" onClick={closeModal}>
                                Close
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Role Management</h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Manage your application's all Roles here.</p>

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex w-full md:w-1/3 space-x-2"> {/* Added flex container and spacing */}
                    <Input
                        type="text"
                        placeholder="Search role..."
                        className="flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <Button onClick={handleSearch}>
                        Search
                    </Button>
                </div>
                <Button onClick={openAddModal}>
                    Add New Role
                </Button>
            </div>

            {loading ?
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                    <p className="ml-2 text-gray-700 dark:text-gray-300">Loading data...</p>
                </div> :
                <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-gray-600">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Sr
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {allRoles?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No Roles found.
                                    </td>
                                </tr>
                            ) : (
                                allRoles?.map((role, index) => (
                                    <tr key={role._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{index + 1}</td> {/* Shorten ID for display */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{role.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{role.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {role.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className=" flex items-center px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Eye
                                                onClick={() => openViewModal(role)}
                                                size={24}
                                                className=" cursor-pointer text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" />
                                            <Pencil
                                                onClick={() => openEditModal(role)}
                                                size={20}
                                                className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            />
                                            <Trash
                                                onClick={() => handleDeleteUser(role._id)}
                                                size={20}
                                                className="cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            />
                                            {role.isActive ?
                                                <X
                                                    onClick={() => handleToggleStatus(role._id, role.isActive)}
                                                    className={'cursor-pointer text-red-600 hover:text-red-500'}
                                                    size={24}
                                                />
                                                :
                                                <Check
                                                    onClick={() => handleToggleStatus(role._id, role.isActive)}
                                                    className={"cursor-pointer text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"}
                                                    size={24}
                                                />
                                            }


                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            }

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center pt-4">
                    <Button
                        variant="outline"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1 || loading}
                    >
                        Previous
                    </Button>
                    <span className="text-gray-700 dark:text-gray-300">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            )}


        </div>
    );
};

export default Roles;
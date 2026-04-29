import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { Pencil, Trash, X, Check, Eye, UserCircle2, CloudUpload } from 'lucide-react';
import Spinner from '../components/Spinner';
import { toast, ToastContainer } from 'react-toastify';
import ExcelPDfDownload from '../components/ExcelPDfDownload';
import GenericTable from '../components/TableComponent';
import moment from 'moment';

const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/merchandise`;


export const Merchandise = () => {
    const token = sessionStorage.getItem('token-auth');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshData, setRefreshData] = useState(false);


    const [formData, setFormData] = useState({
        falcon_id: "",
        name: "",
        tshirt: "",
        trouser: "",
        jacket: "",
        delivery_bag: "",
        chest_guard: "",
        helmet: "",
        gloves: "",
        safety_gears: "",
        Box: "",
        summer_coat: ""
    });

    const fetchMerchandise = async () => {
        setLoading(true);
        setError(null);
        try {
            const usersResponse = await axios.get(API_BASE_URL, {
                params: {
                    page: currentPage,
                    limit: usersPerPage,
                    search: searchTerm,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            if (usersResponse?.status === 200) {
                setUsers(usersResponse?.data?.data);
                setTotalUsers(usersResponse.data.totalItems);
            }
        } catch (err) {
            toast.error("No record found!")
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchMerchandise()
    }

    useEffect(() => {
        fetchMerchandise();
    }, [refreshData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            falcon_id: "",
            name: "",
            tshirt: "",
            trouser: "",
            jacket: "",
            delivery_bag: "",
            chest_guard: "",
            helmet: "",
            gloves: "",
            safety_gears: "",
            Box: "",
            summer_coat: ""
        });
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setFormData({
            falcon_id: user.falcon_id,
            name: user.name,
            tshirt: user.tshirt,
            trouser: user.trouser,
            jacket: user.jacket,
            delivery_bag: user.delivery_bag,
            chest_guard: user.chest_guard,
            helmet: user.helmet,
            gloves: user.gloves,
            safety_gears: user.safety_gears,
            Box: user.Box,
            summer_coat: user.summer_coat,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMode('add');
        setCurrentUser(null);
        setFormData(
            {
                falcon_id: "",
                name: "",
                tshirt: "",
                trouser: "",
                jacket: "",
                delivery_bag: "",
                chest_guard: "",
                helmet: "",
                gloves: "",
                safety_gears: "",
                Box: "",
                summer_coat: ""
            }
        );
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
                    toast.success("Merchandise added successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }

            } else if (modalMode === 'edit') {

                let res1 = await axios.put(`${API_BASE_URL}/${currentUser._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res1.status === 200) {
                    toast.success("Merchandise updated successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }
            }

        } catch (err) {
            toast.error(`Failed to ${modalMode} Item.`)
            setLoading(false);
        }
    };


    const totalPages = Math.ceil(totalUsers / usersPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            setRefreshData(!refreshData)
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            setRefreshData(!refreshData)
        }
    };


    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <ToastContainer />

            {/* ------- Modal for Add/Edit/View ----------- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {modalMode === 'add' && 'Add New Item'}
                            {modalMode === 'edit' && 'Edit Item'}
                            {modalMode === 'view' && 'View Item Details'}
                        </DialogTitle>
                        <DialogDescription>
                            {modalMode === 'add' && 'Enter the details for the new Item.'}
                            {modalMode === 'edit' && 'Make changes to the Item details here.'}
                            {modalMode === 'view' && 'Details of the selected Item.'}
                        </DialogDescription>
                    </DialogHeader>
                    {modalMode === 'view' ? (
                        <div className="grid gap-4 py-4 text-gray-700 dark:text-gray-300 max-h-[60vh] overflow-y-auto">

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Falcon ID:</Label>
                                <span className="col-span-3">{currentUser?.falcon_id}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Name:</Label>
                                <span className="col-span-3">{currentUser?.name}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>T-Shirt:</Label>
                                <span className="col-span-3">{currentUser?.tshirt || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Trouser:</Label>
                                <span className="col-span-3">{currentUser?.trouser || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Jacket:</Label>
                                <span className="col-span-3">{currentUser?.jacket || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Delivery Bag:</Label>
                                <span className="col-span-3">{currentUser?.delivery_bag || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Chest Guard:</Label>
                                <span className="col-span-3">{currentUser?.chest_guard || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Helmet:</Label>
                                <span className="col-span-3">{currentUser?.helmet || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Gloves:</Label>
                                <span className="col-span-3">{currentUser?.gloves || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Safety Gears:</Label>
                                <span className="col-span-3">{currentUser?.safety_gears || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Box:</Label>
                                <span className="col-span-3">{currentUser?.Box || 0}</span>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label>Summer Coat:</Label>
                                <span className="col-span-3">{currentUser?.summer_coat || 0}</span>
                            </div>

                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit}>
                            <div className="grid gap-4 px-3 py-4 mb-5 max-h-[60vh] overflow-y-auto">

                                {modalMode !== "edit" && (
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="falcon_id" className="text-right">Falcon ID</Label>
                                        <Input
                                            id="falcon_id"
                                            name="falcon_id"
                                            value={formData.falcon_id}
                                            onChange={handleInputChange}
                                            required
                                            className="col-span-3"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>

                                {[
                                    "tshirt",
                                    "trouser",
                                    "jacket",
                                    "delivery_bag",
                                    "chest_guard",
                                    "helmet",
                                    "gloves",
                                    "safety_gears",
                                    "Box",
                                    "summer_coat"
                                ].map((field) => (
                                    <div key={field} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={field} className="text-right capitalize">
                                            {field.replace("_", " ")}
                                        </Label>
                                        <Input
                                            id={field}
                                            name={field}
                                            type="number"
                                            value={formData[field] || ""}
                                            onChange={handleInputChange}
                                            className="col-span-3"
                                        />
                                    </div>
                                ))}

                            </div>

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={closeModal}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Item' : 'Save Changes')}
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

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Merchandise Management</h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Manage your Merchandise here.</p>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex w-full md:w-1/3 space-x-2">
                    <Input
                        type="text"
                        placeholder="Search items..."
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
                <div className="flex space-x-2">
                    <Button onClick={openAddModal}>
                        Add New Item
                    </Button>

                </div>
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
                                    Falcon ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    T-Shirt
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Trouser
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Jacket
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Delivery Bag
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Chest Guard
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Helmet
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Gloves
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Safety Gears
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Box
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Summer Coat
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users?.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users?.map((user, index) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user?.falcon_id}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.tshirt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.trouser}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.jacket}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.delivery_bag}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.chest_guard}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.helmet}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.gloves}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.safety_gears}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.Box}</td> 
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.summer_coat}</td>

                                        <td className=" flex items-center px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {/* <Eye
                                                                onClick={() => openViewModal(user)}
                                                                size={24}
                                                                className=" cursor-pointer text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" /> */}
                                            <Pencil
                                                onClick={() => openEditModal(user)}
                                                size={20}
                                                className="cursor-pointer text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            />
                                            {/* <Trash
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                size={20}
                                                                className="cursor-pointer text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            /> */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            }

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
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
                )
            }


        </div >
    );
};

export default Merchandise;
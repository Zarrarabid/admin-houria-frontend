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

const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/falcon_ids`;


export const ProductInventory = () => {
    const token = sessionStorage.getItem('token-auth');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [allCategories, setAllCategories] = useState(
        ['Engine Parts', 'Interior', 'Exterior', 'Electronics', 'Tires & Wheels', 'Tools', 'Fluids & Chemicals', 'Other']
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState(null);
    const [refreshData, setRefreshData] = useState(false);
    const [imageViewModalFlag, setImageViewModalFlag] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [itemImage, setItemImage] = useState(null);
    const fileInputRef = useRef(null);
    const tableRef = useRef(null);


    const [formData, setFormData] = useState({
        falcon_id_holder: '',
        name_of_id_holder: '',
        falcon_id_given_to: '',
        COD: '',
        total_orders: "",
        to_Date: "",
        from_Date: "",
    });

    const fetchUsers = async () => {
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
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleSwitchChange = (checked) => {
        setFormData(prev => ({ ...prev, isActive: checked }));
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            falcon_id_holder: '',
        name_of_id_holder: '',
        falcon_id_given_to: '',
        COD: '',
        total_orders: "",
        to_Date: "",
        from_Date: "",
        });
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setFormData({
            falcon_id_holder: user.falcon_id_holder,
        name_of_id_holder: user.name_of_id_holder,
        falcon_id_given_to: user.falcon_id_given_to,
        COD: user.COD,
        total_orders: user.total_orders,
        to_Date: user.to_Date ? moment(user.to_Date)?.format("YYYY-MM-DD") : "",
        from_Date: user.from_Date ? moment(user.from_Date)?.format("YYYY-MM-DD") : "",
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
        setFormData(
            {
                name: '',
                description: '',
                price: '',
                category: '',
                stock: "",
                image: "",
                isActive: true,
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
                    toast.success("Item added successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }

            } else if (modalMode === 'edit') {
                
                let res1 = await axios.put(`${API_BASE_URL}/${currentUser._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res1.status === 200) {
                    toast.success("Item updated successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
                }
            }

        } catch (err) {
            toast.error(`Failed to ${modalMode} Item.`)
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            setLoading(true);
            let res = await axios.patch(`${API_BASE_URL}/${userId}/status`, { isActive: !currentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                toast.success("Status updated!")
                setRefreshData(!refreshData)
            }

        } catch (err) {
            toast.error("Failed to update Item status.")
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
                toast.success("Item deleted!")
                setRefreshData(!refreshData)
            }
        } catch (err) {
            toast.error("Failed to delete Item.")
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

    const columns = [
        {
            key: 'imageUrl',
            header: '',
            render: (item) => (
                <img
                    className='cursor-pointer'
                    style={{ maxWidth: "100px", maxHeight: "50px" }}
                    src={item.imageUrl}
                    onClick={() => {
                        setSelectedItem(item);
                        setImageViewModalFlag(true);
                    }}
                    alt={item.name}
                />
            ),
        },
        {
            key: 'sr',
            header: 'Sr',
            render: (item, index, page, perPage) => index + 1 + (page - 1) * perPage,
        },
        { key: 'name', header: 'Name' },
        { key: 'category', header: 'Category' },
        { key: 'description', header: 'Description' },
        { key: 'price', header: 'Price' },
        { key: 'stock', header: 'Stock' },
        {
            key: 'isActive',
            header: 'Status',
            render: (item) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            ),
        },
    ];

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
                            <div className="relative w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 group overflow-hidden">
                                <img src={currentUser?.imageUrl} alt="Item" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Product Name:</Label>
                                <span className="col-span-3">{currentUser?.name}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Description:</Label>
                                <span className="col-span-3">{currentUser?.description}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Price:</Label>
                                <span className="col-span-3">{currentUser?.price}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Category:</Label>
                                <span className="col-span-3">{currentUser?.category}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Stock:</Label>
                                <span className="col-span-3">{currentUser?.stock}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label >Active:</Label>
                                <Switch
                                    disabled={true}
                                    id="isActive"
                                    checked={formData.isActive}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} >
                            <div className="grid gap-4 px-3 py-4 mb-5 max-h-[60vh] overflow-y-auto">
                                {modalMode !== "edit" ?
                                <div className="grid grid-cols-4 items-center gap-4 ">
                                    <Label htmlFor="falcon_id_holder" className="text-right">Falcon ID</Label>                                 
                                        <Input
                                        id="falcon_id_holder"
                                        name="falcon_id_holder"
                                        value={formData.falcon_id_holder}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                    />
                                </div>
                                 : null}
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name_of_id_holder" className="text-right">Name of Holder</Label>
                                    <Input
                                        id="name_of_id_holder"
                                        name="name_of_id_holder"
                                        type="text"
                                        value={formData.name_of_id_holder}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="falcon_id_given_to" className="text-right">ID given to</Label>
                                    <Input
                                        id="falcon_id_given_to"
                                        name="falcon_id_given_to"
                                        type="text"
                                        value={formData.falcon_id_given_to}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="COD" className="text-right">COD</Label>
                                    <Input
                                        id="COD"
                                        name="COD"
                                        type="text"
                                        value={formData.COD}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="total_orders" className="text-right">Total Orders</Label>
                                    <Input
                                        id="total_orders"
                                        name="total_orders"
                                        type="text"
                                        value={formData.total_orders}
                                        onChange={handleInputChange}
                                        required
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="to_Date" className="text-right">To Date</Label>
                                    <Input
                                        id="to_Date"
                                        name="to_Date"
                                        type="date"
                                        value={formData.to_Date}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="from_Date" className="text-right">From Date</Label>
                                    <Input
                                        id="from_Date"
                                        name="from_Date"
                                        type="date"
                                        value={formData.from_Date}
                                        onChange={handleInputChange}
                                        className="col-span-3"
                                    />
                                </div>
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

            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Falcon Id Management</h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Manage your Falcon IDs here.</p>
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
                                                    Falcon ID Given To
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    COD
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    Total Orders
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    From Date
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    To Date
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
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user?.falcon_id_holder}</td> {/* Corrected Sr. No. */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.name_of_id_holder}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.falcon_id_given_to}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.COD || 0}</td> {/* Access role name */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.total_orders || 0}</td> {/* Access role name */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {user.from_Date ?
                                                            moment(user?.from_Date).format("DD-MMM-YYYY") : "NA"
                                                            }
                                                            </td> {/* Access role name */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {user?.to_Date ?
                                                            moment(user?.to_Date)?.format("DD-MMM-YYYY") : "NA"}</td> {/* Access role name */}
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                                                {user.isActive ? 'Active' : 'Inactive'}
                                                                            </span>
                                                                        </td> */}
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

export default ProductInventory;
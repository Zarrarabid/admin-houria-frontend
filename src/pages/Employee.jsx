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
import moment from 'moment';
import { pagePerView } from '../Data/Data';

const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/employee`;


export const Employee = () => {
    const token = sessionStorage.getItem('token-auth');
    const [users, setUsers] = useState([]);
    const [limitPage, setLimitPage] = useState("10");
    const yesterday = moment().subtract(1, "M");
    const [date, setDate] = useState(yesterday?.format("YYYY-MM"));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage,setUsersPerPage] = useState(10);
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
        falcon_id: '',
        name: '',
        uploading_date: '',
        category: '',
        online_orders: 0,
        rate: 0,
        petrol: 0,
        bonus_amount: 0,
        extra_kms_amount: 0,
        violation: 0,
        total_deduction: 0,
        bike: 0,
        office: 0,
        sim: 0,
        total: 0,
    });

    const fetchUsers = async (valueIS = "") => {
        setLoading(true);
        setError(null);
        console.log("limitssss", valueIS)
        try {
            const usersResponse = await axios.get(API_BASE_URL, {
                params: {
                    page: currentPage,
                    limit: valueIS ? valueIS : usersPerPage || 10,
                    search: searchTerm,
                    date: date
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

    const handleSearch = (valueIS = "") => {
        console.log("valueIS", valueIS)
        fetchUsers(valueIS)
    }

    useEffect(() => {
        fetchUsers();
    }, [refreshData]);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
        ...prev,
        [name]: isNaN(value) ? value : Number(value)
    }));
};

    const openEditModal = (user) => {
        setModalMode('edit');
        setCurrentUser(user);
        setFormData({
            falcon_id: user?.falcon_id || '',
            name: user?.name || '',
            uploading_date: user?.uploading_date || '',
            category: user?.category || '',
            online_orders: user?.online_orders || 0,
            rate: user?.rate || 0,
            petrol: user?.petrol || 0,
            bonus_amount: user?.bonus_amount || 0,
            extra_kms_amount: user?.extra_kms_amount || 0,
            violation: user?.violation || 0,
            total_deduction: user?.total_deduction || 0,
            bike: user?.bike || 0,
            office: user?.office || 0,
            sim: user?.sim || 0,
            total: user?.total || 0,
        });
        setItemImage(user?.imageUrl)
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
                let res1 = await axios.put(`${API_BASE_URL}/${currentUser._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res1.status === 200) {
                    toast.success("Item updated successfully!")
                    setRefreshData(!refreshData)
                    closeModal();
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

                        <form onSubmit={handleFormSubmit}>
    <div className="grid gap-4 px-3 py-4 mb-5 max-h-[60vh] overflow-y-auto">

        <div className="grid grid-cols-4 gap-4 items-baseline">
            <Label className="text-right">Falcon ID</Label>
            <Input disabled name="falcon_id" value={formData.falcon_id} onChange={handleInputChange} className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 gap-4 items-baseline">
            <Label className="text-right">Name</Label>
            <Input name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" required />
        </div>

        {/* <div className="grid grid-cols-4 gap-4">
            <Label className="text-right">Date</Label>
            <Input type="date" name="uploading_date" value={formData.uploading_date} onChange={handleInputChange} className="col-span-3" />
        </div> */}

        <div className="grid grid-cols-4 gap-4 items-baseline">
            <Label className="text-right">Category</Label>
            <Input name="category" value={formData.category} onChange={handleInputChange} className="col-span-3" />
        </div>

        {/* Numbers */}
        {[
            "online_orders",
            "rate",
            "petrol",
            "bonus_amount",
            "extra_kms_amount",
            "violation",
            "total_deduction",
            "bike",
            "office",
            "sim",
            "total"
        ].map(field => (
            <div key={field} className="grid grid-cols-4 gap-4 items-baseline">
                <Label className="text-right capitalize">
                    {field.replaceAll("_", " ")}
                </Label>
                <Input
                    type="number"
                    name={field}
                    value={formData[field]}
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
            {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Record' : 'Save Changes')}
        </Button>
    </DialogFooter>
</form>
                </DialogContent>
            </Dialog>



            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Employee Salary Records</h1>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">Manage your Employee Salary Records here.</p>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex w-full md:w-auto space-x-2">
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
                    <Input
                        type="month"
                        placeholder="Search items..."
                        className="flex-grow"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <Button onClick={() => handleSearch()}>
                        Search
                    </Button>
                </div>
                <div className="flex space-x-2">
                    {/* <Button onClick={openAddModal}>
                        Add New Item
                    </Button> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Select onValueChange={(value) => {
                            // setLimitPage(value)
                            setUsersPerPage(Number(value))
                            handleSearch(value)
                        }}
                            value={limitPage?.toString()}
                            required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Record" />
                            </SelectTrigger>
                            <SelectContent>
                                {pagePerView?.map((data, index) => (
                                    <SelectItem key={index} value={data}>{data}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
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
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Online Orders
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Rate
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Petrol
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Bonus Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Extra KMS Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Quality violations
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Total Deduction
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Bike
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Office
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Sim
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Action
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
                                users?.sort((a,b) => new Date(b?.uploading_date) - new Date(a?.uploading_date))?.map((user, index) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{user?.falcon_id}</td> {/* Corrected Sr. No. */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{moment(user?.uploading_date).format("MMM-YY")}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.online_orders || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.rate || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.petrol || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.bonus_amount || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.extra_kms_amount || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.violation || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.total_deduction || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.bike || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.office || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.sim || 0}</td> {/* Access role name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{user?.total || 0}</td> {/* Access role name */}
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
                                            {/* {user.isActive ?
                                                <X
                                                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                    className={'cursor-pointer text-red-600 hover:text-red-500'}
                                                    size={24}
                                                />
                                                :
                                                <Check
                                                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                                                    className={"cursor-pointer text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"}
                                                    size={24}
                                                />
                                            } */}


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

export default Employee;
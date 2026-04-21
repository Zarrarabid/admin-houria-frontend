import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UploadCloud, Download } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';
import { inventorySampleHeading } from '../Data/Data';
import moment from 'moment';
import { Button } from '../components/ui/button';

const API_BASE_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/employee`;

export const Uploaders = () => {
    const token = sessionStorage.getItem('token-auth');
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [dateIs, setDateIs] = useState(moment()?.format("YYYY-MM"));

    const handleFileUpload = (event) => {
        console.log("date----", dateIs);
        const file = event?.target?.files[0];
        let type = file?.name?.substring(file?.name?.lastIndexOf(".") + 1);
        if (file) {
            setFileName(file.name);
            setLoading(true);
            const reader = new FileReader();

            if (type === "xlsx" || type === "csv") {
                reader.onload = (e) => {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        // ✅ Get headers directly from the first row of the sheet
                        const range = XLSX.utils.decode_range(worksheet['!ref']);
                        const headers = [];
                        for (let col = range.s.c; col <= range.e.c; col++) {
                            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
                            const cell = worksheet[cellAddress];
                            if (cell && cell.v !== undefined) {
                                headers.push(String(cell.v).trim());
                            }
                        }

                        const resetAndInvalidate = (message) => {
                            toast.error(message);
                            setExcelData([]);
                        };

                        if (headers.length === 0) {
                            resetAndInvalidate("File should not be empty");
                            return;
                        }

                        const uploadedHeaders = headers.filter((h) => !h.includes("__EMPTY"));

                        console.log(headers, "All headers from sheet", uploadedHeaders);

                        const headersMatch =
                            uploadedHeaders?.length > inventorySampleHeading?.length
                                ? uploadedHeaders?.every((header) =>
                                    inventorySampleHeading.includes(header)
                                )
                                : inventorySampleHeading?.every((header) =>
                                    uploadedHeaders.includes(header)
                                );

                        if (!headersMatch) {
                            resetAndInvalidate(
                                "Uploaded file headers do not match the expected format."
                            );
                            return;
                        }

                        // ✅ Parse rows manually to ensure ALL headers appear in every row
                        const json = XLSX.utils.sheet_to_json(worksheet, { defVal: "" });

                        const filteredData = json.map((obj) => {
                            // Remove __EMPTY keys first
                            const cleanedObj = Object.fromEntries(
                                Object.entries(obj).filter(([key]) => !key.startsWith("__EMPTY"))
                            );

                            // ✅ Ensure every header key exists in the row (fill missing with "")
                            const completeRow = {};
                            uploadedHeaders.forEach((header) => {
                                completeRow[header] = cleanedObj[header] !== undefined ? cleanedObj[header] : "";
                            });

                            return completeRow;
                        });

                        setExcelData(filteredData);
                        toast.success("Excel file uploaded and parsed successfully!");
                    } catch (error) {
                        console.error("Error reading Excel file:", error);
                        toast.error("Error reading Excel file. Please ensure it's a valid Excel format.");
                    } finally {
                        setLoading(false);
                    }
                };

                reader.readAsArrayBuffer(file);
            }
        } else {
            toast.error("Please Upload Correct Format of File");
            setExcelData([]);
            setLoading(false);
        }
        event.target.value = "";
    };

    const handleSubmit = async () => {
        if (!excelData || excelData.length === 0) {
            toast.error("Please upload a valid Excel file first.");
            return;
        }

        if (!dateIs) {
            toast.error("Please select an uploading date.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                data: excelData,          // array of row objects from handleFileUpload
                uploading_date: dateIs,   // your date state
            };

            const res = await axios.post(API_BASE_URL, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                toast.success(`${res.data.inserted} record(s) uploaded successfully!`);
                setExcelData([]);
                setFileName("");
                // setRefreshData(!refreshData);
            }
        } catch (err) {
            console.log("errrrr",err)
            const msg = err?.response?.data?.message || "Bulk upload failed.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // const handleFileUpload = (event) => {
    //     const file = event?.target?.files[0];
    //     let type = file?.name?.substring(file?.name?.lastIndexOf(".") + 1);
    //     if (file) {
    //         setFileName(file.name);
    //         setLoading(true);
    //         const reader = new FileReader();

    //         if (type === "xlsx" || type === "csv") {

    //             reader.onload = (e) => {
    //                 try {
    //                     const data = new Uint8Array(e.target.result);
    //                     const workbook = XLSX.read(data, { type: 'array' });
    //                     const sheetName = workbook.SheetNames[0];
    //                     const worksheet = workbook.Sheets[sheetName];
    //                     const json = XLSX.utils.sheet_to_json(worksheet);

    //                     const resetAndInvalidate = (message) => {
    //                         toast.error(message);
    //                         setExcelData([]);
    //                     };

    //                     if (json?.length === 0) {
    //                         resetAndInvalidate("File Should not be empty");
    //                         return;
    //                     }
    //                         console.log(json,"uploadeee",json[0])


    //                     const uploadedHeaders = Object.keys(json[0])
    //                         ?.filter((ele) => !ele?.includes("__EMPTY"))
    //                         .map((item) => item.trim()?.toLowerCase());


    //                     const headersMatch =
    //                         uploadedHeaders?.length > inventorySampleHeading?.length
    //                             ? uploadedHeaders?.every((header) => {
    //                                 return inventorySampleHeading.includes(header.trim()?.toLowerCase());
    //                             })
    //                             : inventorySampleHeading?.every((header) => {
    //                                 return uploadedHeaders.includes(header.trim()?.toLowerCase());
    //                             });
    //                     if (!headersMatch) {
    //                         resetAndInvalidate(
    //                             "Uploaded file headers do not match the expected format."
    //                         );
    //                         return;
    //                     }

    //                     const filteredData = json?.map((obj) => {
    //                         return Object?.fromEntries(
    //                             Object?.entries(obj)?.filter(
    //                                 ([key]) => !key?.startsWith("__EMPTY")
    //                             )
    //                         );
    //                     });

    //                     setExcelData(filteredData);
    //                     toast.success("Excel file uploaded and parsed successfully!");
    //                 } catch (error) {
    //                     console.error("Error reading Excel file:", error);
    //                     toast.error("Error reading Excel file. Please ensure it's a valid Excel format.");
    //                 } finally {
    //                     setLoading(false);
    //                 }
    //             };

    //             reader.readAsArrayBuffer(file);
    //         }
    //     } else {
    //         toast.error("Please Upload Correct Format of File");
    //         setExcelData([])
    //         setLoading(false)
    //     }
    //     event.target.value = ""
    // };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <ToastContainer />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Excel Uploader</h2>

            <div className="mb-8 p-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700">
                <UploadCloud className="w-12 h-12 text-gray-400 dark:text-gray-300 mb-4" />
                <Label htmlFor="excel-upload" className="cursor-pointer text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {fileName ? `File Selected: ${fileName}` : 'Click to upload an Excel file'}
                </Label>
                <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {fileName ? "Change file" : "(.xlsx, .xls, or .csv files only)"}
                </p>

                <a
                    href={`${import.meta.env.VITE_APP_BACKEND_BASE_URL}public/uploadersSample/Items-Uploader-Samples1.xlsx`}
                    download
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Download className="w-5 h-5 mr-2" />
                    Download Sample Excel
                </a>

            </div>
            <div className="flex w-full md:w-1/3 space-x-2"> {/* Added flex container and spacing */}
                <div className="space-y-1">
                    <label className="text-sm text-gray-600">YYYY-MM</label>
                    <Input
                        type="month"
                        className="block"
                        value={dateIs}
                        onChange={(e) => setDateIs(e.target.value)}
                    />
                </div>
            </div>

            {loading && <Spinner />}

            {excelData.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Data Preview
                        <span className="ml-3 text-base font-normal text-gray-600 dark:text-gray-400">
                            ({excelData.length} records)
                        </span>
                    </h3>
                    <div className="overflow-auto max-h-[50vh] border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    {Object.keys(excelData[0]).map((key) => (
                                        <th
                                            key={key}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
                                        >
                                            {key}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {excelData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        {Object.values(row).map((value, colIndex) => {
                                            console.log("value", value)
                                            return (
                                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                                                    {value === true ? "Active" : value === false ? "Inactive" : value}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button onClick={handleSubmit}>
                        Search
                    </Button>
                </div>
            )}

        </div>
    );
};

export default Uploaders;
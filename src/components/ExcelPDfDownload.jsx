import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from './ui/button';
import { FileSpreadsheet, Printer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";


const ExcelPDfDownload = ({ data, fileName = 'report' }) => {

    const exportPdf = () => {
        if (!data || data.length === 0) {
            console.warn("No data available for PDF export.");
            return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        let yPos = 10; // Initial Y position
        const lineHeight = 7; // Height for each line of text
        const pageHeight = pdf.internal.pageSize.height;
        const margin = 10;

        // Set font
        pdf.setFont('helvetica');
        pdf.setFontSize(12);

        // Add title
        pdf.text("Inventory Report", margin, yPos);
        yPos += 10; // Space after title

        // Define column headers and their X positions
        const headers = [
            { title: "Sr", x: 10 },
            { title: "Product Name", x: 20 },
            { title: "Category", x: 60 },
            { title: "Description", x: 100 },
            { title: "Price", x: 140 },
            { title: "Stock", x: 160 },
            { title: "Status", x: 180 }
        ];

        // Add headers
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        headers.forEach(header => {
            pdf.text(header.title, header.x, yPos);
        });
        yPos += lineHeight;
        pdf.line(margin, yPos - 2, 210 - margin, yPos - 2); // Underline headers
        yPos += 5; // Space after header line

        pdf.setFont('helvetica', 'normal'); // Reset font to normal for data

        data.forEach((item, index) => {
            // Check for page break before adding a new row
            if (yPos + lineHeight > pageHeight - margin) {
                pdf.addPage();
                yPos = margin; // Reset y position for new page
                // Re-add headers on new page
                pdf.setFontSize(10);
                pdf.setFont('helvetica', 'bold');
                headers.forEach(header => {
                    pdf.text(header.title, header.x, yPos);
                });
                yPos += lineHeight;
                pdf.line(margin, yPos - 2, 210 - margin, yPos - 2);
                yPos += 5;
                pdf.setFont('helvetica', 'normal');
            }

            pdf.setFontSize(9); // Smaller font for data
            let currentLineY = yPos; // To handle multi-line descriptions

            pdf.text((index + 1).toString(), headers[0].x, currentLineY);
            pdf.text(item?.name || '', headers[1].x, currentLineY);
            pdf.text(item?.category || '', headers[2].x, currentLineY);

            // Handle potential long descriptions with text wrapping
            const descriptionText = item?.description || '';
            const descriptionLines = pdf.splitTextToSize(descriptionText, 35); // Max width for description column (approx 35mm)
            descriptionLines.forEach((line, i) => {
                pdf.text(line, headers[3].x, currentLineY + (i * lineHeight));
            });
            const descriptionHeight = descriptionLines.length * lineHeight;

            pdf.text(item?.price?.toFixed(2) || '', headers[4].x, currentLineY);
            pdf.text(item?.stock?.toString() || '', headers[5].x, currentLineY);
            pdf.text(item?.isActive ? 'Active' : 'Inactive', headers[6].x, currentLineY);

            // Advance yPos for the next row, considering the tallest content (description)
            yPos += Math.max(lineHeight, descriptionHeight);
        });

        pdf.save(`${fileName}.pdf`);
    };

    const exportExcel = () => {
        if (!data || data.length === 0) {
            console.warn("No data available for Excel export.");
            return;
        }

        const excelData = data.map((item, index) => ({
            'Sr': index + 1,
            'Product Name': item?.name,
            'Category': item?.category,
            'Description': item?.description,
            'Price': item?.price,
            'Stock': item?.stock,
            'Status': item?.isActive ? 'Active' : 'Inactive'
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventory");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (
        <div className="flex space-x-2">
            <Tabs defaultValue="excel">
                <TabsList>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger className="pe-0" value="excel" onClick={exportExcel}>
                                    <FileSpreadsheet
                                        className='cursor-pointer h-6 w-6'
                                    />
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download Excel</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <TabsTrigger className="pe-0" value="pdf" onClick={exportPdf}>
                                    <Printer
                                        className='cursor-pointer h-6 w-6'
                                    />
                                </TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download PDF</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default ExcelPDfDownload;
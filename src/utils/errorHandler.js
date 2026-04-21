// src/utils/errorHandler.js
import { toast } from 'react-toastify';

/**
 * Handles errors from API responses and displays a toast notification.
 * @param {object} error - The error object from an Axios catch block.
 * @param {string} [defaultMessage="An unexpected error occurred."] - Message to display if specific error details are not found.
 */
export const handleApiError = (error, defaultMessage = "An unexpected error occurred.") => {
    let errorMessage = defaultMessage;

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.response.statusText) {
            errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        } else {
            errorMessage = `Server Error: ${error.response.status}`;
        }
    } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your internet connection or try again later.";
    } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
    }

    toast.error(errorMessage);
    console.error("API Error:", error); // Log full error for debugging
};
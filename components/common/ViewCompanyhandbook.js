import { useState, useEffect } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ArrowLeft } from "lucide-react";
import DataLoader from "../ui/dataLoader";

const CompanyHandbookPage = ({ setShowPdf, handbook, role }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if (handbook?.file_path) {
            console.log("Raw PDF URL:", handbook.file_path); // Debug log

            const cleanedUrl = handbook.file_path.replace(/([^:]\/)\/+/g, "$1")


            console.log("Final PDF URL:", cleanedUrl); // Debug log
            setPdfUrl(cleanedUrl);
        }
    }, [handbook]);

    return (
        <div className="p-6 bg-white">
            
                <button
                    onClick={() => setShowPdf(false)}
                    type="button"
                    className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
                >
                    <ArrowLeft className="text-white h-5 w-5" />
                    <span>Back</span>
                </button>
           
            <h2 className="text-xl font-semibold mb-4">Policy {handbook?.file_name}</h2>

            <div className="border rounded-lg ">
                {pdfUrl ? (
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-screen"
                            title="Company Handbook"
                            frameBorder="0"
                        />

                    </Worker>
                ) : (
                    <p className="text-red-500 flex  h-screen items-center justify-center">No File Available.</p>
                )}
            </div>
        </div>
    );
};

export default CompanyHandbookPage;

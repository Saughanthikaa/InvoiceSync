
import '../Components/Invoice.css';
import numberToWords from 'number-to-words';
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Invoice() {
    const location = useLocation();
    const { rowData } = location.state || {};
    const invoiceContentRef = useRef(null); // Create a ref
    if (!rowData) {
        return <p>No data available</p>;
    }
    const totalAmt = rowData.product.reduce((acc, curr) => acc + curr.subtotal, 0) ;
    let tax;
    if (rowData.state.toLowerCase().replace(/\s/g, '') === "tamilnadu"){
        tax = 0.05
    }
    else{
        console.log("state differs")
        tax=0.02+0.02
    }
    const totalAmount = totalAmt * (1+tax)
    console.log("TOTAL AMT  = ",totalAmount ,totalAmt , tax)

    const downloadInvoiceAsPdf = () => {
        const invoiceContent = invoiceContentRef.current;
        if (!invoiceContent) {
            console.error("Invoice content element is null.");
            return;
        }
        const width = invoiceContent.scrollWidth;
        const height = invoiceContent.scrollHeight;
    
        // Set options for html2canvas
        const options = {
            width: width,
            height: height,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight
        };
    
        // Generate canvas
        html2canvas(invoiceContent, options).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
    
            // Create PDF
            const pdf = new jsPDF({
                orientation: "portrait", // Set orientation as needed
                unit: "pt" // Use points for units
            });
            pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save("invoice.pdf");
        });
    };
    
    
    return (
        
        <div className="invoiceContainer">
             <div style={{width:'210mm',background:'white'}}>
                <button onClick={downloadInvoiceAsPdf}>Download as PDF</button>
            </div>
            <div className="invoiceContent" ref={invoiceContentRef}>
           
                <div className="title">
                    <span>SHRI MARIAMMAN TEXTILES</span>
                </div>
                <hr />
                <div className="invoiceDiv">
                    <span>Invoice No : #{rowData.invoiceNo}<br />
                        Tax Invoice No : 27<br />
                        Date : March 5 , 2024<br />
                        Transport : VRL Parcel service ,<br />
                        Gobichettipalayam
                    </span>
                </div>
                <hr />
                <div className="addressDiv">
                    <div>
                        <b>From</b>
                        <p>Shri MAriamman textiles<br />
                            No 38, Karattupalayam Road,<br />
                            Kasipalayam(po),<br />
                            GobiChettipalayam(TK),<br />
                            Erode District,<br />
                            TamilNadu state - 638454.
                        </p>
                    </div>
                    <div>
                        <b>To</b>
                        <p>{rowData.fname} {rowData.lname}<br />
                            {rowData.address}<br />
                            {rowData.city}<br />
                            {rowData.state} - {rowData.pincode}<br></br>
                            phone: {rowData.phone}<br></br>
                            email : {rowData.email}<br></br>
                            GSTIN: 8957694856793847
                        </p>
                    </div>
                </div>
                <hr />
                <div>
                    <table className="invoiceTable">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Description of goods</th>
                                <th>HSN code</th>
                                <th>Quantity (Kgs)</th>
                                <th>Price/Kg</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowData.product.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>1234</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>{product.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <table className="invoiceTable">
                        <thead>
                            <tr>
                                <th>terms and conditions</th>
                                <th>Net value</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <ul>
                                        <li>Certified that the particulars given below are true and correct.</li>
                                        <li>Goods once sold cannot be taken back or exchanged</li>
                                        <li>Interest @1.5 per month will be charged extra if the bills are not paid within 30 days.</li>
                                    </ul>
                                </td>
                                <td>
                                    {rowData.state.toLowerCase().replace(/\s/g, '') === "tamilnadu"?(
                                        <p>
                                        CGST : 0.00<br />
                                        SGST : 0.00<br />
                                        IGST : 5%
                                    </p>
                                    ):(
                                        <p>
                                        CGST : 2%<br />
                                        SGST : 2%<br />
                                        IGST : 0
                                    </p>
                                    )}
                                    
                                </td>
                                <td>{rowData.product.reduce((acc, product)=> acc+product.subtotal,0)}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>TOTAL AMOUNT</td>
                                <td>{totalAmount}</td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    TOTAL INVOICE VALUE -  {numberToWords.toWords(totalAmount)} rupees Only
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <div>
                                            <p>From Shri Mariamman textiles</p>
                                            <br />
                                            <br />
                                            <br />
                                            <p style={{ textAlign: "right" }}>Authorized Signatory</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Invoice;

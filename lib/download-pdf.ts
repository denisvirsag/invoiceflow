import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function downloadInvoicePDF(invoiceNumber: string) {
  const element = document.querySelector(".invoice-print-container") as HTMLElement;
  if (!element) {
    console.error("Invoice element not found");
    return;
  }

  try {
    // We use html2canvas with onclone to modify the cloned DOM before rendering
    // This fixes issues with CSS animations (like opacity: 0) and forces A4-like proportions
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794, // Standard A4 width at 96 DPI
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.querySelector(".invoice-print-container") as HTMLElement;
        if (clonedEl) {
          // Remove animations that cause blank captures
          clonedEl.classList.remove("animate-fade-in-up");
          clonedEl.style.animation = "none";
          clonedEl.style.opacity = "1";
          clonedEl.style.transform = "none";
          
          // Remove border and shadow for a clean document look
          clonedEl.style.boxShadow = "none";
          clonedEl.style.border = "none";
          
          // Force a specific width so it scales nicely into A4
          clonedEl.style.width = "794px";
          clonedEl.style.maxWidth = "794px";
          clonedEl.style.margin = "0";
          clonedEl.style.padding = "40px"; // Give some breathing room like a real document
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    
    // A4 size: 210mm x 297mm
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    
    // Calculate the image height maintaining aspect ratio
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Multi-page support (if invoice is long)
    // Use 10mm tolerance to avoid adding a page for minor spacing/padding overflows
    while (heightLeft > 10) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Sanitize invoice number for filename
    const safeNumber = invoiceNumber.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    pdf.save(`fattura_${safeNumber}.pdf`);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Si è verificato un errore durante la generazione del PDF.");
  }
}

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
        // Reset html and body height to avoid taking 100% of viewport height
        const htmlEl = clonedDoc.documentElement;
        const bodyEl = clonedDoc.body;
        if (htmlEl) {
          htmlEl.style.height = "auto";
          htmlEl.style.minHeight = "auto";
        }
        if (bodyEl) {
          bodyEl.style.height = "auto";
          bodyEl.style.minHeight = "auto";
          bodyEl.style.background = "#ffffff";
        }

        // Hide sidebar, header and page controls that might stretch the cloned canvas
        const sidebar = clonedDoc.querySelector(".dashboard-sidebar");
        if (sidebar) (sidebar as HTMLElement).style.display = "none";

        const pageHeader = clonedDoc.querySelector(".page-header");
        if (pageHeader) (pageHeader as HTMLElement).style.display = "none";

        const actionsWrapper = clonedDoc.querySelector(".page-header + div"); // Action buttons if any
        if (actionsWrapper && !actionsWrapper.classList.contains("invoice-print-container")) {
          (actionsWrapper as HTMLElement).style.display = "none";
        }

        // Remove margins, paddings and display flex from layout main elements in clone
        const dbMain = clonedDoc.querySelector(".dashboard-main") as HTMLElement;
        if (dbMain) {
          dbMain.style.margin = "0";
          dbMain.style.padding = "0";
          dbMain.style.display = "block";
          dbMain.style.minHeight = "auto";
          dbMain.style.height = "auto";
        }

        const dbContent = clonedDoc.querySelector(".dashboard-content") as HTMLElement;
        if (dbContent) {
          dbContent.style.margin = "0";
          dbContent.style.padding = "0";
          dbContent.style.display = "block";
          dbContent.style.minHeight = "auto";
          dbContent.style.height = "auto";
        }

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
    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    let startX = 0;

    // If the content is slightly larger than 1 page (up to 15% overflow), scale it down to fit exactly on 1 page
    if (imgHeight > pageHeight && imgHeight <= pageHeight * 1.15) {
      finalHeight = pageHeight;
      finalWidth = (canvas.width * finalHeight) / canvas.height;
      startX = (imgWidth - finalWidth) / 2; // Center horizontally
    }
    
    let heightLeft = finalHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", startX, position, finalWidth, finalHeight);
    heightLeft -= pageHeight;

    // Multi-page support (if invoice is long)
    // Use 15mm tolerance to avoid adding a page for minor spacing/padding overflows
    while (heightLeft > 15) {
      position = heightLeft - finalHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", startX, position, finalWidth, finalHeight);
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

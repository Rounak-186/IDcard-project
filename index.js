document.addEventListener("DOMContentLoaded", () => {
    const textareas = document.querySelectorAll("textarea");

    const autoResize = (event) => {
        event.target.style.height = "auto"; // Reset height
        event.target.style.height = `${event.target.scrollHeight}px`; // Adjust to content height
    };

    // Attach the input event to each textarea
    textareas.forEach((textarea) => {
        // Resize initially in case there is pre-filled content
        textarea.style.height = `${textarea.scrollHeight}px`;

        // Add event listener
        textarea.addEventListener("input", autoResize);
    });

    const imageInput = document.getElementById("img-input");
    const previewImage = document.getElementById("profile-img");

    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    });

    document.getElementById('screenshotBtn').addEventListener('click', () => {
        const input = document.querySelectorAll('input');
        if (input) {
            input.forEach((element) => {
                element.style.border = "none";
                element.style.outline = "none";
            })
        }
        const preElements = [];

        textareas.forEach(textarea => {
            const pre = document.createElement('pre');
            pre.textContent = textarea.value;
            pre.style.cssText = window.getComputedStyle(textarea).cssText;
            pre.classList.add('textarea-text')
            preElements.push({ textarea, pre });
            textarea.replaceWith(pre);
        });

        const inputBtn = document.getElementById('img-input-btn');
        inputBtn.style.display = "none"
        const captureElement = document.getElementById('capture-box');

        textareas.forEach(textarea => {
            textarea.style.whiteSpace = "pre-wrap";
        })

        html2canvas(captureElement).then((canvas) => {
            // Convert the canvas to a data URL
            const imageData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Calculate dimensions for A4 size
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgWidth = pageWidth - 20; // Add margin
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            // Add image to the PDF
            pdf.addImage(imageData, 'PNG', 10, 10, imgWidth, imgHeight, undefined, 'FAST');

            // Download the PDF
            pdf.save('send-it-to-your-CR.pdf');
        }).catch((error) => {
            console.error("Screenshot failed: ", error);
        }).finally(() => {
            // Restore the original <textarea> elements
            preElements.forEach(({ textarea, pre }) => {
                pre.replaceWith(textarea);
            });
        });

        if (input) {
            input.forEach((element) => {
                element.style.border = "1px solid black";
                element.style.outline = "inherit";
            })
        }
        inputBtn.style.display = "flex"
    });
});
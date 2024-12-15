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

            // Create a temporary <a> element
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData; // Set the image data as the href
            downloadLink.download = 'send-it-to-your-CR.png'; // Set the filename for download

            // Trigger the download
            downloadLink.click();

            // Cleanup (optional, since the element is not added to the DOM)
            downloadLink.remove();
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
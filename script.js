function generateOfferLetter() {
    const name = document.getElementById('name').value.trim();
    const body = document.getElementById('body').value.trim();
    const closetatement = document.getElementById('closetatement').value.trim();
    const company = document.getElementById('company').value.trim();

    if (!name || !body || !company) {
        alert('Please fill in all fields.');
        return;
    }

    // Get the selected image file
    const logoInput = document.getElementById('logo');
    const logoFile = logoInput.files[0];

    let logoSrc = 'img.png'; // Default image source

    if (logoFile) {
        const reader = new FileReader();

        reader.onload = function (e) {
            logoSrc = e.target.result;
            generatePDF(name, body, closetatement, company, logoSrc);
        };

        reader.readAsDataURL(logoFile);
    } else {
        generatePDF(name, body, closetatement, company, logoSrc);
    }
}

function generatePDF(name, body, closetatement, company, logoSrc) {
    const content = `
        <div style="text-align: center;">
            <img src="${logoSrc}" alt="Company Logo" style="width: 100%; height: 100px; padding-top: -20px; display: block; margin-left: auto; margin-right: auto;">
        </div>
        <div style="text-align: center;"><h3><hr>Letter of Appointment<hr></h3></div>
        <h4>Dear ${name},</h4>
        <p>${body}</p>
        <!-- Add more content as needed -->

        <p>${closetatement},</p>
        <p>${company}</p>
    `;

    const offerLetter = document.createElement('div');
    offerLetter.innerHTML = content;

    const pdfOptions = {
        margin: 20,
        filename: `${name}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(offerLetter, pdfOptions);
}

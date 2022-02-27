const API_KEY = "ilbsSzTRFAvXADggfWZfq1_el0U";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function postForm(data) {
    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                    "Authorization": API_KEY,
        },
                                body: form
    });

    const data2 = await response.json();

    if (response.ok) {
        displayErrors(data2);
    } else {
        displayException(data2);
        throw new Error(data2.error);
    }
}

function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div> class="no_errors">No errors reported!</div`;
    } else {
        results += `<div>Total Errors: <span class="error_count">${data.total_errors}</span>, `;
        for (let error of data.error_list) {
            results += `<div>At line: <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col} </span></div>`;
            results += `<div class="error">${error.error} </div>`;
        }
    }

    document.getElementById('resultsModalTitle').textContent = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}

async function getStatus() {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data.error);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading =
        document.getElementById('resultsModalTitle').textContent = "API Key Status";
    document.getElementById('results-content').innerHTML = `<p>Your key is valid until</p>
    ${data.expiry}`;
    resultsModal.show();

}

function displayException(data) {

    let results = "";

    let heading = `An Exception Occured`;

    results += `<div>The API returned status code <span class="status">${data.status_code}</span>, `;
    results += `<div>Error number: <strong>${data.error_no}</strong> </div>`;
    results += `<div>Error text: <strong>${data.error}</stong></div>`;

    document.getElementById('resultsModalTitle').textContent = heading;
    document.getElementById('results-content').innerHTML = results;
    resultsModal.show();
}
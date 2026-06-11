const API_BASE_URL = "https://your-backend-api-url.render.com/api/v1"; 

async function fetchOfficeStatuses() {
    const listContainer = document.getElementById('office-list');
    try {
        const dummyOffices = [
            { office_name: "Bhimtal Tehsil Office", current_status: "Active" },
            { office_name: "Local Block Development Office", current_status: "Closed" }
        ];

        listContainer.innerHTML = ''; 
        dummyOffices.forEach(office => {
            const statusClass = office.current_status === "Active" ? "status-active" : "status-closed";
            listContainer.innerHTML += `
                <div class="office-card">
                    <h3>${office.office_name}</h3>
                    <p>Current Status: <span class="${statusClass}">${office.current_status}</span></p>
                </div>
            `;
        });
    } catch (error) {
        listContainer.innerHTML = '<p class="status-closed">Unable to load live statuses right now.</p>';
    }
}

document.getElementById('qa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone-input').value;
    const question = document.getElementById('question-input').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/submit-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_text: question, asked_by_phone: phone })
        });

        if(response.ok) {
            alert('Your question has been added to the verification queue!');
            document.getElementById('question-input').value = '';
        }
    } catch (error) {
        appendLocalQuestion(question);
        document.getElementById('question-input').value = '';
    }
});

function appendLocalQuestion(text) {
    const feed = document.getElementById('qa-feed');
    feed.innerHTML = `
        <div class="qa-item">
            <p class="qa-question">❓ Question: ${text}</p>
            <p class="qa-answer">⏳ <em>Waiting for verified officer response...</em></p>
        </div>
    ` + feed.innerHTML;

    localStorage.setItem('latestCitizenQuery', text);
}

window.onload = () => {
    fetchOfficeStatuses();
};

// Base configuration URL pointing to your backend engine service
const API_BASE_URL = "https://your-backend-api-url.render.com/api/v1"; 

// 1. Fetch live statuses from the backend database
async function fetchOfficeStatuses() {
    const listContainer = document.getElementById('office-list');
    try {
        // Prototype visual display array
        const dummyOffices = [
            { office_name: "Bhimtal Tehsil Office", current_status: "Active" },
            { office_name: "Local Block Development Office", current_status: "Closed" }
        ];

        listContainer.innerHTML = ''; // Clear loading message
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

// 2. Handle Submitting a Question
document.getElementById('qa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('phone-input').value;
    const question = document.getElementById('question-input').value;
    
    const payload = {
        question_text: question,
        asked_by_phone: phone
    };

    try {
        // Live database communication attempt
        const response = await fetch(`${API_BASE_URL}/submit-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if(response.ok) {
            alert('Your question has been added to the verification queue!');
            document.getElementById('question-input').value = '';
        }
    } catch (error) {
        // Shared fallback logic for hackathon visual demonstration
        appendLocalQuestion(question);
        document.getElementById('question-input').value = '';
    }
});

// Helper to update the visual UI feed and pass the question to officer.html via browser cache memory
function appendLocalQuestion(text) {
    const feed = document.getElementById('qa-feed');
    
    // Render immediately on the citizen screen
    feed.innerHTML = `
        <div class="qa-item">
            <p class="qa-question">❓ Question: ${text}</p>
            <p class="qa-answer">⏳ <em>Waiting for verified officer response...</em></p>
        </div>
    ` + feed.innerHTML;

    // Save item locally to a shared browser drawer so officer page can see it instantly
    localStorage.setItem('latestCitizenQuery', text);
}

// Initialize components on layout load
window.onload = () => {
    fetchOfficeStatuses();
};

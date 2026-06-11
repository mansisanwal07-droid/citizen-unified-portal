const API_BASE_URL = "https://your-backend-api-url.render.com/api/v1"; 

// 1. Core Component Rendering Logic for Office Availability Status Cards
function renderOfficeUI(tehsilStatus, bdoStatus) {
    const listContainer = document.getElementById('office-list');
    if (!listContainer) return;

    const offices = [
        { office_name: "Bhimtal Tehsil Office", current_status: tehsilStatus },
        { office_name: "Local Block Development Office", current_status: bdoStatus }
    ];

    listContainer.innerHTML = ''; 
    offices.forEach(office => {
        const statusClass = office.current_status === "Active" ? "status-active" : "status-closed";
        listContainer.innerHTML += `
            <div class="office-card">
                <h3>${office.office_name}</h3>
                <p>Current Status: <span class="${statusClass}">${office.current_status}</span></p>
            </div>
        `;
    });
}

// 2. Load Office Statuses out of Shared Memory Caches
function fetchOfficeStatuses() {
    const cachedTehsil = localStorage.getItem('status_BhimtalTehsil') || "Active";
    const cachedBdo = localStorage.getItem('status_LocalBdo') || "Closed";
    renderOfficeUI(cachedTehsil, cachedBdo);
}

// 3. Render the Public Multi-User Q&A Registry Feed
function renderPublicQAFeed() {
    const feed = document.getElementById('qa-feed');
    if (!feed) return;

    // Pull the complete array list of all citizen questions out of cache registry memory
    const existingQueries = JSON.parse(localStorage.getItem('grus_query_registry')) || [];

    if (existingQueries.length === 0) {
        feed.innerHTML = `<p style="color: #666; font-style: italic;">No citizen questions asked yet today. Be the first to ask!</p>`;
        return;
    }

    feed.innerHTML = ''; // Clear layout loader
    // Loop through every submitted customer ticket item backwards (latest first)
    existingQueries.slice().reverse().forEach(item => {
        const resolutionContent = item.answer 
            ? `<p class="qa-answer"><strong>✅ Verified Answer:</strong> ${item.answer}</p>` 
            : `<p class="qa-answer" style="background: #fffdf0; border-left-color: #ffc107; color: #856404;">⏳ <em>Waiting for verified officer response...</em></p>`;

        feed.innerHTML += `
            <div class="qa-item" style="margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px;">
                <p class="qa-question"><strong>❓ Question:</strong> ${item.text}</p>
                <p style="margin: 0 0 5px 0; font-size: 0.8rem; color: #888;">Submitted by: ${item.phone} | Ticket ID: GRUS-${item.id}</p>
                ${resolutionContent}
            </div>
        `;
    });
}

// 4. Dynamic Live Cross-Tab Storage Listener Hook
window.addEventListener('storage', (event) => {
    if (event.key === 'status_BhimtalTehsil' || event.key === 'status_LocalBdo') {
        fetchOfficeStatuses();
    }
    if (event.key === 'grus_query_registry') {
        renderPublicQAFeed();
    }
});

// 5. Form Submission Interface Controller
document.getElementById('qa-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('phone-input').value;
    const question = document.getElementById('question-input').value;
    
    try {
        await fetch(`${API_BASE_URL}/submit-question`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question_text: question, asked_by_phone: phone })
        });
    } catch (error) {
        // Shared fallback logic to stack question array variables locally
        appendLocalQuestion(phone, question);
        document.getElementById('question-input').value = '';
    }
});

function appendLocalQuestion(phone, text) {
    const existingQueries = JSON.parse(localStorage.getItem('grus_query_registry')) || [];
    
    // Construct a multi-user structured customer ticket object payload
    const newTicket = {
        id: Math.floor(1000 + Math.random() * 9000), // Unique ticket serial token
        phone: phone.substring(0, 4) + "XXXXX", // Mask sensitive data elements
        text: text,
        answer: null
    };

    existingQueries.push(newTicket);
    localStorage.setItem('grus_query_registry', JSON.stringify(existingQueries));
    
    renderPublicQAFeed();
}

// System Startup Initializations
window.onload = () => {
    fetchOfficeStatuses();
    renderPublicQAFeed();
};

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const heroSection = document.getElementById('hero-section');
    const formSection = document.getElementById('form-section');
    const trackSection = document.getElementById('track-section');
    const successSection = document.getElementById('success-section');
    const trackResults = document.getElementById('track-results');
    const lodgeBtn = document.getElementById('lodge-btn');
    const trackBtn = document.getElementById('track-btn');
    const submitBtn = document.getElementById('submit-btn');
    const trackForm = document.getElementById('track-form');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const backToHomeButtons = document.querySelectorAll('.back-to-home');
    let currentStep = 0;

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.style.display = (index === stepIndex) ? 'block' : 'none';
        });
        updateProgress();
    }

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index <= currentStep);
        });
    }

    function validateStep(stepIndex) {
        const currentStepEl = formSteps[stepIndex];
        let allFieldsValid = true;
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            let isValid = true;
            let container = field.closest('.form-group') || field.closest('.issue-grid');
            if (field.type === 'radio') {
                if (![...document.querySelectorAll(`input[name="${field.name}"]`)].some(r => r.checked)) isValid = false;
            } else {
                if (!field.value.trim()) isValid = false;
            }
            let errorMsg = container.querySelector('.error-message');
            if (!isValid) {
                allFieldsValid = false;
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = '0.8rem';
                    container.appendChild(errorMsg);
                }
                errorMsg.textContent = 'This field is required.';
            } else {
                if (errorMsg) errorMsg.remove();
            }
        });
        return allFieldsValid;
    }

    function resetToHome() {
        [formSection, trackSection, successSection, trackResults].forEach(sec => sec.classList.add('hidden'));
        heroSection.classList.remove('hidden');
        document.getElementById('grievance-form').reset();
        document.getElementById('track-form').reset();
        currentStep = 0;
        showStep(currentStep);
    }

    lodgeBtn.addEventListener('click', () => {
        heroSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        showStep(0);
    });
    trackBtn.addEventListener('click', () => {
        heroSection.classList.add('hidden');
        trackSection.classList.remove('hidden');
    });
    nextBtns.forEach(btn => btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            showStep(currentStep);
        }
    }));
    prevBtns.forEach(btn => btn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    }));
    backToHomeButtons.forEach(btn => btn.addEventListener('click', resetToHome));

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        const formData = new FormData(document.getElementById('grievance-form'));
        const ticketData = {
            issue_type: formData.get('issue-type') || 'Other',
            location_text: formData.get('location'),
            description_raw: formData.get('description'),
            citizenContact: formData.get('contact')
        };
        try {
            const response = await fetch('https://arani-backend.onrender.com/api/v1/tickets/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });
            if (!response.ok) throw new Error(await response.text());
            const result = await response.json();
            formSection.classList.add('hidden');
            successSection.classList.remove('hidden');
            document.getElementById('ticket-id').textContent = result.ticketId;
        } catch (error) {
            console.error('Error submitting grievance:', error);
            alert('Error submitting grievance. Check console.');
        } finally {
            submitBtn.innerHTML = 'Submit Grievance';
            submitBtn.disabled = false;
        }
    });

    trackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ticketId = document.getElementById('ticket-id-input').value.trim();
        if (!ticketId) return;
        const searchButton = document.getElementById('search-ticket');
        searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const response = await fetch(`https://arani-backend.onrender.com/api/v1/tickets/${ticketId}`);
            if (!response.ok) {
                alert(response.status === 404 ? "Ticket ID not found." : "An error occurred.");
                throw new Error("Ticket fetch failed.");
            }
            const ticket = await response.json();
            document.getElementById('display-ticket-id').textContent = ticket.ticketId;
            document.getElementById('result-type').textContent = ticket.issue_type;
            document.getElementById('result-location').textContent = ticket.location_text;
            document.getElementById('result-date').textContent = new Date(ticket.createdAt).toLocaleString();
            const statusItems = document.querySelectorAll('.status-tracker .status-item');
            const statusMap = { "New": 0, "InProgress": 1, "Assigned": 1, "Resolved": 3 };
            const currentStatusIndex = statusMap[ticket.status] ?? 0;
            statusItems.forEach((item, index) => {
                const icon = item.querySelector('.status-icon');
                item.className = 'status-item';
                icon.innerHTML = `<i class="far fa-circle"></i>`;
                if (index < currentStatusIndex) {
                    item.classList.add('completed');
                    icon.innerHTML = `<i class="fas fa-check-circle"></i>`;
                } else if (index === currentStatusIndex) {
                    item.classList.add('in-progress');
                    icon.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
                }
            });
            const updatesContainer = document.querySelector('.ticket-updates');
            const latestUpdate = ticket.updates[ticket.updates.length - 1];
            if (latestUpdate) {
                updatesContainer.querySelector('.update-date').textContent = new Date(latestUpdate.timestamp).toLocaleString();
                updatesContainer.querySelector('.update-text').textContent = latestUpdate.comment;
            }
            trackResults.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching ticket:', error);
            trackResults.classList.add('hidden');
        } finally {
            searchButton.innerHTML = '<i class="fas fa-search"></i>';
        }
    });
    showStep(0);
});
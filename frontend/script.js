document.addEventListener('DOMContentLoaded', function() {
    fetchAndDisplayTickets();
});

async function fetchAndDisplayTickets() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/tickets/');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const tickets = await response.json();
        const tableBody = document.querySelector('.ticket-queue tbody');
        tableBody.innerHTML = '';

        if (tickets.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No tickets found. Submit one from the Public Portal!</td></tr>';
            return;
        }

        tickets.forEach(ticket => {
            const statusClass = getStatusClass(ticket.status, ticket.ai_insights?.urgency);
            const sourceIcon = getSourceIcon(ticket.source);
            const timeSince = getTimeSince(new Date(ticket.createdAt));
            const summary = ticket.ai_insights?.summary || ticket.description_raw.substring(0, 70) + '...';

            const row = `
                <tr class="ticket" data-id="${ticket.ticketId}">
                    <td><span class="status-dot ${statusClass}"></span></td>
                    <td>${ticket.ticketId}</td>
                    <td>${summary}</td>
                    <td>${ticket.location_text}</td>
                    <td><i class="fas ${sourceIcon} source-icon"></i></td>
                    <td class="sla-timer">${timeSince}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
        
        addTicketClickListeners(tickets);
    } catch (error) {
        console.error('Failed to fetch tickets:', error);
        document.querySelector('.ticket-queue tbody').innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Failed to load tickets. Is the backend running?</td></tr>';
    }
}

function addTicketClickListeners(tickets) {
    document.querySelectorAll('.ticket').forEach(row => {
        row.addEventListener('click', function() {
            document.querySelectorAll('.ticket').forEach(r => r.classList.remove('selected'));
            this.classList.add('selected');
            const ticketId = this.getAttribute('data-id');
            const ticketData = tickets.find(t => t.ticketId === ticketId);
            if (ticketData) displayTicketDetails(ticketData);
        });
    });
}

function displayTicketDetails(data) {
    document.querySelector('.ticket-details').classList.remove('hidden');
    document.querySelector('.empty-state').classList.add('hidden');
    
    document.querySelector('.detail-ticket-id').textContent = data.ticketId;
    document.querySelector('.detail-ticket-title').textContent = data.issue_type;
    document.querySelector('.citizen-contact').textContent = data.citizenContact || 'N/A';
    document.querySelector('.complaint-content').textContent = data.description_raw;
    document.querySelector('.map-placeholder span').textContent = data.location_text;

    const departments = (data.assignedDepartmentIds || []).join(', ');
    document.querySelector('.insight-value.negative').textContent = `Departments: ${departments}`;
    document.querySelector('.insight-value.urgency-value').textContent = `Urgency: ${data.ai_insights?.urgency || 'N/A'} / 5`;
    
    document.querySelector('.entities').innerHTML = `<span class="entity">${data.ai_insights?.summary || 'N/A'}</span>`;
    document.querySelector('.duplicate-tickets').innerHTML = '<span>N/A</span>';

    const statusBadge = document.querySelector('.status-badge');
    const priority = getStatusClass(data.status, data.ai_insights?.urgency);
    statusBadge.className = `status-badge status-${priority}`;
    statusBadge.textContent = `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`;
}

function getStatusClass(status, urgency = 3) {
    if (status !== 'New') return 'low';
    if (urgency >= 4) return 'high';
    if (urgency >= 3) return 'medium';
    return 'low';
}

function getSourceIcon(source = 'web') {
    const sourceMap = { twitter: 'fa-twitter', email: 'fa-envelope', app: 'fa-mobile-alt', web: 'fa-desktop' };
    return sourceMap[source.toLowerCase()] || 'fa-question-circle';
}

function getTimeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
}
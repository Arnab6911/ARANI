document.addEventListener('DOMContentLoaded', function() {
    // --- CHART INITIALIZATION ---
    const ctx = document.getElementById('department-chart').getContext('2d');
    const departmentChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#0A4D68','#088395','#05BFDB','#00FFCA','#6c757d','#ffc107','#dc3545'] }] },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
    });

    // --- MAIN DATA FETCHING FUNCTION ---
    async function fetchDashboardData() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/analytics/dashboard-data');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            updateKPIs(data.kpis);
            updateDepartmentChart(data.departmentChart);
            renderLeaderboard(data.leaderboard);
            renderSystemicAlerts(data.alerts);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            document.body.innerHTML = `<div style="text-align:center; padding:50px; color:red;"><h2>Failed to load dashboard data.</h2><p>Please ensure the backend server is running correctly.</p></div>`;
        }
    }

    // --- UI UPDATE FUNCTIONS ---
    function updateKPIs(kpis) {
        document.querySelector('#kpi-total .kpi-value').textContent = kpis.totalGrievances;
        document.querySelector('#kpi-resolution .kpi-value').textContent = kpis.avgResolutionTime;
        document.querySelector('#kpi-csat .kpi-value').textContent = `${kpis.citizenSatisfaction} / 5`;
        document.querySelector('#kpi-sla .kpi-value').textContent = kpis.slaBreaches;
    }

    function updateDepartmentChart(chartData) {
        departmentChart.data.labels = chartData.labels;
        departmentChart.data.datasets[0].data = chartData.data;
        departmentChart.update();
    }

    function renderLeaderboard(leaderboardData) {
        const tbody = document.querySelector('#leaderboard-container tbody');
        tbody.innerHTML = '';
        if (!leaderboardData || leaderboardData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No data available.</td></tr>';
            return;
        }
        leaderboardData.forEach(dept => {
            const row = `<tr>
                <td>${dept.rank}</td>
                <td>${dept.department}</td>
                <td>${dept.ticketCount}</td>
                <td>${dept.csat} / 5</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }

    function renderSystemicAlerts(alertsData) {
        const container = document.getElementById('alerts-container');
        container.innerHTML = '';
        if (!alertsData || alertsData.length === 0) {
            container.innerHTML = '<p>No systemic issues detected. Great work!</p>';
            return;
        }
        alertsData.forEach(alert => {
            const alertDiv = `
                <div class="alert ${alert.level}">
                    <div class="alert-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-description">${alert.description}</div>
                    </div>
                </div>`;
            container.innerHTML += alertDiv;
        });
    }

    // --- INITIALIZE DASHBOARD ---
    fetchDashboardData();
    initializeHotspotMap();
});

function initializeHotspotMap() {
    var container = L.DomUtil.get('hotspot-map');
    if(container != null) container._leaflet_id = null;
    const map = L.map('hotspot-map').setView([22.5868, 88.4804], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const heatData = [ [22.5697, 88.4309, 0.8],[22.5695, 88.4315, 0.9],[22.5800, 88.4150, 0.5],[22.6200, 88.4550, 0.7] ];
    L.heatLayer(heatData, {radius: 25}).addTo(map);
}
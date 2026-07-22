let activeSessionsTab = "upcoming";

const defaultRequests = [
    {
        id: 201,
        personId: 105, // Jessica Taylor
        name: "Jessica Taylor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "UI/UX Design",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        time: "10:00 - 11:00",
        type: "incoming",
        status: "pending"
    },
    {
        id: 202,
        personId: 106, // Arjun Mehta
        name: "Arjun Mehta",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "JavaScript Web Programming",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
        time: "15:00 - 16:00",
        type: "incoming",
        status: "pending"
    },
    {
        id: 203,
        personId: 102, // Mateo Silva
        name: "Mateo Silva",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Python & SQLite Queries",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "11:00 - 12:00",
        type: "outgoing",
        status: "pending"
    },
    {
        id: 204,
        personId: 101, // Sarah Jenkins
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Figma Layout secrets",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "16:00 - 17:00",
        type: "outgoing",
        status: "accepted" // already scheduled
    },
    {
        id: 205,
        personId: 103, // Emily Chen
        name: "Emily Chen",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Conversational Mandarin",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "09:00 - 10:00",
        type: "incoming",
        status: "accepted" // already scheduled
    },
    {
        id: 206,
        personId: 106, // Arjun Mehta
        name: "Arjun Mehta",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "React Web App Development",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "14:00 - 15:00",
        type: "outgoing",
        status: "accepted"
    },
    {
        id: 207,
        personId: 105, // Jessica Taylor
        name: "Jessica Taylor",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "SEO Audit & Optimization",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "11:00 - 12:00",
        type: "incoming",
        status: "completed"
    },
    {
        id: 208,
        personId: 104, // Carlos Mendez
        name: "Carlos Mendez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Acoustic Guitar Basics",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "16:00 - 17:00",
        type: "outgoing",
        status: "completed"
    },
    {
        id: 209,
        personId: 102, // Mateo Silva
        name: "Mateo Silva",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Advanced SQLite Queries",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "10:00 - 11:00",
        type: "incoming",
        status: "cancelled"
    },
    {
        id: 210,
        personId: 101, // Sarah Jenkins
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        skill: "Figma Typography Guide",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
        time: "13:00 - 14:00",
        type: "outgoing",
        status: "rejected"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sync User Header info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('headerUserName').textContent = user.firstName;
        document.getElementById('headerUserRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        document.getElementById('headerUserAvatar').textContent = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }

    // 2. Initialize requests from LocalStorage & upgrade if necessary
    const existingReqs = localStorage.getItem("session_requests");
    if (!existingReqs || JSON.parse(existingReqs).length < 10) {
        localStorage.setItem("session_requests", JSON.stringify(defaultRequests));
    }

    // 3. Load and render sessions list
    renderMySessions();
});

// Toggle Sessions Tabs
function selectSessionsTab(e, tabName) {
    const tabs = document.querySelectorAll(".session-tab-btn");
    tabs.forEach(t => t.classList.remove("active"));
    e.currentTarget.classList.add("active");

    activeSessionsTab = tabName;
    renderMySessions();
}

// Render Scheduled Sessions Feed
function renderMySessions() {
    const container = document.getElementById("sessionsFeedContainer");
    const sessions = JSON.parse(localStorage.getItem("session_requests")) || [];

    // Calculate tab stats
    const upcomingCount = sessions.filter(s => s.status === 'accepted').length;
    const completedCount = sessions.filter(s => s.status === 'completed').length;
    const cancelledCount = sessions.filter(s => s.status === 'rejected' || s.status === 'cancelled').length;

    document.getElementById("upcomingCount").textContent = upcomingCount;
    document.getElementById("completedCount").textContent = completedCount;
    document.getElementById("cancelledCount").textContent = cancelledCount;

    container.innerHTML = "";

    // Filter items based on active tab
    let filtered = [];
    if (activeSessionsTab === "upcoming") {
        filtered = sessions.filter(s => s.status === 'accepted');
    } else if (activeSessionsTab === "completed") {
        filtered = sessions.filter(s => s.status === 'completed');
    } else if (activeSessionsTab === "cancelled") {
        filtered = sessions.filter(s => s.status === 'rejected' || s.status === 'cancelled');
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-light); background: var(--surface); border: 1px dashed var(--border); border-radius: var(--radius)">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📖</div>
                <h3>No sessions found under this tab.</h3>
                <p style="font-size: 0.85rem; margin-top: 0.2rem;">Sessions that are scheduled, finished, or closed will show here.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(session => {
        const card = document.createElement("div");
        card.className = "my-session-card";

        // Date Display
        const dateObj = new Date(session.date);
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        // Determine Teacher and Role label
        // If type is outgoing: you requested them to teach you (partner is Teacher)
        // If type is incoming: they requested you to teach them (you are Teacher)
        const isOutgoing = session.type === "outgoing";
        const teacherName = isOutgoing ? session.name : "You (Teaching)";
        const learnerName = isOutgoing ? "You" : session.name;
        const roleLabel = isOutgoing ? "Learn Skill" : "Teach Skill";

        // Status Badge class
        let badgeClass = "upcoming";
        if (session.status === "completed") badgeClass = "completed";
        if (session.status === "rejected" || session.status === "cancelled") badgeClass = "cancelled";

        // Start button / text layout
        let actionMarkup = "";
        if (activeSessionsTab === "upcoming") {
            actionMarkup = `
                <button class="btn-start-session" onclick="startSession(${session.id})">💻 Start Session</button>
            `;
        } else {
            actionMarkup = `<span style="font-size:0.8rem; color:var(--text-light); font-style:italic;">Session locked</span>`;
        }

        card.innerHTML = `
            <div class="mysession-header">
                <img src="${session.avatar}" alt="${session.name}" class="mysession-avatar">
                <div class="mysession-title-block">
                    <h3>${session.name}</h3>
                    <div class="mysession-role-txt">${roleLabel}: <span>${session.skill}</span></div>
                </div>
            </div>

            <div class="mysession-schedule-box">
                <div>
                    <span class="schedule-icon">📅</span>
                    <span>${formattedDate}</span>
                </div>
                <div>
                    <span class="schedule-icon">🕒</span>
                    <span>${session.time}</span>
                </div>
                <div style="margin-top:0.4rem; font-weight:600;">
                    <span>👤 Teacher:</span> &nbsp; <span>${teacherName}</span>
                </div>
                <div style="font-weight:600;">
                    <span>👤 Learner:</span> &nbsp; <span>${learnerName}</span>
                </div>
            </div>

            <div class="mysession-footer">
                <span class="session-status ${badgeClass}">${session.status}</span>
                ${actionMarkup}
            </div>
        `;

        container.appendChild(card);
    });
}

// Redirect to Jitsi Session call room passing session ID
function startSession(sessionId) {
    window.location.href = `session-room.html?id=${sessionId}`;
}

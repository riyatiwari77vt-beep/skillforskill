// Mock peer reviews list
const mockReviews = [
    {
        id: 501,
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        rating: 5,
        date: "2026-07-21",
        comment: "Excellent experience learning CSS transitions! They explained complicated concepts in a very simple, interactive way. Highly recommended teacher!",
        badges: ["Clear Explanations", "Patient Mentor"]
    },
    {
        id: 502,
        name: "Mateo Silva",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        rating: 5,
        date: "2026-07-18",
        comment: "Very polite, followed schedules on time, and had clear goals in mind. They grasped the Python basics extremely fast. A pleasure to swap skills with!",
        badges: ["Quick Learner", "Super Punctual"]
    },
    {
        id: 503,
        name: "Emily Chen",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80",
        rating: 4,
        date: "2026-07-14",
        comment: "We had a great Mandarin conversation session. They asked excellent grammar questions and practiced pronunciation diligently. Looking forward to our next swap!",
        badges: ["Active Learner"]
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

    // 2. Setup interactive stars
    setupStars();

    // 3. Render reviews
    renderReviews();
});

// Setup star click listeners
function setupStars() {
    const stars = document.querySelectorAll(".star-interactive");
    const hiddenInput = document.getElementById("ratingInput");

    // Initialize all stars to gold (default 5 stars)
    updateStars(5);

    stars.forEach(star => {
        star.addEventListener("click", () => {
            const val = parseInt(star.getAttribute("data-val"));
            hiddenInput.value = val;
            updateStars(val);
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll(".star-interactive");
    stars.forEach(s => {
        const val = parseInt(s.getAttribute("data-val"));
        if (val <= rating) {
            s.classList.add("gold");
        } else {
            s.classList.remove("gold");
        }
    });
}

// Render reviews feed
function renderReviews() {
    const list = document.getElementById("reviewsFeedList");
    list.innerHTML = "";

    mockReviews.forEach(rev => {
        const item = document.createElement("div");
        item.className = "review-feed-item";

        // Date options
        const dateObj = new Date(rev.date);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);

        // Generate stars string
        const starsStr = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);

        item.innerHTML = `
            <div class="review-item-header">
                <div class="review-user-info">
                    <img src="${rev.avatar}" alt="${rev.name}">
                    <div>
                        <h4>${rev.name}</h4>
                        <p>Traded on ${formattedDate}</p>
                    </div>
                </div>
                <div class="review-rating-stars">${starsStr}</div>
            </div>
            <div class="review-comment">"${rev.comment}"</div>
            <div class="review-badges-row">
                ${rev.badges.map(b => `<span class="badge-tag">${b}</span>`).join("")}
            </div>
        `;

        list.appendChild(item);
    });
}

// Submit Review Form
function submitReview(e) {
    e.preventDefault();

    const partnerSelect = document.getElementById("partnerSelect");
    const commentInput = document.getElementById("reviewComment");
    const ratingInput = document.getElementById("ratingInput");

    const partnerName = partnerSelect.value;
    const rating = parseInt(ratingInput.value);
    const comment = commentInput.value.trim();

    // Find avatar matching partner
    let avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"; // default
    if (partnerName === "Sarah Jenkins") {
        avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80";
    } else if (partnerName === "Emily Chen") {
        avatar = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80";
    }

    const newReview = {
        id: Date.now(),
        name: partnerName,
        avatar: avatar,
        rating: rating,
        date: new Date().toISOString().split('T')[0], // today
        comment: comment,
        badges: ["Swapped Partner"]
    };

    mockReviews.unshift(newReview);
    renderReviews();

    // Reset Form
    commentInput.value = "";
    partnerSelect.selectedIndex = 0;
    ratingInput.value = 5;
    updateStars(5);

    alert(`Feedback submitted successfully! Thanks for reviewing ${partnerName}.`);
}

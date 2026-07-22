const { dbQuery } = require('../config/db');

// Get Profile Controller
exports.getProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required in headers.' });
        }

        const user = await dbQuery.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Parse JSON fields or use defaults
        let achievements = [];
        try {
            achievements = user.achievements ? JSON.parse(user.achievements) : [
                { icon: "🎓", title: "First Session", description: "Completed your first peer-to-peer lesson" },
                { icon: "🌟", title: "Top Teacher", description: "Received a 5-star rating for teaching code" },
                { icon: "⏱️", title: "Time Saver", description: "Earned 10+ time credits" }
            ];
        } catch (e) {
            achievements = [];
        }

        let recentActivity = [];
        try {
            recentActivity = user.recent_activity ? JSON.parse(user.recent_activity) : [
                { time: "2 hours ago", icon: "🎓", type: "session", text: "Learned UI Design Basics" },
                { time: "Yesterday", icon: "📚", type: "teach", text: "Taught JavaScript Functions" },
                { time: "3 days ago", icon: "🎉", type: "badge", text: "Earned 'Top Teacher' badge" }
            ];
        } catch (e) {
            recentActivity = [];
        }

        return res.status(200).json({
            success: true,
            profile: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio || '',
                avatar: user.avatar || '',
                skillsTeach: user.skills_teach || '',
                skillsLearn: user.skills_learn || '',
                creditsEarned: user.credits_earned !== null ? user.credits_earned : 120,
                skillsTaughtCount: user.skills_taught_count !== null ? user.skills_taught_count : 45,
                hoursLearned: user.hours_learned !== null ? user.hours_learned : 78,
                achievements,
                recentActivity
            }
        });

    } catch (error) {
        console.error('❌ Get Profile Error:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

// Update Profile Controller
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { firstName, lastName, bio, avatar, role, skillsTeach, skillsLearn } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required in headers.' });
        }

        // Validate basic details
        if (!firstName || !lastName || !role) {
            return res.status(400).json({ success: false, message: 'First name, last name, and role are required.' });
        }

        // Fetch current user row for logs/activity
        const user = await dbQuery.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Prepare new activity logs
        let recentActivity = [];
        try {
            recentActivity = user.recent_activity ? JSON.parse(user.recent_activity) : [
                { time: "2 hours ago", icon: "🎓", type: "session", text: "Learned UI Design Basics" },
                { time: "Yesterday", icon: "📚", type: "teach", text: "Taught JavaScript Functions" },
                { time: "3 days ago", icon: "🎉", type: "badge", text: "Earned 'Top Teacher' badge" }
            ];
        } catch (e) {
            recentActivity = [];
        }

        // Add update activity log at the top of timeline
        recentActivity.unshift({
            time: "Just now",
            icon: "⚙️",
            type: "update",
            text: "Updated profile details"
        });

        // Limit activity array size
        if (recentActivity.length > 8) {
            recentActivity = recentActivity.slice(0, 8);
        }

        // Run UPDATE SQL
        await dbQuery.run(
            `UPDATE users 
             SET first_name = ?, last_name = ?, bio = ?, avatar = ?, role = ?, skills_teach = ?, skills_learn = ?, recent_activity = ?
             WHERE id = ?`,
            [firstName, lastName, bio || '', avatar || '', role, skillsTeach || '', skillsLearn || '', JSON.stringify(recentActivity), userId]
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: {
                id: userId,
                firstName,
                lastName,
                role
            }
        });

    } catch (error) {
        console.error('❌ Update Profile Error:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

// Complete Session & Adjust Credits Controller
exports.completeSession = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { sessionType, partnerName, skillName } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required in headers.' });
        }

        if (!sessionType || !partnerName || !skillName) {
            return res.status(400).json({ success: false, message: 'sessionType, partnerName, and skillName are required.' });
        }

        // Fetch user from DB
        const user = await dbQuery.get('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Parse and update recent activity log
        let recentActivity = [];
        try {
            recentActivity = user.recent_activity ? JSON.parse(user.recent_activity) : [];
        } catch (e) {
            recentActivity = [];
        }

        const textMsg = sessionType === 'teach' 
            ? `Taught "${skillName}" to ${partnerName}`
            : `Learned "${skillName}" from ${partnerName}`;

        recentActivity.unshift({
            time: "Just now",
            icon: "✅",
            type: sessionType === 'teach' ? "teach" : "session",
            text: textMsg
        });

        if (recentActivity.length > 8) {
            recentActivity = recentActivity.slice(0, 8);
        }

        // Calculate credit adjustment
        const creditChange = sessionType === 'teach' ? 1 : -1;

        // Perform UPDATE SQL
        await dbQuery.run(
            `UPDATE users 
             SET credits_earned = credits_earned + ?, recent_activity = ?
             WHERE id = ?`,
            [creditChange, JSON.stringify(recentActivity), userId]
        );

        // Fetch updated user to return fresh credit status
        const updatedUser = await dbQuery.get('SELECT credits_earned FROM users WHERE id = ?', [userId]);

        return res.status(200).json({
            success: true,
            message: 'Session completed successfully! Credits updated.',
            creditsEarned: updatedUser.credits_earned
        });

    } catch (error) {
        console.error('❌ Complete Session Error:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

// Search Profiles & Auto Seed Mock Users Controller
exports.searchProfiles = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 0;
        const searchVal = req.query.query ? req.query.query.trim().toLowerCase() : "";

        // 1. Check if database has mock users seeded. If not, seed it.
        const mockCheck = await dbQuery.get("SELECT * FROM users WHERE username = 'sarahj'");
        if (!mockCheck) {
            const mockUsers = [
                {
                    first_name: "Sarah", last_name: "Jenkins", username: "sarahj", email: "sarah@example.com", role: "both", password: "mockpassword",
                    bio: "UI/UX Designer with 4 years of experience. Loving to teach design principles, wireframing, and Figma secrets.",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "UI/UX Design,Figma,Wireframing", skills_learn: "JavaScript,Python",
                    credits_earned: 120, skills_taught_count: 45, hours_learned: 78
                },
                {
                    first_name: "Mateo", last_name: "Silva", username: "mateo_codes", email: "mateo@example.com", role: "both", password: "mockpassword",
                    bio: "Senior backend developer specializing in Python, SQL, and database optimizations. Let's trade code queries!",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "Python,SQLite,PostgreSQL", skills_learn: "Acoustic Guitar,French",
                    credits_earned: 110, skills_taught_count: 32, hours_learned: 54
                },
                {
                    first_name: "Emily", last_name: "Chen", username: "emily_c", email: "emily@example.com", role: "both", password: "mockpassword",
                    bio: "Native Mandarin speaker, professional translator, and language trainer. Interactive conversational tutor.",
                    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "Mandarin,Chinese Culture", skills_learn: "React,CSS Transitions",
                    credits_earned: 130, skills_taught_count: 50, hours_learned: 85
                },
                {
                    first_name: "Carlos", last_name: "Mendez", username: "carlos_music", email: "carlos@example.com", role: "both", password: "mockpassword",
                    bio: "Guitarist and composer. Teaching acoustic, electric, and basic music theory classes. All skill levels welcome!",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "Acoustic Guitar,Music Theory", skills_learn: "Web Design,SEO Basics",
                    credits_earned: 95, skills_taught_count: 20, hours_learned: 40
                },
                {
                    first_name: "Jessica", last_name: "Taylor", username: "jess_biz", email: "jessica@example.com", role: "both", password: "mockpassword",
                    bio: "Digital marketer and business strategist. Learn how to launch ads, write copy, and grow social media channels.",
                    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "Digital Marketing,SEO,Copywriting", skills_learn: "JavaScript,HTML/CSS",
                    credits_earned: 105, skills_taught_count: 28, hours_learned: 60
                },
                {
                    first_name: "Arjun", last_name: "Mehta", username: "arjun_dev", email: "arjun@example.com", role: "both", password: "mockpassword",
                    bio: "Full stack engineer. I teach React development, node JS setups, and API building integrations.",
                    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&h=120&q=80",
                    skills_teach: "React,NodeJS,Web Development", skills_learn: "Figma,Digital Marketing",
                    credits_earned: 115, skills_taught_count: 38, hours_learned: 72
                }
            ];

            for (const u of mockUsers) {
                await dbQuery.run(
                    `INSERT INTO users (first_name, last_name, username, email, role, password, bio, avatar, skills_teach, skills_learn, credits_earned, skills_taught_count, hours_learned)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [u.first_name, u.last_name, u.username, u.email, u.role, u.password, u.bio, u.avatar, u.skills_teach, u.skills_learn, u.credits_earned, u.skills_taught_count, u.hours_learned]
                ).catch(err => console.log('Mock insert error:', err.message));
            }
        }

        // 2. Fetch matches from database (excluding active searcher)
        let querySql = `SELECT * FROM users WHERE id != ?`;
        let params = [userId];

        if (searchVal) {
            querySql += ` AND (LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(username) LIKE ? OR LOWER(skills_teach) LIKE ? OR LOWER(skills_learn) LIKE ?)`;
            const wildcard = `%${searchVal}%`;
            params.push(wildcard, wildcard, wildcard, wildcard, wildcard);
        }

        const users = await dbQuery.all(querySql, params);

        // Map database fields to front-end keys
        const mappedUsers = users.map(u => ({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            username: u.username,
            avatar: u.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
            bio: u.bio || "",
            skillsTeach: u.skills_teach ? u.skills_teach.split(",") : [],
            skillsLearn: u.skills_learn ? u.skills_learn.split(",") : [],
            bestMatch: u.id % 2 === 1
        }));

        return res.status(200).json({
            success: true,
            profiles: mappedUsers
        });

    } catch (error) {
        console.error('❌ Search Profiles Error:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

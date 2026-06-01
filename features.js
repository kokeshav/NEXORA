/* ==========================================================================
   COPA PRO-TECH: ENTERPRISE JAVASCRIPT FEATURES (v2.0)
   ========================================================================== */
console.log("✅ Pro-Tech Enterprise Features Loaded Successfully!");

/* --------------------------------------------------------------------------
   1. TOAST NOTIFICATION SYSTEM (Replacement for boring alerts)
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    
    // Toast UI Design
    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px; background:var(--color-surface-1, #0d1e3a); 
             border-left:4px solid ${type === 'success' ? '#00d97e' : '#3d8ef0'}; 
             padding:16px 24px; border-radius:8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
             color:white; font-family: sans-serif; font-weight:600; z-index: 99999;">
            <span style="font-size:1.2rem;">${icons[type]}</span>
            <span>${message}</span>
        </div>
    `;

    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.transform = 'translateX(120%)'; 
    toast.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    toast.style.zIndex = '99999';

    document.body.appendChild(toast);

    // Slide in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Slide out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

/* --------------------------------------------------------------------------
   2. PRINT SCORECARD FUNCTIONALITY
   -------------------------------------------------------------------------- */
function printProfessionalScorecard() {
    let percentage = document.getElementById('final-percentage')?.innerText || '0%';
    let correct = document.getElementById('stat-correct-count')?.innerText || '0';
    let wrong = document.getElementById('stat-wrong-count')?.innerText || '0';
    let skipped = document.getElementById('stat-skipped-count')?.innerText || '0';
    let user = window.activeUser || localStorage.getItem('currentUser') || 'Student';
    
    const printContent = `
        <html>
        <head>
            <title>ITI COPA Result Card</title>
            <style>
                body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                .header { text-align: center; border-bottom: 3px solid #3d8ef0; padding-bottom: 20px; margin-bottom: 30px; }
                .score-box { text-align: center; font-size: 50px; font-weight: bold; color: ${parseInt(percentage) >= 40 ? '#00d97e' : '#ff4d6d'}; margin: 30px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 18px; }
                th, td { border: 1px solid #ddd; padding: 15px; text-align: left; }
                th { background-color: #f8fafc; color: #0f172a; }
                .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #888; }
            </style>
        </head>
        <body>
            <div class="header">
                <h2>GOVERNMENT ITI (COPA) - E-LEARNING PORTAL</h2>
                <p>Official Candidate Assessment Report</p>
            </div>
            
            <p><strong>Candidate Name:</strong> ${user.toUpperCase()}</p>
            <p><strong>Date & Time:</strong> ${new Date().toLocaleString()}</p>
            
            <div class="score-box">${percentage}</div>
            
            <table>
                <tr><th>Parameter</th><th>Count</th></tr>
                <tr><td>Total Questions Attempted</td><td>${parseInt(correct) + parseInt(wrong) + parseInt(skipped)}</td></tr>
                <tr><td style="color: green; font-weight: bold;">Correct Answers (सही)</td><td>${correct}</td></tr>
                <tr><td style="color: red; font-weight: bold;">Wrong Answers (गलत)</td><td>${wrong}</td></tr>
                <tr><td style="color: orange;">Skipped (छोड़े गए)</td><td>${skipped}</td></tr>
            </table>

            <div class="footer">
                <p>This is a system-generated report. System Architect: COPA Pro-Tech LMS</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => { 
        printWindow.print(); 
    }, 500);
}

/* --------------------------------------------------------------------------
   3. AUTO-INJECT PRINT BUTTON TO SCORECARD
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // This automatically finds the scorecard area and adds the Print Button
    setTimeout(() => {
        const scorecardWrapper = document.getElementById('scorecard-wrapper');
        if(scorecardWrapper) {
            const printBtn = document.createElement('button');
            printBtn.className = 'btn-outline';
            printBtn.innerHTML = '🖨️ Print Result Card';
            printBtn.style.marginTop = '20px';
            printBtn.style.marginLeft = '10px';
            printBtn.onclick = printProfessionalScorecard;
            
            // Find the area where buttons are (usually near Reattempt)
            const buttonArea = scorecardWrapper.querySelector('.scorecard-header') || scorecardWrapper;
            buttonArea.appendChild(printBtn);
        }
    }, 1000);
});

/* --------------------------------------------------------------------------
   4. LOCAL STORAGE HISTORY TRACKER (Analytics Stub)
   -------------------------------------------------------------------------- */
function saveTestHistory(chapterId, percentageScore) {
    let user = window.activeUser || 'Guest';
    const historyKey = 'COPA_HISTORY_' + user;
    let history = JSON.parse(localStorage.getItem(historyKey)) || [];
    
    history.push({
        chapter: chapterId,
        score: percentageScore,
        date: new Date().toISOString()
    });
    
    localStorage.setItem(historyKey, JSON.stringify(history));
    console.log("Progress Saved to LocalStorage!");
}
/* --------------------------------------------------------------------------
   5. LOGOUT & HISTORY DASHBOARD (Auto-Injected UI - No HTML changes needed)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    // 1.5 सेकंड का वेट ताकि मेन HTML लोड हो जाए
    setTimeout(() => {
        const dashboardWrapper = document.getElementById('dashboard-wrapper');
        if(!dashboardWrapper) return;

        // 1. टॉप कंट्रोल पैनल बनाना (बटन्स के लिए)
        const controlPanel = document.createElement('div');
        controlPanel.style.display = 'flex';
        controlPanel.style.gap = '15px';
        controlPanel.style.justifyContent = 'center';
        controlPanel.style.marginTop = '20px';
        controlPanel.style.marginBottom = '30px';

        // 2. लॉगआउट (Logout) बटन बनाना
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn-outline';
        logoutBtn.innerHTML = '🚪 Logout';
        logoutBtn.style.borderColor = '#ff4d6d';
        logoutBtn.style.color = '#ff4d6d';
        logoutBtn.style.boxShadow = '0 4px 15px rgba(255, 77, 109, 0.2)';
        
        logoutBtn.onclick = () => {
            showToast("Logging out... Please wait.", "warning");
            setTimeout(() => {
                localStorage.removeItem('currentUser'); // सेशन क्लियर
                window.activeUser = "";
                location.reload(); // पेज रिफ्रेश कर देगा (लॉगिन स्क्रीन आ जाएगी)
            }, 1000);
        };

        // 3. हिस्ट्री और एनालिटिक्स बटन बनाना
        const historyBtn = document.createElement('button');
        historyBtn.className = 'btn-main';
        historyBtn.innerHTML = '📊 My Analytics / History';
        historyBtn.onclick = showHistoryModal;

        controlPanel.appendChild(historyBtn);
        controlPanel.appendChild(logoutBtn);

        // डैशबोर्ड में सबसे ऊपर ये बटन्स घुसा देना
        dashboardWrapper.insertBefore(controlPanel, dashboardWrapper.children[1]);

        // 4. हिस्ट्री दिखाने के लिए प्रोफेशनल पॉप-अप (Modal) बनाना
        const modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.top = '0'; modal.style.left = '0'; 
        modal.style.width = '100%'; modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(4, 13, 26, 0.85)'; // Dark blur
        modal.style.backdropFilter = 'blur(8px)';
        modal.style.zIndex = '100000';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        modal.innerHTML = `
            <div style="background: var(--grad-surface, #0d1e3a); padding: 35px; border-radius: 16px; width: 90%; max-width: 650px; max-height: 80vh; overflow-y: auto; border: 1px solid #3d8ef0; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1f3a72; padding-bottom:15px; margin-bottom: 20px;">
                    <h2 style="color: white; margin:0; font-family:var(--font-heading);">📊 My Performance History</h2>
                    <span style="cursor:pointer; font-size:24px; color:#ff4d6d;" onclick="document.getElementById('history-modal').style.display='none'">✖</span>
                </div>
                <div id="history-content" style="color: white; margin-bottom: 30px;"></div>
            </div>
        `;
        document.body.appendChild(modal);

    }, 1500);
});

/* --------------------------------------------------------------------------
   6. हिस्ट्री पॉप-अप का लॉजिक (Data Fetcher)
   -------------------------------------------------------------------------- */
function showHistoryModal() {
    const user = window.activeUser || localStorage.getItem('currentUser') || 'Student';
    const historyKey = 'COPA_HISTORY_' + user;
    const history = JSON.parse(localStorage.getItem(historyKey)) || [];
    
    const contentDiv = document.getElementById('history-content');
    
    if(history.length === 0) {
        contentDiv.innerHTML = `
            <div style="text-align:center; padding: 40px 0;">
                <h1 style="font-size: 50px; margin:0;">📭</h1>
                <h3 style="color:#94a3b8;">No test history found yet.</h3>
                <p style="color:#64748b;">Go attempt a chapter to see your analytics here!</p>
            </div>`;
    } else {
        // Table Design
        let tableHTML = '<table style="width:100%; border-collapse: collapse; text-align: left; font-size:16px;">';
        tableHTML += `
            <tr style="background: rgba(61, 142, 240, 0.1); color: #3d8ef0;">
                <th style="padding:15px; border-radius:8px 0 0 8px;">Date</th>
                <th style="padding:15px;">Chapter</th>
                <th style="padding:15px; border-radius:0 8px 8px 0;">Score</th>
            </tr>`;
        
        // पुरानी हिस्ट्री को उल्टा करके (Newest First) दिखाएं
        history.reverse().forEach((record, index) => {
            let d = new Date(record.date).toLocaleString();
            let scoreColor = parseInt(record.score) >= 40 ? '#00d97e' : '#ff4d6d'; // 40% से ऊपर हरा, नीचे लाल
            
            tableHTML += `
                <tr style="border-bottom: 1px solid #1f3a72; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:15px;">${d}</td>
                    <td style="padding:15px; font-weight:bold;">Chapter ${record.chapter}</td>
                    <td style="padding:15px; color:${scoreColor}; font-weight:bold; font-size:18px;">${record.score}</td>
                </tr>`;
        });
        tableHTML += '</table>';
        contentDiv.innerHTML = tableHTML;
    }
    
    // पॉप-अप को शो करें (Flex animation)
    const modal = document.getElementById('history-modal');
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '1';
    }, 10);
}

/* --------------------------------------------------------------------------
   7. AUTO-SAVE HISTORY (स्मार्ट ऑटो सेवर)
   -------------------------------------------------------------------------- */
// यह कोड ऑटोमैटिक टेस्ट सबमिट होने पर हिस्ट्री सेव करेगा
document.addEventListener('click', (e) => {
    if(e.target && e.target.innerText && e.target.innerText.includes('Submit Test')) {
        setTimeout(() => {
            let percentage = document.getElementById('final-percentage')?.innerText || '0%';
            if(percentage !== '0%' && window.activeChapterId) {
                saveTestHistory(window.activeChapterId, percentage);
            }
        }, 500); // रिजल्ट कैलकुलेट होने का आधा सेकंड वेट
    }
});
/* ==========================================================================
   COPA PRO-TECH: ENTERPRISE CORE ENGINE (v3.0 - GOOGLE LEVEL ARCHITECTURE)
   Architecture: Object-Oriented, Singleton Pattern, Secure State Management
   ========================================================================== */

/**
 * 1. SECURITY & ENCRYPTION MODULE
 * Enterprise apps never store raw data. This module encodes/decodes payload.
 */
class COPASecurity {
    static encodePayload(data) {
        try {
            // Converts JSON to Base64 to prevent normal users from tampering with local storage scores
            return btoa(encodeURIComponent(JSON.stringify(data)));
        } catch (e) {
            console.error("Encryption Failure:", e);
            return null;
        }
    }

    static decodePayload(encodedString) {
        try {
            return JSON.parse(decodeURIComponent(atob(encodedString)));
        } catch (e) {
            return null; // Return null if tampering is detected
        }
    }
}

/**
 * 2. CENTRALIZED STORAGE ENGINE (The LMS Database)
 * Acts as a mock backend server. All read/write operations must pass through here.
 */
class COPAStorageEngine {
    constructor() {
        this.KEYS = {
            HISTORY: 'COPA_ENT_HISTORY',
            DRAFT: 'COPA_ENT_DRAFT',
            SETTINGS: 'COPA_ENT_SETTINGS',
            LEADERBOARD: 'COPA_ENT_LEADERBOARD'
        };
    }

    // --- Performance History API ---
    saveAttempt(userEmail, chapterId, resultData) {
        let allHistory = this.getAllHistory();
        if (!allHistory[userEmail]) allHistory[userEmail] = {};
        if (!allHistory[userEmail][chapterId]) allHistory[userEmail][chapterId] = [];

        const attemptRecord = {
            id: 'ATT_' + Date.now(),
            score: resultData.percentage,
            correct: resultData.correct,
            wrong: resultData.wrong,
            skipped: resultData.skipped,
            timestamp: new Date().toISOString()
        };

        allHistory[userEmail][chapterId].push(attemptRecord);
        localStorage.setItem(this.KEYS.HISTORY, COPASecurity.encodePayload(allHistory));
        this.updateGlobalLeaderboard(userEmail, chapterId, resultData.percentage);
    }

    getHistoryByUser(userEmail) {
        const allHistory = this.getAllHistory();
        return allHistory[userEmail] || {};
    }

    getAllHistory() {
        const raw = localStorage.getItem(this.KEYS.HISTORY);
        return raw ? COPASecurity.decodePayload(raw) || {} : {};
    }

    // --- Save & Resume (Draft) API ---
    saveDraftState(userEmail, chapterId, stateObject) {
        const draftKey = `${this.KEYS.DRAFT}_${userEmail}_${chapterId}`;
        const payload = {
            state: stateObject,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem(draftKey, COPASecurity.encodePayload(payload));
    }

    getDraftState(userEmail, chapterId) {
        const draftKey = `${this.KEYS.DRAFT}_${userEmail}_${chapterId}`;
        const raw = localStorage.getItem(draftKey);
        return raw ? COPASecurity.decodePayload(raw) : null;
    }

    clearDraftState(userEmail, chapterId) {
        const draftKey = `${this.KEYS.DRAFT}_${userEmail}_${chapterId}`;
        localStorage.removeItem(draftKey);
    }

    // --- Global Leaderboard API ---
    updateGlobalLeaderboard(userEmail, chapterId, percentage) {
        let lb = this.getLeaderboard();
        if (!lb[chapterId]) lb[chapterId] = [];

        const scoreVal = parseFloat(percentage);
        const existingIndex = lb[chapterId].findIndex(e => e.user === userEmail);

        if (existingIndex > -1) {
            // Update only if new score is higher
            if (scoreVal > lb[chapterId][existingIndex].score) {
                lb[chapterId][existingIndex].score = scoreVal;
                lb[chapterId][existingIndex].date = new Date().toISOString();
            }
        } else {
            lb[chapterId].push({ user: userEmail, score: scoreVal, date: new Date().toISOString() });
        }

        // Sort descending
        lb[chapterId].sort((a, b) => b.score - a.score);
        localStorage.setItem(this.KEYS.LEADERBOARD, COPASecurity.encodePayload(lb));
    }

    getLeaderboard() {
        const raw = localStorage.getItem(this.KEYS.LEADERBOARD);
        return raw ? COPASecurity.decodePayload(raw) || {} : {};
    }
}

// Initialize Singleton Database Instance
const AppDB = new COPAStorageEngine();

/**
 * 3. ADVANCED ANALYTICS VISUALIZER (Google-Grade Dashboards)
 * Uses dynamic rendering to build Chart.js instances without breaking DOM.
 */
class COPAAnalytics {
    static async loadChartLibrary() {
        if (window.Chart) return Promise.resolve();
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    static async renderDashboard(containerId, userEmail) {
        await this.loadChartLibrary();
        
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 20px;">
                <div style="background: var(--color-surface-1, #0d1e3a); padding: 20px; border-radius: 16px; border: 1px solid var(--color-border, #1f3a72); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 15px;">📈 Growth Timeline</h3>
                    <canvas id="chart-timeline" height="200"></canvas>
                </div>
                <div style="background: var(--color-surface-1, #0d1e3a); padding: 20px; border-radius: 16px; border: 1px solid var(--color-border, #1f3a72); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 15px;">🎯 Accuracy Radar</h3>
                    <canvas id="chart-accuracy" height="200"></canvas>
                </div>
            </div>
            <div style="background: var(--color-surface-1, #0d1e3a); padding: 20px; border-radius: 16px; border: 1px solid var(--color-border, #1f3a72); box-shadow: 0 10px 30px rgba(0,0,0,0.5); margin-top: 24px;">
                <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 15px;">🏆 Chapter-wise Mastery</h3>
                <canvas id="chart-mastery" height="150"></canvas>
            </div>
        `;

        this.drawCharts(userEmail);
    }

    static drawCharts(userEmail) {
        const history = AppDB.getHistoryByUser(userEmail);
        const allAttempts = [];
        const bestScores = {};

        // Aggregate Data
        Object.entries(history).forEach(([chapterId, attempts]) => {
            let maxScore = 0;
            attempts.forEach(a => {
                const scoreNum = parseFloat(a.score);
                allAttempts.push({ chapterId, ...a, scoreNum });
                if (scoreNum > maxScore) maxScore = scoreNum;
            });
            bestScores[chapterId] = maxScore;
        });

        // Sort attempts chronologically
        allAttempts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 1. TIMELINE CHART (Line)
        const ctxTimeline = document.getElementById('chart-timeline').getContext('2d');
        new Chart(ctxTimeline, {
            type: 'line',
            data: {
                labels: allAttempts.slice(-15).map(a => `Ch ${a.chapterId}`), // Last 15 attempts
                datasets: [{
                    label: 'Score %',
                    data: allAttempts.slice(-15).map(a => a.scoreNum),
                    borderColor: '#3d8ef0',
                    backgroundColor: 'rgba(61, 142, 240, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#00d97e',
                    pointRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
        });

        // 2. ACCURACY CHART (Doughnut)
        let tCorrect = 0, tWrong = 0, tSkipped = 0;
        allAttempts.forEach(a => { tCorrect += parseInt(a.correct); tWrong += parseInt(a.wrong); tSkipped += parseInt(a.skipped); });
        
        const ctxAccuracy = document.getElementById('chart-accuracy').getContext('2d');
        new Chart(ctxAccuracy, {
            type: 'doughnut',
            data: {
                labels: ['Correct', 'Wrong', 'Skipped'],
                datasets: [{
                    data: [tCorrect, tWrong, tSkipped],
                    backgroundColor: ['#00d97e', '#ff4d6d', '#ffb700'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { color: '#fff' } } } }
        });

        // 3. MASTERY CHART (Bar)
        const chapterLabels = Object.keys(bestScores).map(id => `Ch ${id}`);
        const masteryData = Object.values(bestScores);
        
        const ctxMastery = document.getElementById('chart-mastery').getContext('2d');
        new Chart(ctxMastery, {
            type: 'bar',
            data: {
                labels: chapterLabels,
                datasets: [{
                    label: 'Highest Score',
                    data: masteryData,
                    backgroundColor: masteryData.map(s => s >= 80 ? 'rgba(0, 217, 126, 0.8)' : (s >= 50 ? 'rgba(61, 142, 240, 0.8)' : 'rgba(255, 77, 109, 0.8)')),
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { color: '#94a3b8' } }, x: { ticks: { color: '#94a3b8' } } } }
        });
    }
}

/**
 * 4. SAVE & RESUME CONTROLLER (State Manager)
 * Automatically tracks test progress every 10 seconds.
 */
class COPASaveResume {
    constructor() {
        this.saveInterval = null;
        this.initAutoSave();
    }

    initAutoSave() {
        // Runs entirely in the background, independently
        this.saveInterval = setInterval(() => {
            const quizWrapper = document.getElementById('quiz-wrapper');
            // Only save if quiz is actively displayed
            if (quizWrapper && quizWrapper.style.display !== 'none' && window.activeChapterId && window.activeUser) {
                this.captureAndSaveState();
            }
        }, 10000); // Save every 10 seconds
    }

    captureAndSaveState() {
        // We safely access global variables without overriding them
        if (typeof userResponses === 'undefined' || typeof currentQIndex === 'undefined') return;
        
        const timerElement = document.getElementById('timer');
        const currentState = {
            qIndex: currentQIndex,
            responses: userResponses,
            timeRemainingText: timerElement ? timerElement.innerText : "00:00"
        };
        
        AppDB.saveDraftState(window.activeUser, window.activeChapterId, currentState);
        
        // Silent UX indicator (little green dot in corner)
        this.showSilentSaveIndicator();
    }

    showSilentSaveIndicator() {
        let indicator = document.getElementById('auto-save-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'auto-save-indicator';
            indicator.style.cssText = "position:fixed; bottom:15px; left:15px; background:rgba(0,0,0,0.6); color:#00d97e; padding:5px 12px; border-radius:20px; font-size:12px; font-family:var(--font-mono); z-index:9999; display:flex; align-items:center; gap:6px; opacity:0; transition:opacity 0.3s;";
            indicator.innerHTML = `<span style="width:8px; height:8px; background:#00d97e; border-radius:50%; box-shadow:0 0 8px #00d97e;"></span> Auto-saved`;
            document.body.appendChild(indicator);
        }
        indicator.style.opacity = '1';
        setTimeout(() => indicator.style.opacity = '0', 2000);
    }

    checkForDraft(userEmail, chapterId, onResumeCallback, onStartFreshCallback) {
        const draft = AppDB.getDraftState(userEmail, chapterId);
        if (!draft) {
            onStartFreshCallback();
            return;
        }

        // Create Professional Prompt Modal
        const timeAgo = Math.round((new Date() - new Date(draft.savedAt)) / 60000); // in minutes
        
        const modal = document.createElement('div');
        modal.style.cssText = "position:fixed; inset:0; background:rgba(4,13,26,0.9); backdrop-filter:blur(8px); z-index:100000; display:flex; align-items:center; justify-content:center;";
        modal.innerHTML = `
            <div style="background:var(--color-surface-1, #0d1e3a); padding:40px; border-radius:20px; max-width:500px; text-align:center; border:1px solid var(--accent-primary, #3d8ef0); box-shadow:0 20px 60px rgba(0,0,0,0.6);">
                <div style="font-size:50px; margin-bottom:20px;">📂</div>
                <h2 style="color:white; font-family:var(--font-heading); margin-bottom:15px;">Saved Progress Found!</h2>
                <p style="color:#94a3b8; font-size:16px; margin-bottom:30px;">You left this chapter <b>${timeAgo} minutes ago</b>. Do you want to resume exactly where you left off, or start fresh?</p>
                <div style="display:flex; gap:15px; justify-content:center;">
                    <button id="btn-fresh" style="padding:12px 24px; background:transparent; border:2px solid #64748b; color:#cbd5e1; border-radius:10px; cursor:pointer; font-weight:bold;">🔄 Start Fresh</button>
                    <button id="btn-resume" style="padding:12px 24px; background:var(--accent-primary, #3d8ef0); border:none; color:white; border-radius:10px; cursor:pointer; font-weight:bold; box-shadow:0 8px 24px rgba(61,142,240,0.4);">▶ Resume Quiz</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-fresh').onclick = () => {
            AppDB.clearDraftState(userEmail, chapterId);
            modal.remove();
            onStartFreshCallback();
        };

        document.getElementById('btn-resume').onclick = () => {
            modal.remove();
            onResumeCallback(draft.state);
        };
    }
}

// Initialize Save & Resume Manager
const StateManager = new COPASaveResume();

/**
 * 5. EVENT ORCHESTRATOR (The Controller)
 * Listens to app events and triggers the DB/Analytics logic without touching original HTML code.
 */
class COPAOrchestrator {
    constructor() {
        this.setupSubmissionListener();
        this.setupAnalyticsIntegration();
    }

    setupSubmissionListener() {
        // Dynamically attaches to the Submit logic to save data securely
        document.addEventListener('click', (e) => {
            if (e.target && e.target.innerText && e.target.innerText.includes('Submit Test')) {
                // Allow original calculation to finish, then capture
                setTimeout(() => {
                    const percentage = document.getElementById('final-percentage')?.innerText || '0%';
                    const correct = document.getElementById('stat-correct-count')?.innerText || '0';
                    const wrong = document.getElementById('stat-wrong-count')?.innerText || '0';
                    const skipped = document.getElementById('stat-skipped-count')?.innerText || '0';
                    
                    if (window.activeUser && window.activeChapterId) {
                        AppDB.saveAttempt(window.activeUser, window.activeChapterId, {
                            percentage: percentage.replace('%',''),
                            correct, wrong, skipped
                        });
                        // Clear draft on successful submission
                        AppDB.clearDraftState(window.activeUser, window.activeChapterId);
                    }
                }, 800);
            }
        });
    }

    setupAnalyticsIntegration() {
        // Replaces the old basic history content with our new Advanced Dashboard
        document.addEventListener('click', (e) => {
            if (e.target && e.target.innerText && e.target.innerText.includes('My Analytics')) {
                setTimeout(() => {
                    const contentDiv = document.getElementById('history-content');
                    if (contentDiv && window.activeUser) {
                        // Clear old table HTML
                        contentDiv.innerHTML = '';
                        // Render Google-grade Charts
                        COPAAnalytics.renderDashboard('history-content', window.activeUser);
                    }
                }, 100);
            }
        });
    }
}

// Start the Orchestrator
new COPAOrchestrator();

console.log("🚀 GOOGLE-GRADE ENTERPRISE ENGINE INITIALIZED.");

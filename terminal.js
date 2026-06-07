/**
 * Piyush Singh Portfolio - Cyber Terminal and HUD Dashboard Logic
 * Synthesizes Web Audio API sound effects, handles shell emulation,
 * manages the background Matrix digital rain canvas, and updates telemetry.
 */

// --- Audio Synth System ---
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

const Sound = {
    muted: true,
    
    playClick() {
        if (this.muted) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'triangle';
            // Slight pitch variation for realism
            osc.frequency.setValueAtTime(900 + Math.random() * 300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.02);
            
            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.025);
        } catch (e) {
            console.warn("Audio Context Error", e);
        }
    },
    
    playSuccess() {
        if (this.muted) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5
            
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    },
    
    playError() {
        if (this.muted) return;
        try {
            const ctx = getAudioContext();
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc1.frequency.setValueAtTime(130, ctx.currentTime);
            osc2.frequency.setValueAtTime(133, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            
            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 0.25);
            osc2.stop(ctx.currentTime + 0.25);
        } catch (e) {}
    },
    
    playBoot() {
        if (this.muted) return;
        try {
            const ctx = getAudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.6);
            
            gain.gain.setValueAtTime(0.02, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.7);
        } catch (e) {}
    }
};

// --- Matrix Digital Rain Canvas ---
let matrixCanvas = null;
let matrixCtx = null;
let matrixInterval = null;
let matrixActive = false;

function initMatrix() {
    matrixCanvas = document.getElementById('matrix-canvas');
    if (!matrixCanvas) return;
    matrixCtx = matrixCanvas.getContext('2d');
    
    window.addEventListener('resize', resizeMatrixCanvas);
    resizeMatrixCanvas();
}

function resizeMatrixCanvas() {
    if (!matrixCanvas) return;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
}

function getActiveThemeColor() {
    if (document.documentElement.classList.contains('theme-cyan')) return '#00f0ff';
    if (document.documentElement.classList.contains('theme-red')) return '#ff3e3e';
    if (document.documentElement.classList.contains('theme-amber')) return '#ffb700';
    return '#00ff9d'; // Default green
}

function startMatrix() {
    if (!matrixCanvas || matrixActive) return;
    matrixActive = true;
    matrixCanvas.style.opacity = '0.07';
    
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEF';
    const alphabet = katakana.split('');
    const fontSize = 14;
    const columns = Math.ceil(matrixCanvas.width / fontSize);
    const rainDrops = Array(columns).fill(1);
    
    matrixInterval = setInterval(() => {
        matrixCtx.fillStyle = 'rgba(5, 5, 5, 0.08)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        // Match active theme accent color dynamically
        const activeColor = getActiveThemeColor();
        matrixCtx.fillStyle = activeColor;
        matrixCtx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            matrixCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            
            if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }, 35);
}

function stopMatrix() {
    if (!matrixActive) return;
    matrixActive = false;
    clearInterval(matrixInterval);
    if (matrixCanvas) {
        matrixCanvas.style.opacity = '0';
        matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    }
}

function toggleMatrix() {
    if (matrixActive) {
        stopMatrix();
        return false;
    } else {
        startMatrix();
        return true;
    }
}

// --- Terminal Simulator ---
const COMMANDS = {
    help: 'List available shell commands.',
    about: 'Print security profile summary.',
    skills: 'Display technical skills matrix.',
    experience: 'Show security employment logs.',
    projects: 'List operational code projects.',
    contact: 'Provide communications channels.',
    neofetch: 'Show security hardware & environment info.',
    scan: 'Execute a system/port vulnerability scanner.',
    hack: 'Initiate a simulated penetration exploit sequence.',
    matrix: 'Toggle the digital rain screen overlay.',
    theme: 'Change UI color accent [green | cyan | red | amber].',
    photos: 'Open the CCTV operations photo slideshow.',
    clear: 'Clear terminal screen log.'
};

let commandHistory = [];
let historyIndex = -1;

function initTerminal() {
    const termInput = document.getElementById('terminal-input');
    const termForm = document.getElementById('terminal-form');
    const termHistory = document.getElementById('terminal-history');
    
    if (!termInput || !termForm || !termHistory) return;
    
    // Auto focus terminal input on click inside terminal container
    document.getElementById('terminal-view').addEventListener('click', () => {
        termInput.focus();
    });
    
    // Key event listeners
    termInput.addEventListener('keydown', (e) => {
        Sound.playClick();
        
        if (e.key === 'Enter') {
            // Handled by form submit
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete(termInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) historyIndex = commandHistory.length;
                historyIndex = Math.max(0, historyIndex - 1);
                termInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex !== -1) {
                    historyIndex++;
                    if (historyIndex >= commandHistory.length) {
                        historyIndex = -1;
                        termInput.value = '';
                    } else {
                        termInput.value = commandHistory[historyIndex];
                    }
                }
            }
        }
    });
    
    termForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawInput = termInput.value;
        termInput.value = '';
        historyIndex = -1;
        
        if (rawInput.trim() === '') return;
        
        commandHistory.push(rawInput);
        executeCommand(rawInput, termHistory);
    });
    
    // Welcome message
    printOutput('SYSTEM SHELL v2.10 - OPERATIONAL', 'text-success', termHistory);
    printOutput('Type "help" for a list of available command protocols.', 'text-muted small', termHistory);
    printOutput('', '', termHistory);
}

function handleAutocomplete(inputEl) {
    const currentVal = inputEl.value.trim().toLowerCase();
    if (currentVal === '') return;
    
    const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(currentVal));
    if (matches.length === 1) {
        inputEl.value = matches[0];
    } else if (matches.length > 1) {
        // Just print them out or suggest
    }
}

function printOutput(htmlContent, className, historyEl, delay = 0) {
    const p = document.createElement('div');
    p.className = `terminal-line ${className || ''}`;
    p.innerHTML = htmlContent;
    historyEl.appendChild(p);
    
    // Scroll container to bottom
    const scrollContainer = document.getElementById('terminal-body');
    if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
}

function executeCommand(cmdString, historyEl) {
    const parts = cmdString.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();
    
    // Log command entry
    printOutput(`<span class="prompt-arrow">&gt;</span> <span class="cmd-entered">${escapeHtml(cmdString)}</span>`, 'command-echo-line', historyEl);
    
    if (!(cmd in COMMANDS)) {
        printOutput(`shell: command not found: ${escapeHtml(cmd)}. Type "help" for protocols.`, 'text-danger', historyEl);
        Sound.playError();
        return;
    }
    
    switch (cmd) {
        case 'help':
            Sound.playSuccess();
            printOutput('AVAILABLE SECURITY PROTOCOLS:', 'text-cyber-green font-bold', historyEl);
            Object.entries(COMMANDS).forEach(([name, desc]) => {
                const spaces = '&nbsp;'.repeat(12 - name.length);
                printOutput(`<span class="text-cyber-cyan">${name}</span>${spaces}- ${desc}`, 'small-term', historyEl);
            });
            break;
            
        case 'about':
            Sound.playSuccess();
            printOutput('OPERATOR PROFILE: PIYUSH SINGH', 'text-cyber-green font-bold', historyEl);
            printOutput('====================================', 'text-muted', historyEl);
            printOutput('An Application Security Engineer & Penetration Tester focusing on Securing Applications, Threat Modeling, Red Teaming, and automating DevSecOps.', 'text-light', historyEl);
            printOutput('Experienced in critical infrastructure vulnerability assessments (onsite SCADA), Web, API, and Mobile (iOS/Android) security assessments.', 'text-light', historyEl);
            break;
            
        case 'skills':
            Sound.playSuccess();
            printOutput('SECURITY SKILLS INDEX:', 'text-cyber-green font-bold', historyEl);
            printOutput('====================================', 'text-muted', historyEl);
            
            const list = [
                { s: 'AppSec Testing (Web/API/Mobile)', l: 95 },
                { s: 'Infrastructure & Active Directory', l: 88 },
                { s: 'DevSecOps & Security Pipelines', l: 85 },
                { s: 'Python & Bash Security Scripting', l: 82 },
                { s: 'Wireless & Hardware Assessments', l: 70 }
            ];
            
            list.forEach(item => {
                const fillChars = Math.round(item.l / 5);
                const bar = '='.repeat(fillChars) + '-'.repeat(20 - fillChars);
                const spaces = '&nbsp;'.repeat(32 - item.s.length);
                printOutput(`<span class="text-light">${item.s}</span>${spaces}<span class="text-cyber-cyan">[${bar}]</span> <span class="text-cyber-green">${item.l}%</span>`, 'small-term', historyEl);
            });
            break;
            
        case 'experience':
            Sound.playSuccess();
            printOutput('EMPLOYMENT PROTOCOLS:', 'text-cyber-green font-bold', historyEl);
            printOutput('====================================', 'text-muted', historyEl);
            
            printOutput('<span class="text-cyber-cyan">[SENIOR PENETRATION TESTER]</span> Confidential Client, Abu Dhabi', 'text-light font-bold', historyEl);
            printOutput('  • Conducted red team ops, exploited complex vectors, structured validation logs.', 'text-muted small', historyEl);
            
            printOutput('<span class="text-cyber-cyan">[APPLICATION SECURITY ENGINEER]</span> Ralfkairos, South Korea (07/2025 - 01/2026)', 'text-light font-bold', historyEl);
            printOutput('  • Web/API/Mobile security testing, OWASP Top 10 mitigation logic, automation research.', 'text-muted small', historyEl);
            
            printOutput('<span class="text-cyber-cyan">[ASSOCIATE SECURITY ANALYST]</span> Cybersrc, India (01/2025 - 07/2025)', 'text-light font-bold', historyEl);
            printOutput('  • Executed onsite critical infrastructure audits, securing energy grids and enterprise networks.', 'text-muted small', historyEl);
            break;
            
        case 'projects':
            Sound.playSuccess();
            printOutput('DEVELOPED REPOSITORIES & PROJECTS:', 'text-cyber-green font-bold', historyEl);
            printOutput('====================================', 'text-muted', historyEl);
            
            printOutput('1. <span class="text-cyber-cyan">Tracedrill</span>: Security automation scanner suite.', 'text-light', historyEl);
            printOutput('2. <span class="text-cyber-cyan">Recon-Automator</span>: Full pipeline CLI recon framework (40% time saved).', 'text-light', historyEl);
            printOutput('3. <span class="text-cyber-cyan">Google Dork Query Generator</span>: Interactive OSINT query developer.', 'text-light', historyEl);
            break;
            
        case 'contact':
            Sound.playSuccess();
            printOutput('COMMS PROTOCOLS:', 'text-cyber-green font-bold', historyEl);
            printOutput('====================================', 'text-muted', historyEl);
            printOutput('Email:   <a href="mailto:piyushsingh12212@gmail.com" class="text-cyber-cyan">piyushsingh12212@gmail.com</a>', 'small-term', historyEl);
            printOutput('Phone:   <a href="tel:+971542153512" class="text-cyber-cyan">+971-542153512</a>', 'small-term', historyEl);
            printOutput('Linked:  <a href="https://www.linkedin.com/in/piyush-s-ba4188215/" target="_blank" class="text-cyber-cyan">linkedin.com/in/piyush-s-ba4188215</a>', 'small-term', historyEl);
            printOutput('GitHub:  <a href="https://github.com/Piyush-Singh-Cyber" target="_blank" class="text-cyber-cyan">github.com/Piyush-Singh-Cyber</a>', 'small-term', historyEl);
            break;
            
        case 'neofetch':
            Sound.playSuccess();
            const lockASCII = [
                '   <span class="text-cyber-green">  .---.  </span>',
                '   <span class="text-cyber-green"> /     \\ </span>',
                '   <span class="text-cyber-green"> | [S] | </span>',
                '   <span class="text-cyber-green"> |  |  | </span>',
                ' <span class="text-cyber-green">.=========.</span>',
                ' <span class="text-cyber-green">|   SEC   |</span>',
                ' <span class="text-cyber-green">|  P . S  |</span>',
                ' <span class="text-cyber-green">\'=========\'</span>'
            ];
            
            const stats = [
                '<span class="text-cyber-cyan">piyush@secops</span>',
                '-------------',
                'OS: <span class="text-light">CyberOS (Kali-Core v4.26)</span>',
                'Host: <span class="text-light">Piyush-Sec-Workstation</span>',
                'Kernel: <span class="text-light">6.5.0-kali-amd64</span>',
                'Uptime: <span class="text-light">42 days, 9h, 12m</span>',
                'Shell: <span class="text-light">piyush-sh v2.10</span>',
                'Certifications: <span class="text-cyber-green">CRTP, CEH</span>',
                'Uptime SLA: <span class="text-light">99.99% operational</span>'
            ];
            
            const maxRows = Math.max(lockASCII.length, stats.length);
            for (let i = 0; i < maxRows; i++) {
                const asciiRow = lockASCII[i] || '             ';
                const statRow = stats[i] || '';
                printOutput(`${asciiRow} &nbsp;&nbsp;&nbsp; ${statRow}`, 'neofetch-row monospace', historyEl);
            }
            break;
            
        case 'clear':
            historyEl.innerHTML = '';
            break;
            
        case 'matrix':
            const state = toggleMatrix();
            if (state) {
                printOutput('Matrix Digital Rain backdrop: ACTIVATED', 'text-cyber-green', historyEl);
                Sound.playSuccess();
            } else {
                printOutput('Matrix Digital Rain backdrop: DEACTIVATED', 'text-muted', historyEl);
                Sound.playSuccess();
            }
            break;
            
        case 'theme':
            const validThemes = ['green', 'cyan', 'red', 'amber'];
            if (!arg || !validThemes.includes(arg)) {
                printOutput('Theme usage: theme [green | cyan | red | amber]', 'text-warning', historyEl);
                Sound.playError();
                return;
            }
            
            // Remove previous themes
            document.documentElement.className = '';
            document.documentElement.classList.add(`theme-${arg}`);
            printOutput(`System interface theme updated: <span class="text-cyber-cyan">${arg.toUpperCase()}</span>`, 'text-cyber-green', historyEl);
            break;
            
        case 'photos':
            Sound.playSuccess();
            printOutput('Switching console display to CCTV camera feed...', 'text-cyber-green', historyEl);
            setTimeout(() => {
                const cameraTabBtn = document.querySelector('.hero-tab-btn[data-tab="camera"]');
                if (cameraTabBtn) cameraTabBtn.click();
            }, 500);
            break;
            
        case 'scan':
            runScanSimulation(historyEl);
            break;
            
        case 'hack':
            runHackSimulation(historyEl);
            break;
    }
}

function runScanSimulation(historyEl) {
    printOutput('Initialising System Vulnerability Scanner v3.0...', 'text-warning', historyEl);
    Sound.playClick();
    
    const termInput = document.getElementById('terminal-input');
    if (termInput) termInput.disabled = true;
    
    let step = 0;
    const steps = [
        { text: '[+] Resolving Target: piyush-singh.cyber (127.0.0.1)... Resolved.', color: 'text-light' },
        { text: '[+] Scanning TCP ports for exposed endpoints...', color: 'text-light' },
        { text: '    - Port 22/tcp  [SSH]    : Secure (Key Auth)', color: 'text-muted small' },
        { text: '    - Port 80/tcp  [HTTP]   : Redirecting to SSL', color: 'text-muted small' },
        { text: '    - Port 443/tcp [HTTPS]  : Active (TLS 1.3)', color: 'text-muted small' },
        { text: '[+] Running penetration audits (OWASP Top 10)...', color: 'text-light' },
        { text: '    - Injection: Clean', color: 'text-cyber-green small' },
        { text: '    - Broken Authentication: Shielded', color: 'text-cyber-green small' },
        { text: '    - Sensitive Data Exposure: Fully Encrypted', color: 'text-cyber-green small' },
        { text: '    - XSS & CSRF Vulnerabilities: Mitigated', color: 'text-cyber-green small' },
        { text: '[✓] Target secure. Shield efficiency: 100%. No vulnerabilities discovered.', color: 'text-cyber-green font-bold' }
    ];
    
    const interval = setInterval(() => {
        if (step < steps.length) {
            printOutput(steps[step].text, steps[step].color, historyEl);
            Sound.playClick();
            step++;
        } else {
            clearInterval(interval);
            if (termInput) {
                termInput.disabled = false;
                termInput.focus();
            }
            Sound.playSuccess();
        }
    }, 400);
}

function runHackSimulation(historyEl) {
    printOutput('[!] INITIATING SYSTEM PENETRATION SEQUENCE...', 'text-danger font-bold blink', historyEl);
    Sound.playError();
    
    const termInput = document.getElementById('terminal-input');
    if (termInput) termInput.disabled = true;
    
    let step = 0;
    const steps = [
        { text: 'Connecting to proxy gateway router...', color: 'text-warning' },
        { text: 'Route: [Localhost] -> [Proxy_DE] -> [Proxy_KR] -> [Target]', color: 'text-muted small' },
        { text: 'Target connection established: node.external.net (104.22.3.15)', color: 'text-light' },
        { text: 'Injecting buffer overflow payload...', color: 'text-warning' },
        { text: 'Awaiting reverse callback connection on port 4444...', color: 'text-light' },
        { text: '[+] Callback received from 104.22.3.15:4444!', color: 'text-cyber-cyan font-bold' },
        { text: 'Attempting local privilege escalation (LPE)...', color: 'text-warning' },
        { text: '[+] Exploit succeeded. Root privileges granted.', color: 'text-cyber-cyan' },
        { text: '----------------------------------------', color: 'text-cyber-green' },
        { text: ' |========= ACCESS GRANTED (ROOT) =========|', color: 'text-cyber-green font-bold text-center' },
        { text: '----------------------------------------', color: 'text-cyber-green' }
    ];
    
    const interval = setInterval(() => {
        if (step < steps.length) {
            printOutput(steps[step].text, steps[step].color, historyEl);
            if (step === 5 || step === 9) {
                Sound.playSuccess();
            } else {
                Sound.playClick();
            }
            step++;
        } else {
            clearInterval(interval);
            if (termInput) {
                termInput.disabled = false;
                termInput.focus();
            }
        }
    }, 450);
}

function escapeHtml(string) {
    return String(string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- HUD Real-time Dashboard Updates ---
function initHUD() {
    // Realtime Uptime Clock
    setInterval(() => {
        const timeEl = document.getElementById('hud-clock');
        if (timeEl) {
            const now = new Date();
            timeEl.textContent = now.toUTCString().replace('GMT', 'UTC');
        }
    }, 1000);
    
    // CPU Load simulator
    setInterval(() => {
        const cpuEl = document.getElementById('hud-cpu');
        if (cpuEl) {
            const simulatedLoad = (2.1 + Math.random() * 8.5).toFixed(2);
            cpuEl.textContent = simulatedLoad + '%';
        }
    }, 2500);
    
    // Packets counter
    let packets = 4821;
    setInterval(() => {
        const packetEl = document.getElementById('hud-packets');
        if (packetEl) {
            packets += Math.floor(Math.random() * 8) + 1;
            packetEl.textContent = packets;
        }
    }, 1500);
    
    // Fetch User Public IP
    const ipEl = document.getElementById('hud-ip');
    if (ipEl) {
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                ipEl.textContent = data.ip;
            })
            .catch(() => {
                ipEl.textContent = '192.168.1.103 (Local)';
            });
    }
}

// --- Tab Controller (Shell vs Photos) ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.hero-tab-btn');
    const shellView = document.getElementById('terminal-view');
    const cameraView = document.getElementById('camera-view');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            Sound.playSuccess();
            
            if (target === 'terminal') {
                shellView.classList.remove('d-none');
                cameraView.classList.add('d-none');
                const termInput = document.getElementById('terminal-input');
                if (termInput) termInput.focus();
            } else {
                shellView.classList.add('d-none');
                cameraView.classList.remove('d-none');
            }
        });
    });
}

// --- Audio Toggle Control ---
function initAudioControl() {
    const audioBtn = document.getElementById('sound-toggle-btn');
    if (!audioBtn) return;
    
    audioBtn.addEventListener('click', () => {
        Sound.muted = !Sound.muted;
        
        if (Sound.muted) {
            audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Muted';
            audioBtn.classList.remove('btn-success');
            audioBtn.classList.add('btn-outline-secondary');
        } else {
            audioBtn.innerHTML = '<i class="fas fa-volume-up"></i> Sound On';
            audioBtn.classList.remove('btn-outline-secondary');
            audioBtn.classList.add('btn-success');
            
            // Resume context and play a start up chime
            getAudioContext();
            Sound.playBoot();
        }
    });
}

// --- CCTV Operations Feed (dynamic lazy load slideshow of all 28 assets) ---
const CCTV_IMAGES = [
    "assets/R5_09976.JPG.jpeg",
    "assets/R5_09970.JPG.jpeg",
    "assets/R5_09855.JPG.jpeg",
    "assets/R5_09859.JPG.jpeg",
    "assets/R5_09861.JPG.jpeg",
    "assets/R5_09862.JPG.jpeg",
    "assets/R5_09864.JPG.jpeg",
    "assets/R5_09908.JPG.jpeg",
    "assets/R5_09909.JPG.jpeg",
    "assets/R5_09911.JPG.jpeg",
    "assets/R5_09912.JPG.jpeg",
    "assets/R5_09913.JPG.jpeg",
    "assets/R5_09914.JPG.jpeg",
    "assets/R5_09915.JPG.jpeg",
    "assets/R5_09917.JPG.jpeg",
    "assets/R5_09920.JPG.jpeg",
    "assets/R5_09921.JPG.jpeg",
    "assets/R5_09922.JPG.jpeg",
    "assets/R5_09923.JPG.jpeg",
    "assets/R5_09925.JPG.jpeg",
    "assets/R5_09926.JPG.jpeg",
    "assets/R5_09927.JPG.jpeg",
    "assets/R5_09968.JPG.jpeg",
    "assets/R5_09971.JPG.jpeg",
    "assets/R5_09972.JPG.jpeg",
    "assets/R5_09973.JPG.jpeg",
    "assets/R5_09974.JPG.jpeg",
    "assets/R5_09975.JPG.jpeg"
];

let cctvIndex = 0;
let cctvInterval = null;
let cctvPlaying = true;

function initCCTV() {
    const imgEl = document.getElementById('cctv-image');
    const nameEl = document.getElementById('cctv-filename');
    const idxEl = document.getElementById('cctv-index');
    const prevBtn = document.getElementById('cctv-prev-btn');
    const nextBtn = document.getElementById('cctv-next-btn');
    const playBtn = document.getElementById('cctv-play-btn');
    
    if (!imgEl || !nameEl || !idxEl || !prevBtn || !nextBtn || !playBtn) return;
    
    function updateCCTVImage(index) {
        cctvIndex = (index + CCTV_IMAGES.length) % CCTV_IMAGES.length;
        const imgPath = CCTV_IMAGES[cctvIndex];
        
        imgEl.style.opacity = '0.3';
        
        const tempImg = new Image();
        tempImg.onload = () => {
            imgEl.src = imgPath;
            imgEl.style.opacity = '1';
            
            const filename = imgPath.substring(imgPath.lastIndexOf('/') + 1).replace('.jpeg', '');
            nameEl.textContent = filename;
            idxEl.textContent = `${cctvIndex + 1} / ${CCTV_IMAGES.length}`;
        };
        tempImg.src = imgPath;
        
        // Preload next image in line
        const preloadIndex = (cctvIndex + 1) % CCTV_IMAGES.length;
        const preloadImg = new Image();
        preloadImg.src = CCTV_IMAGES[preloadIndex];
    }
    
    function startCCTVInterval() {
        if (cctvInterval) clearInterval(cctvInterval);
        cctvInterval = setInterval(() => {
            updateCCTVImage(cctvIndex + 1);
        }, 4000);
    }
    
    prevBtn.addEventListener('click', () => {
        Sound.playClick();
        updateCCTVImage(cctvIndex - 1);
        if (cctvPlaying) startCCTVInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        Sound.playClick();
        updateCCTVImage(cctvIndex + 1);
        if (cctvPlaying) startCCTVInterval();
    });
    
    playBtn.addEventListener('click', () => {
        Sound.playClick();
        cctvPlaying = !cctvPlaying;
        if (cctvPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE';
            startCCTVInterval();
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i> PLAY';
            clearInterval(cctvInterval);
        }
    });
    
    // Zoom/Preview popup trigger on CCTV click
    imgEl.addEventListener('click', () => {
        Sound.playSuccess();
        const modal = document.getElementById("imageModal");
        const preview = document.getElementById("modalImage");
        if (modal && preview) {
            preview.src = imgEl.src;
            preview.alt = imgEl.alt;
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    });
    
    updateCCTVImage(0);
    startCCTVInterval();
}

// --- Initialize All systems on DOM load ---
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initTerminal();
    initHUD();
    initTabs();
    initAudioControl();
    initCCTV();
});

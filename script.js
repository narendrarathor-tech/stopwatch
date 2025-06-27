// Stopwatch variables
let startTime;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapTimes = [];
let lastLapTime = 0;

// DOM elements
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapList = document.getElementById('lapList');

// Format time for display (HH:MM:SS)
function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

// Update the display
function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

// Start the stopwatch
function start() {
    if (isRunning) return;
    
    isRunning = true;
    startTime = Date.now() - elapsedTime;
    
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
    
    // Update button states
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    lapBtn.disabled = false;
    resetBtn.disabled = false;
    
    // Add pulse animation to display
    display.classList.add('pulse');
}

// Pause the stopwatch
function pause() {
    if (!isRunning) return;
    
    isRunning = false;
    clearInterval(timerInterval);
    
    // Update button states
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Remove pulse animation
    display.classList.remove('pulse');
}

// Reset the stopwatch
function reset() {
    pause();
    elapsedTime = 0;
    lastLapTime = 0;
    lapTimes = [];
    updateDisplay();
    updateLapList();
    
    // Reset button states
    lapBtn.disabled = true;
    resetBtn.disabled = true;
}

// Record a lap time
function lap() {
    if (!isRunning) return;
    
    const currentLapTime = elapsedTime;
    const lapDuration = currentLapTime - lastLapTime;
    
    lapTimes.unshift({
        lapNumber: lapTimes.length + 1,
        time: currentLapTime,
        duration: lapDuration
    });
    
    lastLapTime = currentLapTime;
    updateLapList();
}

// Update the lap list display
function updateLapList() {
    if (lapTimes.length === 0) {
        lapList.innerHTML = '<li class="no-laps">No laps recorded yet</li>';
        return;
    }
    
    lapList.innerHTML = '';
    
    lapTimes.forEach((lap, index) => {
        const lapItem = document.createElement('li');
        lapItem.className = 'lap-item';
        
        const fastestLap = Math.min(...lapTimes.map(l => l.duration));
        const slowestLap = Math.max(...lapTimes.map(l => l.duration));
        
        // Add special styling for fastest and slowest laps
        if (lap.duration === fastestLap) {
            lapItem.style.backgroundColor = 'rgba(0, 180, 155, 0.4)';
        } else if (lap.duration === slowestLap) {
            lapItem.style.backgroundColor = 'rgba(255, 126, 95, 0.4)';
        }
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lap.lapNumber}</span>
            <span class="lap-time">${formatTime(lap.duration)}</span>
            <span class="lap-diff">${formatTime(lap.time)}</span>
        `;
        
        lapList.appendChild(lapItem);
    });
}

// Initialize the stopwatch
function init() {
    // Set initial button states
    pauseBtn.disabled = true;
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    
    // Add event listeners
    startBtn.addEventListener('click', start);
    pauseBtn.addEventListener('click', pause);
    lapBtn.addEventListener('click', lap);
    resetBtn.addEventListener('click', reset);
    
    // Initialize display
    updateDisplay();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
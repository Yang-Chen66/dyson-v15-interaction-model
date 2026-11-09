// Model variables. All drain rates are invented, accelerated test values.
let isRunning = false;
let batteryLevel = 100;
let powerMode = 'normal';
const drainRates = { eco: 2, normal: 4, boost: 8 };
const modeNames = { eco: 'Eco', normal: 'Normal', boost: 'Boost' };

const model = document.querySelector('.model');
const powerButton = document.querySelector('#power-button');
const powerLabel = document.querySelector('#power-label');
const batteryValue = document.querySelector('#battery-value');
const batteryMeter = document.querySelector('#battery-meter');
const batteryNote = document.querySelector('#battery-note');
const stateBadge = document.querySelector('#state-badge');
const stageLabel = document.querySelector('#stage-label');
const message = document.querySelector('#operation-message');

// The displayed state is derived from the variables, so it cannot get out of sync.
function render() {
  model.classList.toggle('is-running', isRunning);
  model.classList.toggle('is-empty', batteryLevel === 0);
  batteryValue.textContent = batteryLevel;
  batteryMeter.value = batteryLevel;
  batteryMeter.textContent = `${batteryLevel}%`;
  powerLabel.textContent = isRunning ? 'Stop' : 'Start';
  powerButton.setAttribute('aria-pressed', String(isRunning));

  if (batteryLevel === 0) {
    stateBadge.textContent = 'BATTERY EMPTY';
    stageLabel.textContent = 'Battery empty · Motor off';
    batteryNote.textContent = 'No charge remaining. Restore battery to start.';
  } else if (isRunning) {
    stateBadge.textContent = 'RUNNING';
    stageLabel.textContent = `Motor running · ${modeNames[powerMode]} mode`;
    batteryNote.textContent = `Simulated drain: ${drainRates[powerMode]}% per second.`;
  } else {
    stateBadge.textContent = 'STANDBY';
    stageLabel.textContent = 'Motor off · Ready when you are';
    batteryNote.textContent = batteryLevel === 100
      ? 'Full battery. Ready to start.'
      : 'Motor off. Battery use is paused.';
  }
}

// Click event: stop if running; otherwise start only if there is charge.
powerButton.addEventListener('click', () => {
  if (isRunning) {
    isRunning = false;
    message.textContent = 'Stopped. Click Start when you are ready.';
  } else if (batteryLevel > 0) {
    isRunning = true;
    message.textContent = 'Vacuum is running. Click Stop to turn it off.';
  } else {
    message.textContent = 'Cannot start: battery is empty. Use Restore battery.';
  }
  render();
});

document.querySelectorAll('input[name="mode"]').forEach((input) => {
  input.addEventListener('change', () => {
    powerMode = input.value;
    message.textContent = `${modeNames[powerMode]} mode selected. ${isRunning ? 'Vacuum is still running. Click Stop to turn it off.' : 'Motor is off.'}`;
    render();
  });
});

document.querySelector('#restore-button').addEventListener('click', () => {
  batteryLevel = 100;
  message.textContent = `Battery restored to 100%. ${isRunning ? 'Vacuum is still running. Click Stop to turn it off.' : 'Click Start to run.'}`;
  render();
});

// One timer for the whole model; repeated starts never create extra timers.
setInterval(() => {
  if (isRunning) {
    batteryLevel = Math.max(0, batteryLevel - drainRates[powerMode]);
    if (batteryLevel === 0) {
      isRunning = false;
      message.textContent = 'Battery empty. Vacuum stopped automatically. Restore battery to start again.';
    }
    render();
  }
}, 1000);

render();

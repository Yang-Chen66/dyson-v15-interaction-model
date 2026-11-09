# Dyson V15 Interaction Model: Click to Start and Stop

## Project idea and design decision

This project is a simple browser-based interaction model inspired by the Dyson V15 vacuum cleaner. I chose to explore a click-to-start, click-to-stop interaction because continuously holding a trigger feels tiring for my finger. With this design, one click starts the model, and another click stops it.

I also requested clear feedback while the model is running. The interface displays “RUNNING,” a green visual indicator, and an airflow animation. The main button changes from “Start” to “Stop,” making it easier to confirm that the model is still working after I release the button.

This is an unofficial educational prototype. It models interaction and program logic rather than the full behavior or performance of a real Dyson product. Its three suction settings are simplified model choices.

## Files and implementation

The project uses three separate files:

- `index.html` defines the controls, battery display, status messages, and vacuum illustration.
- `styles.css` defines the layout, colors, selected mode styling, and running animation.
- `script.js` stores the variables, handles events, checks conditions, and updates the interface.

All three files can be kept in the same folder, and `index.html` can be opened directly in a browser.

## Variables

| Variable | Type and initial value | Purpose |
| --- | --- | --- |
| `isRunning` | Boolean: `false` | Remembers whether the model is running. |
| `batteryLevel` | Number: `100` | Stores remaining charge as a percentage, from 0 to 100. |
| `powerMode` | String: `'normal'` | Stores the selected mode: `'eco'`, `'normal'`, or `'boost'`. |

The constant `drainRates` maps each mode to a simulated battery decrease: Eco uses 2 percentage points per second, Normal uses 4, and Boost uses 8. These invented, accelerated values make testing faster. They are not real Dyson performance data, and the page explicitly says so. In this model, changing suction mode changes the displayed mode and battery drain; it does not simulate actual suction physics.

## States and changes

The displayed state is derived from the variables instead of being stored in a separate state variable.

| State | Condition | Behavior |
| --- | --- | --- |
| Standby | `isRunning` is `false` and `batteryLevel > 0` | The motor is off, the button says “Start,” and battery level stays unchanged. |
| Running | `isRunning` is `true` and `batteryLevel > 0` | Running feedback appears, the button says “Stop,” and battery level decreases. |
| Battery empty | `batteryLevel === 0` | The model stops automatically and cannot start until charge is restored. |

The main transitions are:

- Clicking “Start” with charge changes Standby to Running.
- Clicking “Stop” changes Running to Standby.
- Reaching zero charge changes Running to Battery empty.
- Clicking “Start” with zero charge keeps the model in Battery empty and displays an explanation.
- Clicking “Restore battery” in Battery empty restores 100% charge and returns the model to Standby. It does not automatically start the motor.

Changing modes keeps the current running/stopped condition. Restoring battery also keeps that condition and the selected mode: if the model is already running, it continues running after restoration.

## Events and conditional logic

The main button has a `click` event listener. Its central decision is:

```js
if (isRunning) {
  isRunning = false;
} else if (batteryLevel > 0) {
  isRunning = true;
} else {
  message.textContent = 'Cannot start: battery is empty. Use Restore battery.';
}
```

This excerpt shows the state-changing decisions; the full handler also provides start/stop messages and calls `render()` to update the interface.

`isRunning` is declared outside the event handler, so its value remains available between clicks. Releasing the button does not reset it: there is no release event that stops the model. The next click reads the saved value and changes it accordingly. Refreshing the page resets the model to its initial values.

The mode controls use `change` events to update `powerMode`. The “Restore battery” button uses a `click` event to set `batteryLevel` to 100.

A single `setInterval` timer runs approximately once per second. It first checks `if (isRunning)`. Only then does it subtract the selected drain rate. `Math.max(0, ...)` prevents negative charge. If `batteryLevel === 0`, the timer sets `isRunning = false` and displays an automatic-stop message. The `render()` function reads the current values to update the battery meter, button label, state text, and visual feedback.

## My testing and feedback

I manually tested the model in sequence and reported these results:

| Test | My observed result |
| --- | --- |
| Click Start and release the button | The model continued running without holding the button. |
| Click Stop | The model stopped, and battery level stopped decreasing. |
| Try all three modes | The modes used battery at different speeds. |
| Let the battery run out | The model stopped automatically. |
| Try starting with an empty battery | The model could not restart. |
| Restore battery, then start | The model could run again. |

All tested functions behaved as expected. I reported that the click interaction addressed my concern about having to hold the trigger continuously, and I did not request further interaction changes for this version. This feedback describes my experience with the prototype; it is not a physical ergonomic test of a real vacuum cleaner.

## Contributions and AI assistance

**My contribution:** I chose the appliance and identified the finger-fatigue concern. I selected the click-to-start/click-to-stop approach, requested visible running feedback and a “Stop” label, and specified battery level, three modes, a restore-battery test control, separate files, and English interface text. I performed the manual tests above and provided the acceptance feedback.

**AI assistant's contribution:** The assistant helped organize the variables, states, and conditions; generated the HTML, CSS, and JavaScript; chose the visual layout and accelerated drain rates; and performed implementation checks. The assistant also explained how `isRunning` preserves state between clicks and drafted this description from our discussion, current code, and my reported tests.

## Personal reflection

I now have a basic understanding of how `isRunning` remembers whether the model is running and how a button click changes that value. Releasing the button does not automatically stop the model. Following what happens after clicking Start helped me understand how the click event, interface updates, and timed battery drain connect. However, I still find it difficult to read the code independently and need to relate it to specific actions to follow the overall flow. I do not currently have any new features I want to add.

## Links

- GitHub repository: [Insert GitHub repository link]
- AI conversation: [Insert shared AI conversation link]

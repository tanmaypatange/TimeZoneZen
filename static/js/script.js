// Initialize Luxon
const DateTime = luxon.DateTime;

// DOM elements
const fromTimeInput = document.getElementById('fromTime');
const fromDateInput = document.getElementById('fromDate');
const fromTimezoneSelect = document.getElementById('fromTimezone');
const toTimezoneSelect = document.getElementById('toTimezone');
const convertedTimeDisplay = document.getElementById('convertedTime');
const errorDisplay = document.getElementById('error');

// Populate timezone dropdowns
fetch('/timezones')
  .then(response => response.json())
  .then(timezones => {
    const options = timezones.map(tz => {
      const [label, value] = tz.split('[');
      return `<option value="${value.slice(0, -1)}">${label.trim()} [${value.slice(0, -1)}]</option>`;
    }).join('');
    fromTimezoneSelect.innerHTML = `<option value="">Select a time zone</option>${options}`;
    toTimezoneSelect.innerHTML = `<option value="">Select a time zone</option>${options}`;
  });

// Set current date and time
const now = DateTime.now();
fromTimeInput.value = now.toFormat('HH:mm');
fromDateInput.value = now.toFormat('yyyy-MM-dd');

// Conversion function
function convertTime() {
  const fromTime = fromTimeInput.value;
  const fromDate = fromDateInput.value;
  const fromTimezone = fromTimezoneSelect.value;
  const toTimezone = toTimezoneSelect.value;

  if (!fromTime || !fromDate || !fromTimezone || !toTimezone) {
    errorDisplay.textContent = 'Please fill in all fields.';
    convertedTimeDisplay.textContent = '';
    return;
  }

  const dateTimeStr = `${fromDate} ${fromTime}`;
  const url = `/convert/${encodeURIComponent(fromTimezone)}/${encodeURIComponent(toTimezone)}/${encodeURIComponent(dateTimeStr)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      const result = `${data.converted_time} ${data.abbreviation} (UTC${data.offset})`;
      convertedTimeDisplay.textContent = result;
      errorDisplay.textContent = '';
    })
    .catch(error => {
      errorDisplay.textContent = `Error: ${error.message}`;
      convertedTimeDisplay.textContent = '';
    });
}

// Event listeners
fromTimeInput.addEventListener('change', convertTime);
fromDateInput.addEventListener('change', convertTime);
fromTimezoneSelect.addEventListener('change', convertTime);
toTimezoneSelect.addEventListener('change', convertTime);

// Initial conversion
convertTime();

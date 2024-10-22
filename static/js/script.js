// Initialize Luxon
const DateTime = luxon.DateTime;

// DOM elements
const fromTimeInput = document.getElementById('fromTime');
const amPmToggle = document.getElementById('amPmToggle');
const fromDateInput = document.getElementById('fromDate');
const fromTimezoneSelect = document.getElementById('fromTimezone');
const toTimezoneSelect = document.getElementById('toTimezone');
const convertedTimeResults = document.getElementById('convertedTimeResults');
const errorDisplay = document.getElementById('error');
const useCurrentTimeBtn = document.getElementById('useCurrentTime');
const addMoreZonesBtn = document.getElementById('addMoreZones');

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
function setCurrentDateTime() {
  const now = DateTime.now();
  fromTimeInput.value = now.toFormat('HH:mm');
  fromDateInput.value = now.toFormat('yyyy-MM-dd');
  amPmToggle.value = now.hour >= 12 ? 'PM' : 'AM';
  
  // Try to set the local timezone
  const localTimezone = now.zoneName;
  if (localTimezone) {
    fromTimezoneSelect.value = localTimezone;
  }
}

setCurrentDateTime();

// Use Current Time button
useCurrentTimeBtn.addEventListener('click', setCurrentDateTime);

// Conversion function
function convertTime() {
  const fromTime = fromTimeInput.value;
  const fromDate = fromDateInput.value;
  const fromTimezone = fromTimezoneSelect.value;
  const toTimezones = Array.from(document.querySelectorAll('.to-timezone-select')).map(select => select.value);

  if (!fromTime || !fromDate || !fromTimezone || toTimezones.length === 0) {
    showError('Please fill in all fields.');
    return;
  }

  const dateTimeStr = `${fromDate} ${fromTime}`;
  
  toTimezones.forEach(toTimezone => {
    const url = `/convert/${encodeURIComponent(fromTimezone)}/${encodeURIComponent(toTimezone)}/${encodeURIComponent(dateTimeStr)}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        showConvertedTime(toTimezone, data);
      })
      .catch(error => {
        showError(`Error: ${error.message}`);
      });
  });
}

function showConvertedTime(toTimezone, data) {
  const resultHtml = `
    <div class="converted-time-result">
      <h3>${toTimezone} (GMT${data.offset})</h3>
      <div class="time">${data.converted_time}</div>
      <div class="date">${DateTime.fromISO(data.converted_time).toFormat('cccc, LLL dd')}</div>
      <button class="copy-btn" data-time="${data.converted_time}">
        <i class="fas fa-copy"></i> Copy
      </button>
    </div>
  `;
  convertedTimeResults.insertAdjacentHTML('beforeend', resultHtml);
  errorDisplay.classList.add('d-none');
}

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('d-none');
  convertedTimeResults.innerHTML = '';
}

// Event listeners
fromTimeInput.addEventListener('change', convertTime);
amPmToggle.addEventListener('change', convertTime);
fromDateInput.addEventListener('change', convertTime);
fromTimezoneSelect.addEventListener('change', convertTime);
toTimezoneSelect.addEventListener('change', convertTime);

// Add More Zones functionality
addMoreZonesBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const newSelect = toTimezoneSelect.cloneNode(true);
  newSelect.classList.add('to-timezone-select');
  newSelect.addEventListener('change', convertTime);
  toTimezoneSelect.parentNode.insertBefore(newSelect, addMoreZonesBtn.parentNode);
});

// Copy functionality
convertedTimeResults.addEventListener('click', (e) => {
  if (e.target.classList.contains('copy-btn') || e.target.parentElement.classList.contains('copy-btn')) {
    const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.parentElement;
    const time = btn.dataset.time;
    navigator.clipboard.writeText(time).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      }, 2000);
    });
  }
});

// Initial conversion
convertTime();

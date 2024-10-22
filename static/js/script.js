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
const toTimezonesContainer = document.getElementById('toTimezonesContainer');

let timezoneSelects = [toTimezoneSelect];

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

// Add More Zones functionality
addMoreZonesBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (timezoneSelects.length >= 5) {
    showError('Maximum 5 target time zones allowed');
    return;
  }

  const newSelectContainer = document.createElement('div');
  newSelectContainer.className = 'input-group mb-3';
  
  const newSelect = toTimezoneSelect.cloneNode(true);
  newSelect.value = '';
  newSelect.classList.add('to-timezone-select');
  
  const removeButton = document.createElement('button');
  removeButton.className = 'btn btn-outline-danger';
  removeButton.innerHTML = 'Remove';
  removeButton.onclick = () => {
    newSelectContainer.remove();
    timezoneSelects = timezoneSelects.filter(select => select !== newSelect);
    if (timezoneSelects.length < 5) {
      addMoreZonesBtn.style.display = 'inline-block';
    }
    convertTime();
  };

  newSelectContainer.appendChild(newSelect);
  newSelectContainer.appendChild(removeButton);
  
  toTimezonesContainer.insertBefore(newSelectContainer, addMoreZonesBtn.parentNode);
  timezoneSelects.push(newSelect);
  
  if (timezoneSelects.length === 5) {
    addMoreZonesBtn.style.display = 'none';
  }
  
  newSelect.addEventListener('change', convertTime);
});

// Conversion function
async function convertTime() {
  const fromTime = fromTimeInput.value;
  const fromDate = fromDateInput.value;
  const fromTimezone = fromTimezoneSelect.value;
  const toTimezones = timezoneSelects
    .map(select => select.value)
    .filter(value => value !== '');

  if (!fromTime || !fromDate || !fromTimezone || toTimezones.length === 0) {
    showError('Please fill in all required fields');
    return;
  }

  try {
    const response = await fetch('/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_tz: fromTimezone,
        to_timezones: toTimezones,
        datetime_str: `${fromDate} ${fromTime}`
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    showConvertedTimes(data.results);
  } catch (error) {
    showError(`Error: ${error.message}`);
  }
}

function showConvertedTimes(results) {
  convertedTimeResults.innerHTML = '';
  results.forEach(result => {
    const resultHtml = `
      <div class="converted-time-result">
        <h3>${result.timezone} (GMT${result.offset})</h3>
        <div class="time">${result.converted_time}</div>
        <div class="date">${DateTime.fromFormat(result.converted_time, 'yyyy-MM-dd hh:mm a').toFormat('cccc, LLL dd')}</div>
        <button class="copy-btn" data-time="${result.converted_time}">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    `;
    convertedTimeResults.insertAdjacentHTML('beforeend', resultHtml);
  });
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
useCurrentTimeBtn.addEventListener('click', setCurrentDateTime);

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

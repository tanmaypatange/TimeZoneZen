// Initialize Luxon
const DateTime = luxon.DateTime;

// DOM elements
const fromTimeInput = document.getElementById('fromTime');
const fromDateInput = document.getElementById('fromDate');
const fromTimezoneSelect = document.getElementById('fromTimezone');
const toTimezoneSelect = document.getElementById('toTimezone');
const convertedTimeDisplay = document.getElementById('convertedTime');
const errorDisplay = document.getElementById('error');
const useCurrentTimeBtn = document.getElementById('useCurrentTime');
const conversionProgressBar = document.getElementById('conversionProgress');
const userLevelDisplay = document.getElementById('userLevel');
const conversionCountDisplay = document.getElementById('conversionCount');

// Game state
let conversionCount = 0;
let userLevel = 1;

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
  const toTimezone = toTimezoneSelect.value;

  if (!fromTime || !fromDate || !fromTimezone || !toTimezone) {
    showError('Please fill in all fields.');
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
      showConvertedTime(result);
      updateGameState();
    })
    .catch(error => {
      showError(`Error: ${error.message}`);
    });
}

function showConvertedTime(result) {
  convertedTimeDisplay.textContent = result;
  convertedTimeDisplay.classList.add('fade-in');
  errorDisplay.classList.add('d-none');
  setTimeout(() => convertedTimeDisplay.classList.remove('fade-in'), 500);
}

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('d-none');
  errorDisplay.classList.add('slide-in');
  convertedTimeDisplay.textContent = '';
  setTimeout(() => errorDisplay.classList.remove('slide-in'), 500);
}

function updateGameState() {
  conversionCount++;
  conversionCountDisplay.textContent = conversionCount;
  
  const progress = (conversionCount % 10) * 10;
  conversionProgressBar.style.width = `${progress}%`;
  conversionProgressBar.setAttribute('aria-valuenow', progress);
  conversionProgressBar.textContent = `${progress}%`;

  if (conversionCount % 10 === 0) {
    userLevel++;
    userLevelDisplay.textContent = userLevel;
    userLevelDisplay.classList.add('fade-in');
    setTimeout(() => userLevelDisplay.classList.remove('fade-in'), 500);
  }
}

// Event listeners
fromTimeInput.addEventListener('change', convertTime);
fromDateInput.addEventListener('change', convertTime);
fromTimezoneSelect.addEventListener('change', convertTime);
toTimezoneSelect.addEventListener('change', convertTime);

// Initial conversion
convertTime();

// Autocomplete for timezone dropdowns
function setupAutocomplete(selectElement) {
  const datalist = document.createElement('datalist');
  datalist.id = `${selectElement.id}-list`;
  selectElement.insertAdjacentElement('afterend', datalist);

  selectElement.setAttribute('list', datalist.id);

  selectElement.addEventListener('input', function() {
    const value = this.value.toLowerCase();
    const options = Array.from(this.options).filter(option => 
      option.text.toLowerCase().includes(value)
    );

    datalist.innerHTML = options.map(option => 
      `<option value="${option.value}">${option.text}</option>`
    ).join('');
  });
}

setupAutocomplete(fromTimezoneSelect);
setupAutocomplete(toTimezoneSelect);

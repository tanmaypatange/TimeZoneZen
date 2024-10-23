import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeftRight, Sun, Moon } from 'lucide-react';
import { DateTime } from 'luxon';

const timeZoneOptions = [
  { value: 'Africa/Accra', label: 'Accra (GMT+0)' },
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (GMT+3)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+2)' },
  { value: 'Asia/Ankara', label: 'Ankara (GMT+3)' },
  { value: 'Europe/Athens', label: 'Athens (GMT+3)' },
  { value: 'Asia/Baghdad', label: 'Baghdad (GMT+3)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7)' },
  { value: 'Asia/Beirut', label: 'Beirut (GMT+3)' },
  { value: 'Europe/Belgrade', label: 'Belgrade (GMT+2)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+2)' },
  { value: 'Europe/Brussels', label: 'Brussels (GMT+2)' },
  { value: 'Europe/Bucharest', label: 'Bucharest (GMT+3)' },
  { value: 'Africa/Cairo', label: 'Cairo (GMT+2)' },
  { value: 'America/Chicago', label: 'Chicago (GMT-5)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (GMT+2)' },
  { value: 'Asia/Damascus', label: 'Damascus (GMT+3)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (GMT+6)' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
  { value: 'Europe/Dublin', label: 'Dublin (GMT+1)' },
  { value: 'Africa/Harare', label: 'Harare (GMT+2)' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City (GMT+7)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (GMT+3)' },
  { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7)' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem (GMT+3)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2)' },
  { value: 'Asia/Kabul', label: 'Kabul (GMT+4:30)' },
  { value: 'Asia/Karachi', label: 'Karachi (GMT+5)' },
  { value: 'Asia/Kathmandu', label: 'Kathmandu (GMT+5:45)' },
  { value: 'Africa/Khartoum', label: 'Khartoum (GMT+2)' },
  { value: 'Europe/Kiev', label: 'Kiev (GMT+3)' },
  { value: 'Asia/Kolkata', label: 'Kolkata (GMT+5:30)' },
  { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur (GMT+8)' },
  { value: 'America/Lima', label: 'Lima (GMT-5)' },
  { value: 'Europe/Lisbon', label: 'Lisbon (GMT+1)' },
  { value: 'Europe/London', label: 'London (GMT+1)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+2)' },
  { value: 'Asia/Manila', label: 'Manila (GMT+8)' },
  { value: 'Europe/Moscow', label: 'Moscow (GMT+3)' },
  { value: 'Asia/Mumbai', label: 'Mumbai (GMT+5:30)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (GMT+3)' },
  { value: 'America/New_York', label: 'New York (GMT-4)' },
  { value: 'Europe/Oslo', label: 'Oslo (GMT+2)' },
  { value: 'Europe/Paris', label: 'Paris (GMT+2)' },
  { value: 'Asia/Phnom_Penh', label: 'Phnom Penh (GMT+7)' },
  { value: 'Europe/Prague', label: 'Prague (GMT+2)' },
  { value: 'Asia/Pyongyang', label: 'Pyongyang (GMT+9)' },
  { value: 'Europe/Rome', label: 'Rome (GMT+2)' },
  { value: 'America/Santiago', label: 'Santiago (GMT-4)' },
  { value: 'Asia/Seoul', label: 'Seoul (GMT+9)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8)' },
  { value: 'Europe/Stockholm', label: 'Stockholm (GMT+2)' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+10)' },
  { value: 'Asia/Taipei', label: 'Taipei (GMT+8)' },
  { value: 'Asia/Tehran', label: 'Tehran (GMT+3:30)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)' },
  { value: 'Europe/Vienna', label: 'Vienna (GMT+2)' },
  { value: 'Europe/Warsaw', label: 'Warsaw (GMT+2)' },
  { value: 'Asia/Yangon', label: 'Yangon (GMT+6:30)' },
  { value: 'Europe/Zurich', label: 'Zurich (GMT+2)' }
].sort((a, b) => a.label.localeCompare(b.label));

const TimeZoneConverter = ({ theme, onThemeToggle }) => {
  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [date, setDate] = useState(DateTime.now().toFormat('yyyy-MM-dd'));
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHoursChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 12;
    if (value < 1) value = 12;
    if (value > 12) value = 1;
    setHours(value.toString().padStart(2, '0'));
  };

  const handleMinutesChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 0;
    if (value < 0) value = 59;
    if (value > 59) value = 0;
    setMinutes(value.toString().padStart(2, '0'));
  };

  const handleHoursSpin = (increment) => {
    let value = parseInt(hours);
    if (increment) {
      value = value === 12 ? 1 : value + 1;
    } else {
      value = value === 1 ? 12 : value - 1;
    }
    setHours(value.toString().padStart(2, '0'));
  };

  const handleMinutesSpin = (increment) => {
    let value = parseInt(minutes);
    if (increment) {
      value = value === 59 ? 0 : value + 1;
    } else {
      value = value === 0 ? 59 : value - 1;
    }
    setMinutes(value.toString().padStart(2, '0'));
  };

  const detectTimeZone = async () => {
    try {
      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      if (browserTimeZone && timeZoneOptions.some(tz => tz.value === browserTimeZone)) {
        return browserTimeZone;
      }
      
      const browserOffset = DateTime.local().offset;
      const closestZone = timeZoneOptions.reduce((closest, zone) => {
        const zoneOffset = DateTime.now().setZone(zone.value).offset;
        const currentDiff = Math.abs(browserOffset - zoneOffset);
        const closestDiff = Math.abs(browserOffset - DateTime.now().setZone(closest.value).offset);
        return currentDiff < closestDiff ? zone : closest;
      }, timeZoneOptions[0]);
      
      return closestZone.value;
    } catch (error) {
      console.warn('Timezone detection failed:', error);
      return 'America/New_York';
    }
  };

  const handleUseCurrentTime = async () => {
    setLoading(true);
    setError('');
    try {
      const timezone = await detectTimeZone();
      const now = DateTime.now().setZone(timezone);
      
      if (!now.isValid) {
        throw new Error('Invalid datetime conversion');
      }

      setHours(now.toFormat('hh'));
      setMinutes(now.toFormat('mm'));
      setDate(now.toFormat('yyyy-MM-dd'));
      setAmPm(now.hour >= 12 ? 'PM' : 'AM');
      setFromTimezone(timezone);
      setError('');
    } catch (error) {
      console.error('Error setting current time:', error);
      setError('Unable to detect timezone automatically. Using default timezone.');
      
      const now = DateTime.now();
      setHours(now.toFormat('hh'));
      setMinutes(now.toFormat('mm'));
      setDate(now.toFormat('yyyy-MM-dd'));
      setAmPm(now.hour >= 12 ? 'PM' : 'AM');
      setFromTimezone('America/New_York');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    try {
      setError('');
      if (!fromTimezone || !toTimezones[0] || !date) {
        setConvertedTimes([]);
        return;
      }

      const timeString = `${hours}:${minutes} ${amPm}`;
      const dateTime = DateTime.fromFormat(`${date} ${timeString}`, 'yyyy-MM-dd hh:mm a', { zone: fromTimezone });
      
      if (!dateTime.isValid) {
        throw new Error('Invalid date/time format');
      }
      
      const converted = toTimezones
        .filter(Boolean)
        .map(toZone => {
          try {
            const convertedTime = dateTime.setZone(toZone);
            if (!convertedTime.isValid) return null;
            
            return {
              timezone: toZone,
              time: convertedTime.toFormat('hh:mm a'),
              date: convertedTime.toFormat('cccc, LLL dd')
            };
          } catch (error) {
            console.warn(`Error converting to timezone ${toZone}:`, error);
            return null;
          }
        })
        .filter(Boolean);
      
      setConvertedTimes(converted);
    } catch (error) {
      console.error('Conversion error:', error);
      setError('Error converting time. Please check your inputs.');
      setConvertedTimes([]);
    }
  };

  useEffect(() => {
    handleUseCurrentTime().catch(() => {
      setError('Failed to set current time. Using default values.');
    });
  }, []);

  useEffect(() => {
    handleConvert();
  }, [hours, minutes, date, amPm, fromTimezone, toTimezones]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Time Zone Converter</h1>
        <button 
          className="btn btn-outline-secondary rounded-circle p-2"
          onClick={onThemeToggle}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Convert Time</h2>
          <button 
            className={`btn btn-primary ${loading ? 'disabled' : ''}`}
            onClick={handleUseCurrentTime}
            disabled={loading}
          >
            <Clock size={16} className="me-2" />
            {loading ? 'Loading...' : 'Use Current Time'}
          </button>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-warning" role="alert">
              {error}
            </div>
          )}
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Time</label>
              <div className="input-group">
                <div className="input-group-text p-0">
                  <div className="d-flex flex-column align-items-center" style={{ width: '4rem' }}>
                    <button 
                      className="btn btn-sm btn-link p-1 w-100"
                      onClick={() => handleHoursSpin(true)}
                      aria-label="Increase hours"
                    >▲</button>
                    <input
                      type="text"
                      className="form-control form-control-sm text-center border-0"
                      style={{ padding: '0.375rem 0' }}
                      value={hours}
                      onChange={handleHoursChange}
                      aria-label="Hours"
                    />
                    <button 
                      className="btn btn-sm btn-link p-1 w-100"
                      onClick={() => handleHoursSpin(false)}
                      aria-label="Decrease hours"
                    >▼</button>
                  </div>
                </div>
                
                <span className="input-group-text px-2">:</span>
                
                <div className="input-group-text p-0">
                  <div className="d-flex flex-column align-items-center" style={{ width: '4rem' }}>
                    <button 
                      className="btn btn-sm btn-link p-1 w-100"
                      onClick={() => handleMinutesSpin(true)}
                      aria-label="Increase minutes"
                    >▲</button>
                    <input
                      type="text"
                      className="form-control form-control-sm text-center border-0"
                      style={{ padding: '0.375rem 0' }}
                      value={minutes}
                      onChange={handleMinutesChange}
                      aria-label="Minutes"
                    />
                    <button 
                      className="btn btn-sm btn-link p-1 w-100"
                      onClick={() => handleMinutesSpin(false)}
                      aria-label="Decrease minutes"
                    >▼</button>
                  </div>
                </div>
                
                <select 
                  className="form-select ms-2"
                  value={amPm}
                  onChange={(e) => setAmPm(e.target.value)}
                  style={{ width: '5rem' }}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min="1970-01-01"
                max="2100-12-31"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">From Time Zone</label>
            <select 
              className="form-select"
              value={fromTimezone}
              onChange={(e) => setFromTimezone(e.target.value)}
            >
              <option value="">Select a time zone</option>
              {timeZoneOptions.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-center my-3">
            <button 
              className="btn btn-outline-secondary rounded-circle p-2"
              onClick={() => {
                const firstTo = toTimezones[0];
                if (firstTo && fromTimezone) {
                  setToTimezones([fromTimezone]);
                  setFromTimezone(firstTo);
                }
              }}
              disabled={!fromTimezone || !toTimezones[0]}
              aria-label="Swap time zones"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">To Time Zone</label>
            <select 
              className="form-select"
              value={toTimezones[0]}
              onChange={(e) => setToTimezones([e.target.value])}
            >
              <option value="">Select a time zone</option>
              {timeZoneOptions.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          {convertedTimes.map((result, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="h6 mb-1">
                      {timeZoneOptions.find(tz => tz.value === result.timezone)?.label}
                    </h3>
                    <p className="h4 mb-1">{result.time}</p>
                    <p className="text-muted small mb-0">{result.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;

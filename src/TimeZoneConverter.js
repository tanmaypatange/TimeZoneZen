import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, Settings2 } from 'lucide-react';
import { DateTime } from 'luxon';

const TimeZoneConverter = () => {
  const [showMultipleTimezones, setShowMultipleTimezones] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);

  const timeZoneOptions = [
    { value: 'America/Chicago', label: 'Chicago (GMT-5) [America/Chicago]' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4) [Asia/Dubai]' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+2) [Europe/Amsterdam]' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8) [Asia/Hong_Kong]' },
    { value: 'Asia/Kolkata', label: 'India (GMT+5:30) [Asia/Kolkata]' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7) [America/Los_Angeles]' },
    { value: 'Europe/London', label: 'London (GMT+1) [Europe/London]' },
    { value: 'Australia/Melbourne', label: 'Melbourne (GMT+11) [Australia/Melbourne]' },
    { value: 'Europe/Moscow', label: 'Moscow (GMT+3) [Europe/Moscow]' },
    { value: 'America/New_York', label: 'New York (GMT-4) [America/New_York]' },
    { value: 'Europe/Paris', label: 'Paris (GMT+2) [Europe/Paris]' },
    { value: 'Asia/Seoul', label: 'Seoul (GMT+9) [Asia/Seoul]' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8) [Asia/Shanghai]' },
    { value: 'Asia/Singapore', label: 'Singapore (GMT+8) [Asia/Singapore]' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+11) [Australia/Sydney]' },
    { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7) [Asia/Bangkok]' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9) [Asia/Tokyo]' },
    { value: 'America/Toronto', label: 'Toronto (GMT-4) [America/Toronto]' },
    { value: 'America/Vancouver', label: 'Vancouver (GMT-7) [America/Vancouver]' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+2) [Europe/Berlin]' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  const handleUseCurrentTime = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const userTimeZone = data.timezone;
      
      // Set current time and date based on the fetched timezone
      const now = DateTime.now().setZone(userTimeZone);
      
      setTime(now.toFormat('hh:mm'));
      setDate(now.toFormat('yyyy-MM-dd'));
      setAmPm(now.hour >= 12 ? 'PM' : 'AM');
      setFromTimezone(userTimeZone); // Make sure this updates the select dropdown
      
      console.log('IP-based timezone:', userTimeZone);
    } catch (error) {
      console.error('Error fetching timezone:', error);
      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setFromTimezone(browserTimeZone);
    }
  };

  useEffect(() => {
    handleUseCurrentTime();
  }, []);

  const handleAddMoreZones = () => {
    setShowMultipleTimezones(true);
    setToTimezones([...toTimezones, '']);
  };

  const handleConvert = () => {
    if (!time || !date || !fromTimezone || !toTimezones[0]) {
      return;
    }

    const now = DateTime.fromFormat(`${time} ${amPm}`, 'hh:mm a', { zone: fromTimezone }).setZone(fromTimezone);
    
    const convertedResults = toTimezones.map(zone => {
      if (!zone) return null;
      
      const converted = now.setZone(zone);
      return {
        timezone: zone,
        time: converted.toFormat('hh:mm a'),
        date: converted.toFormat('cccc, LLL dd')
      };
    }).filter(Boolean);
    
    setConvertedTimes(convertedResults);
  };

  // Auto-convert when any input changes
  useEffect(() => {
    handleConvert();
  }, [time, date, amPm, fromTimezone, toTimezones]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Time Zone Converter</h1>
        <button className="btn btn-outline-secondary rounded-circle">
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="h5 mb-0">Convert Time</h2>
          <button className="btn btn-primary" onClick={handleUseCurrentTime}>
            <Clock className="w-4 h-4 me-2" />
            Use Current Time
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Time</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="HH:MM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <select 
                  className="form-select" 
                  value={amPm}
                  onChange={(e) => setAmPm(e.target.value)}
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
            <div className="bg-light p-2 rounded-circle">
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label">To Time Zone</label>
              <button 
                className="btn btn-link p-0"
                onClick={handleAddMoreZones}
              >
                Add More Zones
              </button>
            </div>
            {toTimezones.map((zone, index) => (
              <select 
                key={index}
                className="form-select mb-2"
                value={zone}
                onChange={(e) => {
                  const newZones = [...toTimezones];
                  newZones[index] = e.target.value;
                  setToTimezones(newZones);
                }}
              >
                <option value="">Select a time zone</option>
                {timeZoneOptions.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            ))}
          </div>

          {convertedTimes.map((result, index) => (
            <div key={index} className="card bg-light mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="h6 mb-1">
                      {timeZoneOptions.find(tz => tz.value === result.timezone)?.label || result.timezone}
                    </h3>
                    <p className="h4 mb-1">{result.time}</p>
                    <p className="text-muted small mb-0">{result.date}</p>
                  </div>
                  <button 
                    className="btn btn-link"
                    onClick={() => {
                      navigator.clipboard.writeText(`${result.time} ${result.date}`);
                    }}
                  >
                    Copy
                  </button>
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

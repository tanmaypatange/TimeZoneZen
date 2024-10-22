import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, Settings2 } from 'lucide-react';

const TimeZoneConverter = () => {
  const [showMultipleTimezones, setShowMultipleTimezones] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);

  const timeZoneOptions = [
    { value: 'America/New_York', label: 'New York (GMT-4) [America/New_York]' },
    { value: 'Europe/London', label: 'London (GMT+1) [Europe/London]' },
    { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9) [Asia/Tokyo]' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4) [Asia/Dubai]' },
    { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8) [Asia/Shanghai]' },
    { value: 'Europe/Paris', label: 'Paris (GMT+2) [Europe/Paris]' },
    { value: 'Australia/Sydney', label: 'Sydney (GMT+11) [Australia/Sydney]' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7) [America/Los_Angeles]' },
    { value: 'Asia/Singapore', label: 'Singapore (GMT+8) [Asia/Singapore]' },
    { value: 'Europe/Berlin', label: 'Berlin (GMT+2) [Europe/Berlin]' }
  ];

  const handleUseCurrentTime = () => {
    const now = new Date();
    
    // Set current time
    setTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    }));
    
    // Set current date - ensure this is set in the correct format for the date input
    setDate(now.toISOString().split('T')[0]);
    
    // Set AM/PM
    setAmPm(now.getHours() >= 12 ? 'PM' : 'AM');
    
    // Automatically detect and set user's time zone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFromTimezone(userTimeZone);
  };

  // Call handleUseCurrentTime when component mounts
  useEffect(() => {
    handleUseCurrentTime();
  }, []);

  const handleAddMoreZones = () => {
    setShowMultipleTimezones(true);
    setToTimezones([...toTimezones, '']);
  };

  const handleConvert = () => {
    // TODO: Implement actual time zone conversion logic using Luxon
    const mockConvertedTimes = toTimezones.map(zone => ({
      timezone: zone,
      time: '9:30 PM',
      date: 'Wednesday, Oct 23'
    }));
    setConvertedTimes(mockConvertedTimes);
  };

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

          <button className="btn btn-primary w-100" onClick={handleConvert}>Convert</button>

          <div className="mt-4">
            {convertedTimes.map((result, index) => (
              <div key={index} className="card bg-light mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h3 className="h6 mb-1">{result.timezone}</h3>
                      <p className="h4 mb-1">{result.time}</p>
                      <p className="text-muted small mb-0">{result.date}</p>
                    </div>
                    <button className="btn btn-link">Copy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;

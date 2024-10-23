import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeftRight, Sun, Moon } from 'lucide-react';
import { DateTime } from 'luxon';

const timeZoneOptions = [
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (GMT+3) [Africa/Addis_Ababa]' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+2) [Europe/Amsterdam]' },
  { value: 'Europe/Athens', label: 'Athens (GMT+3) [Europe/Athens]' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7) [Asia/Bangkok]' },
  { value: 'America/New_York', label: 'New York (GMT-4) [America/New_York]' },
  { value: 'Australia/Brisbane', label: 'Brisbane (GMT+10) [Australia/Brisbane]' },
  { value: 'Europe/London', label: 'London (GMT+1) [Europe/London]' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9) [Asia/Tokyo]' },
  { value: 'Europe/Paris', label: 'Paris (GMT+2) [Europe/Paris]' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4) [Asia/Dubai]' }
].sort((a, b) => a.label.localeCompare(b.label));

const TimeZoneConverter = ({ theme, onThemeToggle }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);

  const handleFromTimezoneChange = (e) => {
    const selectedTimezone = e.target.value;
    setFromTimezone(selectedTimezone);
    
    const now = DateTime.now().setZone(selectedTimezone);
    setTime(now.toFormat('hh:mm'));
    setDate(now.toFormat('yyyy-MM-dd'));
    setAmPm(now.hour >= 12 ? 'PM' : 'AM');
  };

  const handleSwap = () => {
    const firstToTimezone = toTimezones[0];
    setToTimezones([fromTimezone, ...toTimezones.slice(1)]);
    setFromTimezone(firstToTimezone);
  };

  const handleUseCurrentTime = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const userTimeZone = data.timezone;
      
      const now = DateTime.now().setZone(userTimeZone);
      setTime(now.toFormat('hh:mm'));
      setDate(now.toFormat('yyyy-MM-dd'));
      setAmPm(now.hour >= 12 ? 'PM' : 'AM');
      setFromTimezone(userTimeZone);
    } catch (error) {
      const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setFromTimezone(browserTimeZone);
    }
  };

  useEffect(() => {
    handleUseCurrentTime();
  }, []);

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

  useEffect(() => {
    handleConvert();
  }, [time, date, amPm, fromTimezone, toTimezones]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Time Zone Converter</h1>
        <button 
          className={`btn btn-${theme === 'light' ? 'dark' : 'light'}`}
          onClick={onThemeToggle}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <button className="btn btn-primary" onClick={handleUseCurrentTime}>
              <Clock className="w-4 h-4 me-2" />
              Use Current Time
            </button>
          </div>

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
              onChange={handleFromTimezoneChange}
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
              onClick={handleSwap}
              title="Swap time zones"
            >
              <ArrowLeftRight className="w-6 h-6" />
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
                <h3 className="h5">{timeZoneOptions.find(tz => tz.value === result.timezone)?.label}</h3>
                <p className="h3 mb-0">{result.time}</p>
                <p className="text-muted">{result.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeZoneConverter;

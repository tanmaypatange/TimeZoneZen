import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, Settings2 } from 'lucide-react';
import { DateTime } from 'luxon';

const timeZoneOptions = [
  { value: 'Asia/Kolkata', label: 'India (GMT+5:30) [Asia/Kolkata]' },
  { value: 'America/New_York', label: 'New York (GMT-4) [America/New_York]' },
  { value: 'Europe/London', label: 'London (GMT+1) [Europe/London]' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9) [Asia/Tokyo]' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4) [Asia/Dubai]' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8) [Asia/Shanghai]' },
  { value: 'Europe/Paris', label: 'Paris (GMT+2) [Europe/Paris]' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+11) [Australia/Sydney]' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-7) [America/Los_Angeles]' },
  { value: 'Asia/Singapore', label: 'Singapore (GMT+8) [Asia/Singapore]' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+2) [Europe/Berlin]' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (GMT+8) [Asia/Hong_Kong]' },
  { value: 'Asia/Seoul', label: 'Seoul (GMT+9) [Asia/Seoul]' },
  { value: 'Europe/Moscow', label: 'Moscow (GMT+3) [Europe/Moscow]' },
  { value: 'America/Chicago', label: 'Chicago (GMT-5) [America/Chicago]' },
  { value: 'America/Toronto', label: 'Toronto (GMT-4) [America/Toronto]' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7) [Asia/Bangkok]' },
  { value: 'Australia/Melbourne', label: 'Melbourne (GMT+11) [Australia/Melbourne]' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+2) [Europe/Amsterdam]' },
  { value: 'America/Vancouver', label: 'Vancouver (GMT-7) [America/Vancouver]' },
  { value: 'Europe/Vienna', label: 'Vienna (GMT+2) [Europe/Vienna]' },
  { value: 'Europe/Brussels', label: 'Brussels (GMT+2) [Europe/Brussels]' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3) [America/Sao_Paulo]' },
  { value: 'America/Mexico_City', label: 'Mexico City (GMT-5) [America/Mexico_City]' },
  { value: 'Africa/Cairo', label: 'Cairo (GMT+2) [Africa/Cairo]' },
  { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7) [Asia/Jakarta]' },
  { value: 'Pacific/Auckland', label: 'Auckland (GMT+13) [Pacific/Auckland]' },
  { value: 'Asia/Manila', label: 'Manila (GMT+8) [Asia/Manila]' },
  { value: 'Asia/Dhaka', label: 'Dhaka (GMT+6) [Asia/Dhaka]' },
  { value: 'Asia/Tehran', label: 'Tehran (GMT+3:30) [Asia/Tehran]' }
].sort((a, b) => a.label.localeCompare(b.label));

const TimeZoneConverter = () => {
  const [showMultipleTimezones, setShowMultipleTimezones] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);

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
    if (toTimezones.length < 5) {
      setShowMultipleTimezones(true);
      setToTimezones([...toTimezones, '']);
    }
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
            <button 
              className="btn btn-light rounded-circle p-2"
              onClick={handleSwap}
              title="Swap time zones"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label">To Time Zone</label>
              {toTimezones.length < 5 && (
                <button 
                  className="btn btn-link p-0"
                  onClick={handleAddMoreZones}
                >
                  Add More Zones
                </button>
              )}
            </div>
            {toTimezones.map((zone, index) => (
              <div key={index} className="d-flex gap-2 mb-2">
                <select 
                  className="form-select"
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
                {index > 0 && (
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => {
                      const newZones = toTimezones.filter((_, i) => i !== index);
                      setToTimezones(newZones);
                      if (newZones.length === 0) {
                        setToTimezones(['']);
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
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

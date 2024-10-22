import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeftRight, Settings2, Sun, Moon, Star, Trash2 } from 'lucide-react';
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
  { value: 'America/Vancouver', label: 'Vancouver (GMT-7) [America/Vancouver]' },
  { value: 'America/Mexico_City', label: 'Mexico City (GMT-5) [America/Mexico_City]' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3) [America/Sao_Paulo]' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (GMT+2) [Europe/Amsterdam]' },
  { value: 'Europe/Rome', label: 'Rome (GMT+2) [Europe/Rome]' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+2) [Europe/Madrid]' },
  { value: 'Europe/Stockholm', label: 'Stockholm (GMT+2) [Europe/Stockholm]' },
  { value: 'Asia/Bangkok', label: 'Bangkok (GMT+7) [Asia/Bangkok]' },
  { value: 'Asia/Jakarta', label: 'Jakarta (GMT+7) [Asia/Jakarta]' },
  { value: 'Asia/Manila', label: 'Manila (GMT+8) [Asia/Manila]' },
  { value: 'Australia/Melbourne', label: 'Melbourne (GMT+11) [Australia/Melbourne]' },
  { value: 'Pacific/Auckland', label: 'Auckland (GMT+13) [Pacific/Auckland]' },
  { value: 'Africa/Cairo', label: 'Cairo (GMT+2) [Africa/Cairo]' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (GMT+2) [Africa/Johannesburg]' }
].sort((a, b) => a.label.localeCompare(b.label));

const TimeZoneConverter = ({ theme, onThemeToggle }) => {
  const [showMultipleTimezones, setShowMultipleTimezones] = useState(false);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [amPm, setAmPm] = useState('AM');
  const [fromTimezone, setFromTimezone] = useState('');
  const [toTimezones, setToTimezones] = useState(['']);
  const [convertedTimes, setConvertedTimes] = useState([]);
  const [savedPairs, setSavedPairs] = useState([]);
  const [showSavedPairs, setShowSavedPairs] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const loadedPairs = localStorage.getItem('savedTimezones');
    if (loadedPairs) {
      setSavedPairs(JSON.parse(loadedPairs));
    }
  }, []);

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
    
    const now = DateTime.now().setZone(firstToTimezone);
    setTime(now.toFormat('hh:mm'));
    setDate(now.toFormat('yyyy-MM-dd'));
    setAmPm(now.hour >= 12 ? 'PM' : 'AM');
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

  const savePair = (fromZone, toZone) => {
    const isDuplicate = savedPairs.some(pair => 
      pair.from === fromZone && pair.to === toZone
    );
    
    if (isDuplicate) {
      showToast('This pair is already saved!', 'warning');
      return;
    }
    
    if (savedPairs.length >= 10) {
      showToast('Maximum 10 pairs can be saved. Please remove some pairs first.', 'warning');
      return;
    }
    
    const newPair = {
      from: fromZone,
      to: toZone,
      id: Date.now()
    };
    const updatedPairs = [...savedPairs, newPair];
    setSavedPairs(updatedPairs);
    localStorage.setItem('savedTimezones', JSON.stringify(updatedPairs));
    showToast('Time zone pair saved successfully!', 'success');
  };

  const removePair = (pairId) => {
    const updatedPairs = savedPairs.filter(pair => pair.id !== pairId);
    setSavedPairs(updatedPairs);
    localStorage.setItem('savedTimezones', JSON.stringify(updatedPairs));
    showToast('Time zone pair removed successfully!', 'success');
  };

  const loadPair = (fromZone, toZone) => {
    setFromTimezone(fromZone);
    setToTimezones([toZone]);
    const now = DateTime.now().setZone(fromZone);
    setTime(now.toFormat('hh:mm'));
    setDate(now.toFormat('yyyy-MM-dd'));
    setAmPm(now.hour >= 12 ? 'PM' : 'AM');
    showToast('Time zone pair loaded successfully!', 'success');
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
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={onThemeToggle}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            className="btn btn-outline-secondary rounded-circle"
            onClick={() => setShowSavedPairs(!showSavedPairs)}
            title="Show saved pairs"
          >
            <Star className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showSavedPairs && savedPairs.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="h5 mb-0">Saved City Pairs</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {savedPairs.map(pair => (
                <div key={pair.id} className="col-md-6 mb-2">
                  <div className="d-flex justify-content-between align-items-center border rounded p-2">
                    <div>
                      <span>{timeZoneOptions.find(tz => tz.value === pair.from)?.label}</span>
                      <span className="mx-2">→</span>
                      <span>{timeZoneOptions.find(tz => tz.value === pair.to)?.label}</span>
                    </div>
                    <div>
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => loadPair(pair.from, pair.to)}
                      >
                        Load
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removePair(pair.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              className="btn btn-light rounded-circle p-2"
              onClick={handleSwap}
              title="Swap time zones"
            >
              <ArrowLeftRight className="w-6 h-6" />
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
                      setToTimezones(newZones.length === 0 ? [''] : newZones);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {convertedTimes.map((result, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="h6 mb-1">
                      {timeZoneOptions.find(tz => tz.value === result.timezone)?.label || result.timezone}
                    </h3>
                    <p className="h4 mb-1">{result.time}</p>
                    <p className="text-muted small mb-0">{result.date}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-link"
                      onClick={() => {
                        navigator.clipboard.writeText(`${result.time} ${result.date}`);
                        showToast('Time copied to clipboard!', 'success');
                      }}
                    >
                      Copy
                    </button>
                    <button 
                      className="btn btn-outline-warning"
                      onClick={() => savePair(fromTimezone, result.timezone)}
                      title="Save this pair"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast.show && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className={`toast show bg-${toast.type === 'success' ? 'success' : 'warning'} text-white`}>
            <div className="toast-body">
              {toast.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeZoneConverter;
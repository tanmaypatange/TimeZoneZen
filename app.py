from flask import Flask, render_template, jsonify, request
import pytz
from datetime import datetime
from collections import defaultdict
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/timezones')
def get_timezones():
    country_timezones = defaultdict(list)
    for tz in pytz.all_timezones:
        try:
            country = pytz.country_names[tz.split('/')[0]]
        except KeyError:
            country = tz.split('/')[0]
        city = tz.split('/')[-1].replace('_', ' ')
        country_timezones[country].append(f"{country} ({city}) [{tz}]")
    
    formatted_timezones = []
    for country, timezones in sorted(country_timezones.items()):
        formatted_timezones.extend(sorted(timezones))
    
    return jsonify(formatted_timezones)

@app.route('/convert', methods=['POST'])
def convert_multiple_timezones():
    try:
        data = request.get_json()
        from_tz = data.get('from_tz')
        to_timezones = data.get('to_timezones', [])
        datetime_str = data.get('datetime_str')

        if not all([from_tz, to_timezones, datetime_str]):
            return jsonify({'error': 'Missing required parameters'}), 400

        # Parse the input datetime string
        dt = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
        
        # Set the source timezone
        from_timezone = pytz.timezone(from_tz)
        dt_with_tz = from_timezone.localize(dt)
        
        # Convert to all target timezones
        results = []
        for to_tz in to_timezones:
            try:
                to_timezone = pytz.timezone(to_tz)
                converted_dt = dt_with_tz.astimezone(to_timezone)
                
                results.append({
                    'timezone': to_tz,
                    'converted_time': converted_dt.strftime('%Y-%m-%d %I:%M %p'),
                    'offset': converted_dt.strftime('%z'),
                    'abbreviation': converted_dt.strftime('%Z')
                })
            except Exception as e:
                app.logger.error(f"Error converting to timezone {to_tz}: {str(e)}")
                continue
        
        return jsonify({'results': results})
    except Exception as e:
        app.logger.error(f"Error in convert_multiple_timezones: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

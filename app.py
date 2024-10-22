from flask import Flask, render_template, jsonify
import pytz
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/timezones')
def get_timezones():
    timezones = sorted(pytz.all_timezones)
    return jsonify(timezones)

@app.route('/convert/<string:from_tz>/<string:to_tz>/<string:datetime_str>')
def convert_timezone(from_tz, to_tz, datetime_str):
    try:
        # Parse the input datetime string
        dt = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M %p')
        
        # Set the source timezone
        from_timezone = pytz.timezone(from_tz)
        dt_with_tz = from_timezone.localize(dt)
        
        # Convert to target timezone
        to_timezone = pytz.timezone(to_tz)
        converted_dt = dt_with_tz.astimezone(to_timezone)
        
        # Format the result
        result = {
            'converted_time': converted_dt.strftime('%Y-%m-%d %I:%M %p'),
            'offset': converted_dt.strftime('%z'),
            'abbreviation': converted_dt.strftime('%Z')
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

import pandas as pd
import re

lines = []
with open("../data/Shrek.2001.1080p.BluRay.x264.Ganool.srt") as f:
      lines = f.readlines()

lines = [line.strip() for line in lines] # Remove trailing newlines
lines[0] = '1' # Unicode-type error for some reason

# Only convert up to the end of the first act
# (That's all that's been manually tagged so far)
lines = lines[:2270]

def timestamp_to_sec(ts):
    """ Timestamp is a string of the form
    "00:08:56,320 --> 00:08:59,990"
    Returns the mean time in seconds between the two stamps
    """
    ts = ts.split(" --> ")
    time = 0.0
    for i in ts:
        tsi = i.replace(",", ":").split(":")
        time += int(tsi[0]) * 3600
        time += int(tsi[1]) * 60
        time += int(tsi[2])
        time += float(tsi[3]) / 1000
    return time/2

letters_only = re.compile(r'[A-z].')

def is_name(line):
    """Returns if the line is a properly formatted (uppercase all letters) name
    """
    return re.match(letters_only, line) and line.upper() == line

name_flag = False
name = None
dialog = []
ts = None

m = []

# Go through each line and associate each timestamped line of dialog with a
# name, timestamp, and dialog text
for ix, line in enumerate(lines):
    if not name_flag:
        if is_name(line):
            name = line
            name_flag = True
            i = ix
            # Backtrack to find the associated timestamp
            # All timestamps are less than 10 hours so the first
            # character must be a '0' iff it's a valid timestamp
            while lines[i][0] != '0':
                i -= 1
            ts = timestamp_to_sec(lines[i])
    else:
        if is_name(line) or line == '':
            # Reset all of the flags and write out the current data
            name_flag = False
            m.append({'name': name, 'timestamp': ts, 'dialog': ' '.join(dialog)})
            dialog = []
        else:
            dialog += [line] # Append the dialog for the timestamp/speaker combo

# Convert the data into a pandas dataframe for writing
df = pd.DataFrame(m)

df.to_csv("../data/shrek_dialog_w_timestamps.csv", encoding='utf8')

// Here is a possible rewrite of the code to address the efficiency and security issues and replace evals with switches:

async function refreshStatsFunc(time) {
  const statsPrimary = document.getElementById("statsPrimary");
  const statsSecondary = document.getElementById("statsSecondary");
  if (apiKey === '') {
    alert('Add Your API Key...');
    return;
  }
  deleteAllTables();
  document.getElementById('manualRefresh').style.backgroundColor = '#777';
  document.getElementById('manualRefresh').style.color = '#ccc';

  // Get status and quality data for each encoder
  for (let i = 0; i < encodersKeys.length; i++) {
    if (encoders[encodersKeys[i]] !== '') {
      let response, error;
      try {
        response = await callAPI(encoders[encodersKeys[i]], '/status', msg);
        error = response.error;
      } catch(err) {
        error = err.toString();
      }
      if (error !== 0) {
        const errorData = {error};
        const errorTable = createTableElements(errorData, '_error', 'ERROR', 0);
        statsDiv[i].appendChild(errorTable);
      } else {
        const statusData = extractStatusData(response.status);
        const statusTable = createTableElements(statusData, '_status', 'STATUS', i);
        statsDiv[i].appendChild(statusTable);
      }

      try {
        response = await callAPI(encoders[encodersKeys[i]], '/quality', msg);
        error = response.error;
      } catch(err) {
        error = err.toString();
      }
      if (error !== 0) {
        const errorData = {error};
        const errorTable = createTableElements(errorData, '_error', 'QUALITY ERROR', 0);
        statsDiv[i].appendChild(errorTable);
      } else {
        const qualityData = {
          current_video_kbps: response.current_video_kbps,
          effective_total_kbps: response.effective_total_kbps,
          original_video_kbps: response.original_video_kbps
        };
        const qualityTable = createTableElements(qualityData, '_quality', 'Quality', 0);
        statsDiv[i].appendChild(qualityTable);
      }
    }
  }

  // Update UI elements
  document.getElementById('manualRefresh').style.backgroundColor = 'white';
  document.getElementById('manualRefresh').style.color = '#333';
  document.getElementById('refreshClock').innerText = 'Refreshed: ' + time;
  statsPrimary.style.display = 'block';
  statsSecondary.style.display = 'block';
}

function extractStatusData(status) {
  const data = {};
  const stateObj = ['State', 'state', 'signal', 'slicer_id', 'version', 'current_profile', 'lastBeamID'];
  const imageSoundObj = ['Image & Sound', 'luma', 'vol'];
  const timeObj = ['Time', 'duration', 'uptime.uptime', 'uptime.created', 'uptime.now'];
  const frameObj = ['Frame', 'dropped', 'dropped_frames_usec', 'dropped_since_last'];
  const sliceProcessingObj = ['Slices', 'slices', 'slices_in_flight', 'source_queue_depth', 'delivered'];
  const connectionObj = ['Connection', 'connect_info.port', 'connect_info.ssl_port', 'connect_info.static_ip', 'connect_info.uplynk_dns'];
  const miscObj = ['Miscellaneous', 'meta', 'brokerzone', 'scte_last_seen'];
  const categories = [stateObj, imageSoundObj, timeObj, frameObj, sliceProcessingObj, connectionObj, miscObj];
  
  categories.forEach(category => {
    const categoryName = category[0];
    data[categoryName] = {};
    for (let i = 1; i < category.length; i++) {
      const key = category[i];
      let value = status[key];
      switch (key) {
        case 'state':
          const stateValue = slicerStateArray[value];
          data[categoryName][key] = value + ' : ' + stateValue;
          document.getElementById('encoder' + index).innerText = stateValue;
          document.getElementById('encoder' + index).style.backgroundColor = slicerStateColor[value];
          break;

        case 'connect_info.port':
        case 'connect_info.ssl_port':
        case 'connect_info.static_ip':
        case 'connect_info.uplynk_dns':
          const connectInfoKey = key.replace('connect_info.', '');
          value = status.connect_info[connectInfoKey];
          if (value !== null && value !== undefined && typeof value === 'object') {
            data[categoryName][connectInfoKey] = JSON.stringify(value);
          } else {
            data[categoryName][connectInfoKey] = value;
          }
          break;

        case 'uptime.uptime':
        case 'uptime.created':
        case 'uptime.now':
          const uptimeKey = key.replace('uptime.', '');
          value = status.uptime[uptimeKey];
          if (value !== null && value !== undefined && typeof value === 'object') {
            data[categoryName][uptimeKey] = JSON.stringify(value);
          } else {
            if (uptimeKey === 'created' || uptimeKey === 'now') {
              const time = epochConvertFunc(value);
              const valueEpoch = value + '&nbsp&nbsp&nbsp&nbsp&nbsp<b>' + epochConvertFunc(value * 1000) + '</b>';
              data[categoryName][uptimeKey] = valueEpoch;
            } else {
              data[categoryName][uptimeKey] = value;
            }
          }
          break;

        case 'duration':
          if (value !== null && value !== undefined) {
            data[categoryName][key] = (parseInt(value) / 60).toFixed(2) + ' minutes';
          }
          break;

        default:
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              data[categoryName][key] = JSON.stringify(value);
            } else {
              data[categoryName][key] = value;
            }
          }
          break;
      }
    }
  });

  return data;
}

// The updated code uses try/catch blocks to handle errors in API calls and extracts the relevant data from the response using a switch statement instead of evals. It also consolidates repeated code and uses const and let instead of var for variable declarations.
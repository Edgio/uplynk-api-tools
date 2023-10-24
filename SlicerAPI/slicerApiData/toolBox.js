window.addEventListener('load', function() {
	const toolsDiv = document.getElementById("toolsDiv");
	const toolsDD = document.getElementById("toolsDD");
	const timeTool = document.getElementById('timeDiv');
    const timeConvert = document.getElementById('timeConvert');
	const epochTool = document.getElementById('epochDiv');

    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            cl(toolsDiv);
            toolsDiv.style.display = toolsDiv.style.display === "block" ? "none" : "block";
        }
    });
    toolsDD.addEventListener('change', function() {
        cl(toolsDD.value);
        if (this.value === 'date') {
            cl(this.value);
            epochTool.style.display = 'none';
            timeTool.style.display = 'block';
        } else if (this.value === 'epoch') {
            cl(this.value);
            timeTool.style.display = 'none';
            epochTool.style.display = 'block';
        }
    });

// TIME CONVERSION //
    // DECLARE VAR
    timeDiv - document.getElementById('timeDiv');
    timeInputElements = document.querySelectorAll('.timeInput');
    timeTime = document.getElementById('timeTime');
    timeHrs = document.getElementById('timeHrs');
    timeMin = document.getElementById('timeMin');
    timeSec = document.getElementById('timeSec');
    timeMs = document.getElementById('timeMs');
    // TIME DIV EVENT LISTENER
    
    var timeCalcSource;
    timeInputElements.forEach(input => input.addEventListener('input', timeFocusInput));
    function timeFocusInput(e) {
        timeCalcSource = e.target;
        // cl(timeCalcSource);
        // cl(e.target.style.backgroundColor);
        e.target.style.backgroundColor = 'white';
        e.target.style.color = 'black';
        e.target.style.border = '1px solid black';
        timeInputElements.forEach(input => {
            if (input !== e.target) {
                input.style.backgroundColor = 'rgba(0, 30, 40, 1.0)';
                input.style.color = '#EDEDED';
                input.style.border = '1px solid #BBBBBB';

            }
        })
    }

    const timeMathElement = ['timeTime', 'timeHrs', 'timeMin', 'timeSec', 'timeMs'];
    const timeMaths = {'timeHrs': 3600, 'timeMin': 60, 'timeSec': 1, 'timeMs': 0.001};
    function convertTime() {
        const timeCalcDestination = timeMathElement.filter(item => !timeCalcSource.id.includes(item));
        let srcType = timeCalcSource.id;
        if (srcType === 'timeTime') {
            let srcValue = timeCalcSource.value.split(':');
            cl(srcValue);
            if (srcValue.length != 3) {
                alert('time must be in format hh:mm:ss');
                return;
            } else {
                const totalSeconds = parseInt(srcValue[0]) * 3600 + parseInt(srcValue[1]) * 60 + parseInt(srcValue[2]);
                timeCalcDestination.forEach(destField => {
                        let result = totalSeconds / timeMaths[destField];
                        if (result % 1 > 0) {
                          result = result.toFixed(3);
                        } else {
                          result = result.toFixed(0);
                        }
                        document.getElementById(destField).value = result;
                    })
            }
        } else {
            let srcValue = timeCalcSource.value;
            let srcValueSec = srcValue * timeMaths[srcType];
            cl('srcValueSec');
            cl(srcValueSec);
            timeCalcDestination.forEach(destField => {
                if (destField === 'timeTime') {
                    cl(destField);
                    cl('in the IF statement');
                    let hrs = Math.floor(parseInt(srcValueSec) / 3600);
                    let remaining = parseInt(srcValueSec) % 3600;
                    let min = Math.floor(parseInt(remaining) / 60);
                    remaining = parseInt(remaining) % 60;
                    let sec = remaining % 60;
                    if (hrs.toString().length === 1){
                        hrs = '0' + hrs;
                    }
                    if (min.toString().length === 1){
                        min = '0' + min;
                    }
                    if (sec.toString().length === 1){
                        sec = '0' + sec;
                    }
                    let result = hrs +  ':' + min + ':' + sec;
                    document.getElementById(destField).value = result;
                } else {
                    let result = srcValueSec / timeMaths[destField];
                    if (result % 1 > 0) {
                        if (destField === 'timeMs') {
                            result = result.toFixed(0);
                        } else {
                            result = result.toFixed(3);                            
                        }
                    } else {
                      result = result.toFixed(0);
                      cl(result);
                    }
                    document.getElementById(destField).value = result;
                }
            })
        }
    }
    timeConvert.addEventListener('click', convertTime);


// DATE TIME - epoch2DateTime CONVERSION //
    function epoch2DateTime(epoch) {
        if (epoch.toString().length === 13) {
            epoch = epoch / 1000;
        }
        const date = new Date(epoch * 1000);
        const isoDateTime = date.toISOString();
        cl(isoDateTime);
        return isoDateTime;
    }
// DATE TIME - epochNow //
    function epochNow() {
        let now = new Date();
        return now
    }
// DATE TIME - dateTime2Epoch CONVERSION //
    function dateTime2Epoch(dateTime) {
        const epochTime = (new Date(dateTime)).getTime() / 1000;
        cl(epochTime);
        return epochTime;
    }

// DECLARE VARIABLES //
    epochInputElements = document.querySelectorAll('.epochInput');
    const dateElements = ['epochEpoch', 'epochDate', 'epochTime'];
    var dateCalcSource;

    epochInputElements.forEach(input => input.addEventListener('input', dateFocusInput));
    function dateFocusInput(e) {
        cl('testing.........EPOCH')
        dateCalcSource = e.target;
            cl('dateCalcSource.id is e.target');
            e.target.style.backgroundColor = 'white';
            e.target.style.color = 'black';
            e.target.style.border = '1px solid black';
            if (dateCalcSource.id === 'epochEpoch') {
                cl('dateCalcSource.id === epochEpoch');
                document.getElementById('epochDate').style.backgroundColor = 'rgba(0, 40, 90, 1.0)';
                document.getElementById('epochTime').style.backgroundColor = 'rgba(0, 40, 90, 1.0)';
                document.getElementById('epochDate').style.color = '#EDEDED';
                document.getElementById('epochTime').style.color = '#EDEDED';
                document.getElementById('epochDate').style.border = '1px solid #DDDDDD';
                document.getElementById('epochTime').style.border = '1px solid #DDDDDD';
            } else if (dateCalcSource.id === 'epochDate' || dateCalcSource.id === 'epochTime') {
                cl('dateCalcSource.id === epochDate || dateCalcSource.id === epochTime');
                document.getElementById('epochEpoch').style.backgroundColor = 'rgba(0, 40, 90, 1.0)';
                document.getElementById('epochEpoch').style.color = '#EDEDED';
                document.getElementById('epochEpoch').style.border = '1px solid #DDDDDD';
                document.getElementById('epochDate').style.backgroundColor = 'white';
                document.getElementById('epochTime').style.backgroundColor = 'white';
                document.getElementById('epochDate').style.color = 'black';
                document.getElementById('epochTime').style.color = 'black';
                document.getElementById('epochDate').style.border = '1px solid black';
                document.getElementById('epochTime').style.border = '1px solid black';
            }
    }

    function convertDate() {
        let srcType = dateCalcSource.id;
        let srcValue = dateCalcSource.value
        if (srcType === 'epochEpoch') {
            let dateTimeResult = epoch2DateTime(srcValue);
            dateTimeSplit = dateTimeResult.split('T');
            document.getElementById('epochDate').value = dateTimeSplit[0];
            document.getElementById('epochTime').value = dateTimeSplit[1].replace('.000Z', '');            
        } else if (srcType === 'epochDate' || srcType === 'epochTime') {
            let srcDate = document.getElementById('epochDate').value;
            let srcTime = document.getElementById('epochTime').value;
            if (srcDate === '' || srcDate.length != 10 || srcTime === '' || srcTime.length != 8) {
                alert('Date or Time are Blank');
                return;
            } else {
                let joinedSrcDate = srcDate + 'T' + srcTime + 'Z';
                cl(joinedSrcDate);
                document.getElementById('epochEpoch').value = dateTime2Epoch(joinedSrcDate) * 1000;
                cl(dateTime2Epoch(joinedSrcDate));
            }
        }
        // document.getElementById(destField).value = result;
    }

    epochConvert.addEventListener('click', convertDate);


})
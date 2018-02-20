var apikey = 'AIzaSyDXOy8IWEF8FpdCkZVgw8TIefPqfW360-E'
var daysofweek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
 
function currentlocaltime(divid, loc){
    var container = document.getElementById(divid)
    var targetDate = new Date() // Current date/time of user computer
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60 // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
    var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + apikey;
		
		console.log (apicall);
 
    var xhr = new XMLHttpRequest() // create new XMLHttpRequest2 object
    xhr.open('GET', apicall) // open GET request
    xhr.onload = function(){
        if (xhr.status === 200){ // if Ajax request successful
            var output = JSON.parse(xhr.responseText) // convert returned JSON string to JSON object
            console.log(output.status) // log API return status for debugging purposes
            if (output.status == 'OK'){ // if API reports everything was returned successfully
                var offsets = output.dstOffset * 1000 + output.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of target location
                var refreshDate = new Date() // get current date again to calculate time elapsed between targetDate and now
                var millisecondselapsed = refreshDate - targetDate // get amount of time elapsed between targetDate and now
                localdate.setMilliseconds(localdate.getMilliseconds()+ millisecondselapsed) // update localdate to account for any time elapsed
                setInterval(function(){
                    localdate.setSeconds(localdate.getSeconds()+1)
                    container.innerHTML = localdate.toLocaleTimeString() + ' (' + daysofweek[ localdate.getDay() ] + ')'
                }, 1000)
            }
        }
        else{
            alert('Request failed.  Returned status of ' + xhr.status)
        }
    }
    xhr.send() // send request
}
 
currentlocaltime('tokyotime', '35.731252, 139.730291')
currentlocaltime('latime', '34.052046, -118.259335')
currentlocaltime('torontotime', '43.656090, -79.387679')
currentlocaltime('paristime', '48.856805, 2.348242')

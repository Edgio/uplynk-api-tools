const filterStatus = []
// Ignore //
brokerid
capture_delay
cc_last_seen
connect_info
	ips
	public_ip
failover_healthy	
host_name	
method		
software
sys_info
	cpu
		cores
		loadavg
		process_cpu_usage
		rm_kb
		vm_kb
		eth0
			in_bytes_per_second
			out_bytes_per_second
		lo
			in_bytes_per_second
			out_bytes_per_second
	nvidia
		devices
		driver_version
		Ubuntu
use_brokers

const stateObj = ['response.state', 'response.signal', 'response.slicer_id', 'response.version', 'response.current_profile', 'response.lastBeamID']
const imageSoundObj = ['response.luma', 'response.vol'];
const timeObj = ['duration', 'uptime.uptime', 'uptime.created', 'uptime.now']
const frameObj = ['response.dropped', 'response.dropped_frames_usec', 'response.dropped_since_last']
const sliceProcessingObj = ['response.slices', 'response.slices_in_flight', 'response.source_queue_depth', 'response.delivered']
const connectionObj = ['response.connect_info.port', 'response.connect_info.ssl_port', 'response.connect_info.static_ip', 'response.connect_info.uplynk_dns']
const miscObj = ['response.meta', 'response.brokenzone', 'response.scte_last_seen']
//state
state
signal
slicer_id
version
current_profile
lastBeamID		// last asset ID
//image & sound
luma		// brightness
vol
//time
duration			// duration live stream
uptime
	uptime
	created
	now
//frame processing
dropped 	// dropped frames current beam
dropped_frames_usec		// gap duration in microseconds
dropped_since_last		// dropped frame in CMS Asset
//slice processing
slices 		// Slices encoded
slices_in_flight
source_queue_depth 	// packets waiting to be read by slicer
source_queue_max_depth	// max queue has been
delivered	// slices delivered to cloud storage
//network
connect_info
	port
	ssl_port
	static_ip
	uplynk_dns
//misc
meta		// metadata
brokerzone
scte_last_seen




let allocation = [];
let max = [];
let available = [];
let need = [];
let numProcesses = 0;
let numResources = 0;

function createTable() {
	// Get the number of processes and resources
	numProcesses = document.getElementById("numProcesses").value;
	numResources = document.getElementById("numResources").value;

	// Create the table header
	let tableHeader = "<br><tr><th>Process</th>";
	for (let i = 0; i < numResources; i++) {
		tableHeader += "<th>Resource " + i + "</th>";
	}
	tableHeader += "</tr>";

	// Create the table rows for allocation, max, and need
	let tableRows = "";
	for (let i = 0; i < numProcesses; i++) {
		// Create the row for allocation
		let rowAllocation = "<tr><td>Process " + i + " (Allocation)</td>";
		for (let j = 0; j < numResources; j++) {
			rowAllocation += "<td><input type='number' id='allocation-" + i + "-" + j + "'></td>";
		}
		rowAllocation += "</tr>";
		tableRows += rowAllocation;

		// Create the row for max
		let rowMax = "<tr><td>Process " + i + " (Max Need)</td>";
		for (let j = 0; j < numResources; j++) {
			rowMax += "<td><input type='number' id='max-" + i + "-" + j + "'></td>";
		}
		rowMax += "</tr>";
		tableRows += rowMax;
	}

	// Create the table rows for available
	let rowAvailable = "<tr><td>Available</td>";
	for (let i = 0; i < numResources; i++) {
		rowAvailable += "<td><input type='number' id='available-" + i + "'></td>";
	}
	rowAvailable += "</tr>";
	tableRows += rowAvailable;

	// Create the table
	let table = "<table>" + tableHeader + tableRows + "</table>";
	document.getElementById("table").innerHTML = table;
	document.getElementById("table").style.justifyContent = "center";
	document.getElementById("table").style.alignContent = "center";
	document.getElementById("table").style.display = "flex";
}

function calculate() {
	// Initialize the arrays
	allocation = [];
	max = [];
	available = [];
	need = [];
	for (let i = 0; i < numProcesses; i++) {
		allocation.push([]);
		max.push([]);
		need.push([]);
		for (let j = 0; j < numResources; j++) {
			allocation[i].push(parseInt(document.getElementById("allocation-" + i + "-" + j).value));
			max[i].push(parseInt(document.getElementById("max-" + i + "-" + j).value));
			need[i].push(max[i][j] - allocation[i][j]);
		}
	}
	for (let i = 0; i < numResources; i++) {
		available.push(parseInt(document.getElementById("available-" + i).value));
	}

	// Run the Banker's Algorithm
	let work = available.slice();
	let finish = [];
	for (let i = 0; i < numProcesses; i++) {
		finish.push(false);
	}
	let safeSequence = [];
	let numFinished = 0;
	while (numFinished < numProcesses) {
		let found = false;
		for (let i = 0; i < numProcesses; i++) {
			if (!finish[i] && checkNeedLessOrEqualWork(i, work)) {
				for (let j = 0; j < numResources; j++) {
					work[j] += allocation[i][j];
				}
				finish[i] = true;
				safeSequence.push(i);
				numFinished++;
				found = true;
				break;
			}
		}
		if (!found) {
			break;
		}
	}

	// Display the result
	if (numFinished == numProcesses) {
		document.getElementById("result").innerHTML = "Safe sequence: " + safeSequence;
	} else {
		document.getElementById("result").innerHTML = "Deadlock detected";
	}
}

function checkNeedLessOrEqualWork(process, work) {
	for (let i = 0; i < numResources; i++) {
		if (need[process][i] > work[i]) {
			return false;
		}
	}
	return true;
}

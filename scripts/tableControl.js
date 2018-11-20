/* Created by Keith Ennis
note to self debugger; (adds a break point) is usable even in f12
Planning the Project:
-------------------------
1. What do you want to make?
-------------------------    
To Do:
	I want bellow the table a section of risk assessment allowing a dynamic number of risks and an option sub section for mittigation for each risk.
	I want the ability to split the table and insert a title on any row and also allow import to handle multiple titled tables

Done: v2.3
	Fixed regex to allow blank rows or test environment information in the import data.
	I want to fix blank columns being trimmed to || screwing formating so export will insert a space.
	I want to have smarter heuristics to stop {non markup brackets} (solution \{ and \} \ will escape a special character) and 
Done: V2.0
	I want to add an import function to erase the visible table and replace it with appropriateley formatted markup text from an import field
Done: v2.0
	I want to convert the table format to BDD in nature
Done: V1.1
	I want to make a template to record Test server, branch, build.
	I want to make a template to record Test agent, Test Arsenal if applicable and a test table.
Done: V1.0 released
    I want to make a table with fixed columns and a dynamic number of rows the user can add and delete.
    I want the rows to be editable text boxes with the 3rd row being a boolian selection of tick cross or question mark pictures.
    The rows will be ||Test||Expected Result||Result||Notes||
    I want there to be a button that takes the text contents and creates a version with markup language.
    I want the markup conversion to be coppied to the clipboard for ctrl+V straight into a jira comment.
*/
//some usefull globals for the page layout and exporting text
var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $ImportBTN = $('#import-btn');
var $EXPORT = $('#export');
var $IMPORT = $('#import');
var $ROWCOUNT = 0;

/*for export button*/
function SelectText(element) {//selects the text inside a given html element refrenced by it's ID attribute
  var doc = document
      , text = doc.getElementById(element)
      , range, selection
  ;    
  if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
  } else if (window.getSelection) {
      selection = window.getSelection();        
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
  }
}


var markDownSanitisation = function(stringToSanitise){ //search for {stuff} and sanitise non markdown \{stuff\}
	var nonMarkdownResults = [];
	var allSearchResultsFromString = stringToSanitise.match(/(\{[^\{\}]+\})/g)//for spitting out an array of {stuff} found in a string (doesn't do {ne{st}ed} = {st})
	if (allSearchResultsFromString!==null){
		for (var i = 0; i < allSearchResultsFromString.length-1; i++) { //loop through the results sifting out only non markdown results
				switch(allSearchResultsFromString[i]){
					case allSearchResultsFromString[i] === "{quote}":
						break;
					case allSearchResultsFromString[i] === /(\{color)/:
						break;
					case allSearchResultsFromString[i] === /(\{anchor)/:
						break;
					case allSearchResultsFromString[i] === "{noformat}":
						break;
					case allSearchResultsFromString[i] === /(\{panel)/:
						break;
					case allSearchResultsFromString[i] === /(\{code)/:
						break;
					default:
						nonMarkdownResults.push(allSearchResultsFromString[i]);
				} //output an array of non markup accepted {stuff}
			};
		for (var j = 0; j < nonMarkdownResults.length-1; j++) { //Loop through the non markup accepted {stuff}
			var sanitisedResult = nonMarkdownResults[j];
			sanitisedResult.replace("{", "\{");
			sanitisedResult.replace("}", "\}");// turn the current  nonMarkdownResults into an escaped and safe version
			stringToSanitise.replace(nonMarkdownResults[j], sanitisedResult); //replace the string passed in with the sanitised version
			};
	};
	return stringToSanitise;//now sanitised string
};

var addRowFunction = function (jQueryObjectStuff, 
								columnGiven, 
								columnWhen, 
								columnThen, 
								columnResults, 
								columnNotes){

	$ROWCOUNT++;
	var $clone = $TABLE.find('tr.hide')
    .clone(true)
    .removeClass('hide table-line')
	.find("td[id='BDDGiven']")
    .attr('id', 'BDDGiven_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
	.find("td[id='BDDWhen']")
    .attr('id', 'BDDWhen_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
	.find("td[id='BDDThen']")
    .attr('id', 'BDDThen_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
	.find("td[id='notes']")
    .attr('id', 'notes_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
	.find('input:radio')
    .attr('name', 'toggle_option_' + $ROWCOUNT)
    .end()/* focus change from input radio back up to tr.hide*/
    .find("label[for='first_toggle_testFailed']")
    .attr('for', 'first_toggle_testFailed_' + $ROWCOUNT)
	.end()/* focus change from exact label back to tr.hide*/
    .find("input[id='first_toggle_testFailed']")
    .attr('id', 'first_toggle_testFailed_' + $ROWCOUNT)
    .end()/* focus change from exact input back to tr.hide*/
    .find("label[for='second_toggle_testNotComplete']")
    .attr('for', 'second_toggle_testNotComplete_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
    .find("input[id='second_toggle_testNotComplete']")
    .attr('id', 'second_toggle_testNotComplete_' + $ROWCOUNT)
    .end()/* focus change from exact input back to tr.hide*/
    .find("label[for='third_toggle_testPassed']")
    .attr('for', 'third_toggle_testPassed_' + $ROWCOUNT)
    .end()/* focus change from exact label back to tr.hide*/
    .find("input[id='third_toggle_testPassed']")
    .attr('id', 'third_toggle_testPassed_' + $ROWCOUNT)
    .end()/* focus change from exact input back to tr.hide*/
    .appendTo($TABLE.find('table'));

	if (columnGiven){//if columnGiven exists (aka is not undefined or null)
		columnGiven.trim();
		$('#BDDGiven_' + $ROWCOUNT).html(columnGiven);
		//$('#BDDGiven_' + $ROWCOUNT).html(/*'<td id = "BDDGiven_' + $ROWCOUNT + '" contenteditable="true">'+*/columnGiven/*+'</td>'*/);
		};
	if (columnWhen){
		columnWhen.trim();
		$('#BDDWhen_' + $ROWCOUNT).html(columnWhen);
		//$('#BDDWhen_' + $ROWCOUNT).html(/*'<td id = "BDDWhen_' + $ROWCOUNT + '" contenteditable="true">'+*/columnWhen/*+'</td>'*/);
		};
	if (columnThen){
		columnThen.trim();
		$('#BDDThen_' + $ROWCOUNT).html(columnThen);
		//$('#BDDThen_' + $ROWCOUNT).html(/*'<td id = "BDDThen_' + $ROWCOUNT + '" contenteditable="true">'+*/columnThen/*+'</td>'*/);
		};
	if (columnResults){
			switch (columnResults){
				case "(x)":
					$("label[for='second_toggle_testNotComplete_"+ $ROWCOUNT + "']")
					.find('input:radio')
					.removeAttr("checked")
					.end()
					.find("i[name='toggle_option_label']")
					.removeAttr("checked");//uncheck "?" which is it's default
					$("label[for='first_toggle_testFailed_"+ $ROWCOUNT + "']")
					.find('input:radio')
					.attr('checked', 'checked')
					.end()
					.find("i[name='toggle_option_label']")
					.attr('checked', 'checked');// check "x"
					break;
				case "(/)":
					$("label[for='second_toggle_testNotComplete_"+ $ROWCOUNT + "']")
					.find('input:radio')
					.removeAttr("checked")
					.end()
					.find("i[name='toggle_option_label']")
					.removeAttr("checked");//uncheck "?" which is it's default
					$("label[for='third_toggle_testPassed_"+ $ROWCOUNT + "']")
					.find('input:radio')
					.attr('checked', 'checked')
					.end()
					.find("i[name='toggle_option_label']")
					.attr('checked', 'checked');// check "x"
					break;
				//default: //"(?)" is it's initialisation state so no changes needed'
			};
		};
	if (columnNotes){
			columnNotes.trim();
			$('#notes_' + $ROWCOUNT).html(columnNotes);
			//$('#notes_' + $ROWCOUNT).html(/*'<td id = "notes_' + $ROWCOUNT + '" contenteditable="true">'+*/columnNotes/*+'</td>'*/);	
		};
};

/* cloning the hidden table line while also naming the radio buttons
and labels with an int so as to substantiate the line's features to be unique to that line*/
$('.table-add').click(addRowFunction);

$('.table-remove').click(function () {//delete a row
  $(this).parents('tr').detach();
});

$('.table-up').click(function () {//move a row up
  var $row = $(this).parents('tr');
  if ($row.index() === 1) return; // Don't go above the header
  $row.prev().before($row.get(0));
});

$('.table-down').click(function () {//move a row down
  var $row = $(this).parents('tr');
  $row.next().after($row.get(0));
});

$("#serverSwitch").click(function() {//test environment server info on/off
    $("#serverName").attr('disabled',! this.checked);
});

$("#arsenalSwitch").click(function() {//test environment arsenal info on/off
    $("#arsenalName").attr('disabled',! this.checked);
});

$("#branchSwitch").click(function() {//test environment branch info on/off
    $("#branchName").attr('disabled',! this.checked);
	$("#branchNameURL").attr('disabled',! this.checked);
});

$("#buildSwitch").click(function() {//test environment build info on/off
    $("#buildCommit").attr('disabled',! this.checked);
	$("#buildCommitURL").attr('disabled',! this.checked);
});

$("#agentSwitch").click(function() {//test environment agent info on/off
    $("#agentBuild").attr('disabled',! this.checked);
	$("#agentBuildURL").attr('disabled',! this.checked);
});

$("#tableNameSwitch").click(function() {//test table name on/off
    $("#tableName").attr('disabled',! this.checked);
});
// A few jQuery helpers for row movement and exporting
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');//store for all the visible rows
  var data = [];
  var headerLine = $rows.shift();//the first row will be just headers
  var constructheaderline = "||";// building the header row in markup
  
  var serverLine = "Server Name: " + $("#serverName").val();
	if ($("#serverName").attr('disabled') !== 'disabled'){
		markDownSanitisation(serverLine);//function to check for {stuff} insert here
		data.push(serverLine);
  }

  var arsenalLine = "Arsenal: " + $("#arsenalName").val();
	if ($("#arsenalName").attr('disabled') !== 'disabled'){
		markDownSanitisation(arsenalLine);//function to check for {stuff} insert here
		data.push(arsenalLine);
  }

  var branchLine = "Branch: [" + $("#branchName").val() + "|" + $("#branchNameURL").val() + "]";
	if ($("#branchName").attr('disabled') !== 'disabled'){
		markDownSanitisation(branchLine);//function to check for {stuff} insert here
		data.push(branchLine);
  }
  
  var buildLine = "Build: [" + $("#buildCommit").val() + "|" + $("#buildCommitURL").val() + "]";
	if ($("#buildCommit").attr('disabled') !== 'disabled'){
		markDownSanitisation(buildLine);//function to check for {stuff} insert here
		data.push(buildLine);
  }
  
  var agentLine = "Agent: ["+ $("#agentBuild").val() + "|" + $("#buildCommitURL").val() + "]";
	if ($("#agentBuild").attr('disabled') !== 'disabled'){
		markDownSanitisation(agentLine);//function to check for {stuff} insert here
		data.push(agentLine);
  }
  
  var tableNameLine = "h2. " + $("#tableName").val();
	if ($("#tableName").attr('disabled') !== 'disabled'){
		markDownSanitisation(tableNameLine);//function to check for {stuff} insert here
		data.push(tableNameLine);
  }

  constructheaderline+= $(headerLine).find('th:nth-child(1)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(2)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(3)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(4)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(5)').text() + "||";
  data.push(constructheaderline);
  
  $($rows).each(function (index) { // start a function that goes through each tr
    var radioCharacter;// store the markup version of the selected radio
    var constructedLine = "|";// building the row in markup and forcing a space for formatting quirks in JIRA
    var radioCheckedID = $(this).find('input:checked').attr('id');// the selected radio id

    constructedLine+=$(this).find('td:nth-child(1)').text() + "|";//Given section and forcing a space for formatting quirks in JIRA
    constructedLine+=$(this).find('td:nth-child(2)').text() + "|";//When section
	constructedLine+=$(this).find('td:nth-child(3)').text() + "|";//Then section
    
    switch(true){//radio selection
      case radioCheckedID.startsWith("first_toggle_testFailed"):
        radioCharacter = "(x)";
        break;
      case radioCheckedID.startsWith("third_toggle_testPassed"):
        radioCharacter = "(/)";
        break;
      default:
        radioCharacter = "(?)";
      }//default not tested and check for fail pass
    
    constructedLine+=radioCharacter + "|";//forcing a space for notes formatting quirks in JIRA
    constructedLine+=$(this).find('td:nth-child(5)').text() + "|";//notes
	
	markDownSanitisation(constructedLine);//function to escape {} characters that are not valid markdown to stop table disruption
	constructedLine=constructedLine.replace(/\|\|/g, "| |");// inserts a space into empty columns so they render in jira
	data.push(constructedLine);//push the finished line into an array for exporting
  });
  
  // Output the array of rows ending each line with a carridge return to the pre formatted element with the id 'export'
  $EXPORT.text(data.join("\n"));
  SelectText('export');//highlight the export
  document.execCommand('copy');//copy to clipboard ready for pasta
});

$ImportBTN.click(function () {
//make the import button grab the content editable stuff and reverse flow the export stuff
	var importData = $IMPORT.text().split('\n');//fill the array with lines of data
	var firstServerNameFound = false;
	var firstArsenalNameFound = false;
	var firstBranchNameFound = false;
	var firstBuildCommitFound = false;
	var firstAgentBuildFound = false;
	var firstTableNameFound = false;
	var firstTableHeaderFound = false;
	var doneFindingRelevantData = false;
	var doLoop = -1;//need -1 so doloop starts at array 0 since doloop preceeds code
	if (importData !== null){//start searching if we have data
		do {
		
			doLoop++;

			if (doLoop>importData.length-1){//check to see if the doloop has gone past the end of the import data array into undefined space
					break//break the do while loop if we're in undefined array territory
				};
			
			var searchResult;
				
			if (firstServerNameFound===false){// as long as we haven't found a server line already search for one
				searchResult = importData[doLoop].match(/Server Name: (.*)/);//is this line a match for what we consider a server line
				if (searchResult !== null){// do something with this line as long as it's a match'
					var firstServerName = searchResult[1];//regex pre crops the "Server: " text and stores the rest in array index 1
					$.trim(firstServerName);//trim off any pre or post whitespace the user left
					$('#serverSwitch').attr('checked', 'checked');// tick the checkbox
					$('#serverName').removeAttr("disabled");// Enable the text box
					$('#serverName').val(firstServerName);// populate the text box
					firstServerNameFound = true;// we found what we wanted so no need to search for more server name lines
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstArsenalNameFound===false){// as long as we haven't found an Arsenal line already search for one
				searchResult = importData[doLoop].match(/Arsenal: (.*)/);//is this line a match for an Arsenal line
				if (searchResult !== null){// do something if a match is found
					var firstArsenalName = searchResult[1];//regex pre crops the "Arsenal: " text and stores the rest in array index 1
					$.trim(firstArsenalName);// polish, activate, and populate the Arsenal name field section
					$('#arsenalSwitch').attr('checked', 'checked');
					$('#arsenalName').removeAttr("disabled");
					$('#arsenalName').val(firstArsenalName);
					firstArsenalNameFound = true;// we found what we wanted so no need to search for more Arsenal name lines
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstBranchNameFound===false){// as long as we haven't found a branch line already search for one
				searchResult = importData[doLoop].match(/Branch: \[(.*)\|(.*)\]/);//is this line a match for a Branch line
				if (searchResult !== null){// do something if a match is found
					firstBranchName = searchResult[1];//regex pre crops the "branch: " and splits the name and URL into index 1 and 2 respectively
					firstBranchNameURL = searchResult[2];
					$.trim(firstBranchName);// polish, activate, and populate the Branch name field sections
					$.trim(firstBranchNameURL);
					$('#branchSwitch').attr('checked', 'checked');
					$('#branchName').removeAttr("disabled");
					$('#branchNameURL').removeAttr("disabled");
					$('#branchName').val(firstBranchName);
					$('#branchNameURL').val(firstBranchNameURL);
					firstBranchNameFound = true;// we found what we wanted so no need to search for more Branch name lines
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstBuildCommitFound===false){// as long as we haven't found a Build line already search for one
				searchResult = importData[doLoop].match(/Build: \[(.*)\|(.*)\]/);//regEx updated to do 2 groups around [| and |] for the return array to seperate name and url
				if (searchResult !== null){
					firstBuildCommit = searchResult[1];
					firstBuildCommitURL = searchResult[2];
					$.trim(firstBuildCommit);
					$.trim(firstBuildCommitURL);
					$('#buildSwitch').attr('checked', 'checked');
					$('#buildCommit').removeAttr("disabled");
					$('#buildCommitURL').removeAttr("disabled");
					$('#buildCommit').val(firstBuildCommit);
					$('#buildCommitURL').val(firstBuildCommitURL);
					firstBuildCommitFound = true;// we found what we wanted so no need to search for more Branch name lines
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstAgentBuildFound===false){// as long as we haven't found a Build line already search for one
				searchResult = importData[doLoop].match(/Agent: \[(.*)\|(.*)\]/);//regEx updated to do 2 groups around [| and |] for the return array to seperate name and url
				if (searchResult !== null){
					firstAgentBuild = searchResult[1];
					firstAgentBuildURL = searchResult[2];
					$.trim(firstAgentBuild);
					$.trim(firstAgentBuildURL);
					$('#agentSwitch').attr('checked', 'checked');
					$('#agentBuild').removeAttr("disabled");
					$('#agentBuildURL').removeAttr("disabled");
					$('#agentBuild').val(firstAgentBuild);
					$('#agentBuildURL').val(firstAgentBuildURL);
					firstAgentBuildFound = true;
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstTableNameFound===false){// as long as we haven't found a Build line already search for one
				searchResult = importData[doLoop].match(/h2\. (.*)/);//regEx updated to do 1 group after "h2. "
				if (searchResult !== null){
					firstTableName = searchResult[1];
					$.trim(firstTableName);
					$('#tableNameSwitch').attr('checked', 'checked');
					$('#tableName').removeAttr("disabled");
					$('#tableName').val(firstTableName);
					firstTableNameFound = true;
					continue; //breaks out of this loop as we found what we wanted on this line
					};
				};
			if (firstTableHeaderFound===false){//exact match only
				searchResult = importData[doLoop].match("||Given||When||Then||Result||Notes||");
				if (searchResult !== null){//notify the loop we found one so don't need to keep looking for one'
					firstTableHeaderFound = true;
					continue;
					};
				};
			
			searchResult = importData[doLoop].match(/\|(.*)\|(.*)\|(.*)\|(\([x?/]\))\|(.*)\|/)//table data in expected format
			if (searchResult !== null){//if we have found table data call our new row function and pass in new default parameters
				addRowFunction(null,searchResult[1],searchResult[2],searchResult[3],searchResult[4],searchResult[5]);//first param is for jquery on click stuff
				continue;
				};

			doneFindingRelevantData = true;//nothing usable left to loop through
			} while (doneFindingRelevantData !== true);//importing completed
		};
	});

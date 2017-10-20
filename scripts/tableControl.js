/* Created by Keith Ennis
Planning the Project:
-------------------------
1. What do you want to make?
-------------------------    
To Do:
    I want to make a template to record Test server, branch, build, agent if applicable and a test table.
    I want bellow the table a section of risk assessment allowing a dynamic number of risks and an option sub section for mittigation for each risk.
Done: V1.0
    I want to make a table with fixed columns and a dynamic number of rows the user can add and delete.
    I want the rows to be editable text boxes with the 3rd row being a boolian selection of tick cross or question mark pictures.
    The rows will be ||Test||Expected Result||Result||Notes||
    I want there to be a button that takes the text contents and creates a version with markup language.
    I want the markup conversion to be coppied to the clipboard for ctrl+V straight into a jira comment.
*/
//some usefull globals for the page layout and exporting text
var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');
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

/* cloning the hidden table line while also naming the radio buttons
and labels with an int so as to substantiate the line's features to be unique to that line*/
$('.table-add').click(function () {
  $ROWCOUNT++;
  var $clone = $TABLE.find('tr.hide')
    .clone(true)
    .removeClass('hide table-line')
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
    .appendTo($TABLE.find('table')) ;
});

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

// A few jQuery helpers for row movement and exporting
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.click(function () {
  var $rows = $TABLE.find('tr:not(:hidden)');//store for all the visible rows
  var data = [];
  var headerLine = $rows.shift()//the first row will be just headers
  var constructheaderline = "||";// building the header row in markup

  constructheaderline+= $(headerLine).find('th:nth-child(1)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(2)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(3)').text() + "||";
  constructheaderline+= $(headerLine).find('th:nth-child(4)').text() + "||";
  data.push(constructheaderline);
  
  $($rows).each(function (index) { // start a function that goes through each tr
    var radioCharacter;// store the markup version of the selected radio
    var constructedLine = "|";// building the row in markup
    var radioCheckedID = $(this).find('input:checked').attr('id');// the selected radio id

    constructedLine+=$(this).find('td:nth-child(1)').text() + "|";//test
    constructedLine+=$(this).find('td:nth-child(2)').text() + "|";//expected result
    
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
    
    //constructedLine+=radioCheckedID + "|";
    constructedLine+=radioCharacter + "|";
    constructedLine+=$(this).find('td:nth-child(4)').text() + "|";//notes
    
    data.push(constructedLine);//push the finished line into an array for exporting
  });
  
  // Output the array of rows ending each line with a carridge return to the pre formatted element with the id 'export'
  $EXPORT.text(data.join("\n"));
  SelectText('export');//highlight the export
  document.execCommand('copy');//copy to clipboard ready for pasta
});
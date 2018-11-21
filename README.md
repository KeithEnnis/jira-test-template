# jira-test-template
Version 2 shows changes to the layout and functionality for the new direction the usability has taken <br>
Version 2.2 fixes exporting an imported table<br>
Version 2.3 fixes { characters disrupting the table unless they are markdown language<br>
Version 2.3 fixes a blank column || screwing table formating in jira by inserting a space<br>
Version 2.3 fixes blank column || or test environment data in the import box screwing up the import<br>
<br>
Known issues<br>
non at this time <br>
<br>
Usage:<br>
Should be self explanatory just run index.html in your browser<br>
(preferably chrome, should work in FF too)<br>
Warning no save functionality yet so becarefull with F5 before you export.<br>
<br>
There are now 4 additions to allow a neat environment information section<br>
Each section will need to be ticked to enable it's inclusion in the export<br>
Branch, Build and Agent allow url links to be created to the relevent sources<br>
The table itself is now BDD driven in it's content style, this is to help facilitate writing BDD test cases and transitioning some or all of them to automation.<br>
The Export button continues to prep the table ready for pasting<br>
The Import button now will set test environment information and add table rows for any correctly formatted contents pasted in.(matches export format).<br>
<br>
If you have any problems or feedback feel free to poke me<br>

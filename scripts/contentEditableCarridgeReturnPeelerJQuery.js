$('[contenteditable]').on('paste', function(eventPassedIn) {// when pasting into a contenteditable
     	var $self = $(this);
      setTimeout(function() {//immediately
       	$self.html($self.text());//convert to HTML thus removing line breaks
       }, 0);
    }).on('keypress', function(eventPassedIn){//when a key is pressed
    	 return eventPassedIn.which != 13;// dont recognise the return key being pressed
    });//keeps /n out of the text fields in the table so it doesn't screw up the export formatting.

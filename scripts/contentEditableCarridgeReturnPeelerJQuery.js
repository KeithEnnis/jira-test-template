$('[contenteditable]').on('paste', function(eventPassedIn) {
     	var $self = $(this);
      setTimeout(function() {
       	$self.html($self.text());
       }, 0);
    }).on('keypress', function(eventPassedIn){
    	 return eventPassedIn.which != 13;
    });//keeps /n out of the text fields in the table so it doesn't screw up the export formatting.
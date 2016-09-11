$('#articleBtn').on('click', function(){
    $('#articles').empty();

    $.ajax({
      method: "GET",
      url: "/scrape"
    }).done(function() {
      console.log("articles scraped!")
      location.reload(); 
    })
});


// grab the articles as a json

$.getJSON('/ratings', function(data) {

  for(var i = 0; i<data.length; i++){
    if (data[i].rating == undefined) {
      console.log('No ratings available')
    }
    else{
    $('#list').append('<li>' + '<a href=http://nycfc.com' + data[i].link + ' target="_blank">' + data[i].title + '</a>' + '<br>' + 'Rating: ' + data[i].rating + '</li>');
    $('#list').append('<br>');
    }
  }
})

$.getJSON('/articles', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    
    $('#articles').append('<h4 data-id="' + data[i]._id + '">' + '<a href=http://nycfc.com' + data[i].link + ' target="_blank">' + data[i].title + '</a></h4>');
      
  }
})

// whenever someone clicks a p tag
$(document).on('click', 'h4', function(){
  // empty the notes from the note section
  $('#notes').empty();
  // save the id from the p tag
  var thisId = $(this).attr('data-id');

  // now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    // with that done, add the note information to the page
    .done(function( data ) {
      console.log(data);
      // the title of the article
      $('#notes').append('<h3>' + data.title + '</h3>'); 
      // an input to enter a new title
      //$('#notes').append('<input id="titleinput" name="title" >'); 
      // a textarea to add a new note body
      $('#notes').append('<label for="comment">Notes:</label>')
      $('#notes').append('<textarea class="form-control" rows=4 id="bodyinput" name="body"></textarea>');
      $('#notes').append('<br>')
      $('#notes').append('<label for="select">Rating:</label>')
      $('#notes').append('<select class="form-control input-small" id="ratingSelect"><option value="1">1(Low)</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5(High)</option></select>') 
      // a button to submit a new note, with the id of the article saved to it
      $('#notes').append('<br>')
      $('#notes').append('<button class="btn btn-custom btn-sm" data-id="' + data._id + '" id="savenote">Submit</button>');

      // if there's a note in the article
      if(data.note){
        // place the title of the note in the title input
        //$('#titleinput').val(data.note.title);
        // place the body of the note in the body textarea
        $('#bodyinput').val(data.note.body);
      }
    });
});

// when you click the savenote button
$(document).on('click', '#savenote', function(){
  // grab the id associated with the article from the submit button
  var thisId = $(this).attr('data-id');
  var thisRating = $('#ratingSelect').val();
  console.log('Rating for this article is: ' + thisRating);

  $.ajax({
    method: "POST",
    url: "/update/" + thisId + "/" + thisRating,
  }).done(function(data){
    console.log(data);
  })

  // run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
     // rating: $('#ratingSelect').val(), // value taken from title input
      body: $('#bodyinput').val() // value taken from note textarea
    }
  })
    // with that done
    .done(function( data ) {
      // log the response
      console.log(data);
      // empty the notes section
      $('#notes').empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $('#titleinput').val("");
  $('#bodyinput').val("");

  location.reload();
});
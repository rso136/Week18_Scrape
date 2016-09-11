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

  for (var i = 0; i<data.length; i++){
    
    $('#articles').append('<h4 data-id="' + data[i]._id + '">' + '<a href=http://nycfc.com' + data[i].link + ' target="_blank">' + data[i].title + '</a></h4>');
      
  }
})

$(document).on('click', 'h4', function(){

  $('#notes').empty();

  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })

    .done(function( data ) {
      console.log(data);

      $('#notes').append('<h3>' + data.title + '</h3>'); 
      $('#notes').append('<label for="comment">Notes:</label>')
      $('#notes').append('<textarea class="form-control" rows=4 id="bodyinput" name="body"></textarea>');
      $('#notes').append('<br>')
      $('#notes').append('<label for="select">Rating:</label>')
      $('#notes').append('<select class="form-control input-small" id="ratingSelect"><option value="1">1(Low)</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5(High)</option></select>') 
      $('#notes').append('<br>')
      $('#notes').append('<button class="btn btn-custom btn-sm" data-id="' + data._id + '" id="savenote">Submit</button>');

      if(data.note){
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#savenote', function(){

  var thisId = $(this).attr('data-id');
  var thisRating = $('#ratingSelect').val();
  console.log('Rating for this article is: ' + thisRating);

  $.ajax({
    method: "POST",
    url: "/update/" + thisId + "/" + thisRating,
  }).done(function(data){
    console.log(data);
  })

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      body: $('#bodyinput').val() 
    }
  })

    .done(function( data ) {

      console.log(data);

      $('#notes').empty();
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");

  location.reload();
});
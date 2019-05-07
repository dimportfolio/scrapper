// Grab the articles as a json
$("#scrape").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
})
$("#home").on("click", function() {
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
    //   $("#articles").append("<p data-id='" + data[i]._id + "'><h2>" + data[i].title + "</h2><br />" + data[i].link + "<button id=saveArticle> save article </button>"+ "</p>");
      $("#articles").append(`<div data-id= ${data[i]._id}>
      <p article-id=${i}> ${data[i].title}
      <a href="${data[i].link}">visit link</a>
      <button id=saveArticle> save article </button>
      </p>
      </div>`);
    }
  });
})

$("#save").on("click", function() {
    $("#articles").empty();
    $("#notes").empty();
    $.getJSON("/saved", function(data) {
        console.log(data);
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
          //   $("#articles").append("<p data-id='" + data[i]._id + "'><h2>" + data[i].title + "</h2><br />" + data[i].link + "<button id=saveArticle> save article </button>"+ "</p>");
            $("#saved").append(`<div data-id= ${data[i]._id}>
            <p article-id=${data[i].article}> ${data[i].title}
            <a href="${data[i].link}">visit link</a>
            <button id=createNote> Create Note </button>
            </p>
            </div>`);
          }
      });
    })  
  
  // Whenever someone clicks a p tag
  $(document).on("click","#createNote",function() {
//   $("#createNote").on("click", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).parent().attr("article-id");
    console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new ynote, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        // If there's a note in the article
        if (data.comment) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.comment.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.comment.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/saved/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
    // When you click the savenote button
    $(document).on("click", "#saveArticle", function() {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).parent().parent().attr("data-id");
        console.log(thisId);
        // var title = $(this).parent().text();
        // console.log(title);
        // var link = $(this).find("a").val();
        // console.log(link);

        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        }).then(function(data){
            console.log(data);
            $.ajax({
                method: "POST",
                url: "/saved/",
              //   url: "/saved/" + thisId,
                data: {
                  // Value taken from title input
                  title: data.title,
                  article: data._id,
                  link: data.link
                  // Value taken from note textarea
                  // body: $("#bodyinput").val()
                }
              })
                // With that done
                .then(function(data) {
                  // Log the response
                  console.log(data);
                  // Empty the notes section
                  $("#notes").empty();
                });
        })
        // console.log(thisId);
        // Run a POST request to change the note, using what's entered in the inputs
        
      
        // Also, remove the values entered in the input and textarea for note entry
        $("#titleinput").val("");
        $("#bodyinput").val("");
      });
      
    
// grab the articles as a json
$.getJSON("/articles", function (data) {
    //for each one
    for (var ctr = 0; ctr < data.length; ctr++) {
        //display the information on the page
        $("#articles").append("<p data-id='" + data[ctr]._id + "'>" + data[ctr].title + "<br />" + data[ctr].link + "</p>");
    }
});

// whenever someone clicks a p tag
$(document).on("click", "p", function () {
    //empty the notes from the note section
    $("#notes").empty();
    //save the id from the p tag
    var thisid = $(this).attr("data-id");

    // now make an ajax call for the article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisid
        })
        // then add the note information to the page
        .then(function (data) {
            console.log(data);
            //the title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            //an input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            //a textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // a button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            //if theres a note in the article
            if (data.note) {
                //place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

//when you click the savenote button
$(document).on("click", "#savenote", function () {
    //grab the id associated with the article from the submit button

    var thisid = $(this).attr("data-id");

    // run a POST request to change the note using whats entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisid,
        data: {
            //value taken from title input
            title: $("#titleinput").val(),
            //value taken from note textarea
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        //log the response
        console.log(data);
        //empty the notes section
        $("#notes").empty();
    });

    //also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
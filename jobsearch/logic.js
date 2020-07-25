$(document).ready(function () {



    // function that calls the GitHub Jobs API for pulling data based on the job search jobSearchs that were inputted (both job search terms and city search term)
    function jobSearch(jobQuery) {
        console.log("jobQuery: ", jobQuery);

        $.ajax({
            url: jobQuery,
            method: "GET"
        })
            .then(function (jobResults) {
                $("#jobSection").empty();
                
                // if no job openings are available, provide a message stating so
                if (jobResults == '') {
                    var cityTerm = $("#citySearch").val().trim();
                    var errorMsg = $("<p>").append("<h3>Bummer! No job openings are currently available in " + cityTerm + ".</h3>");
                    errorMsg.attr("style", "text-align: center")
                    $("#jobSection").append(errorMsg);
                }
                // confirm if ajax call pulled the right data (e.g., job openings and city location) 
                console.log("Title: " + jobResults[0].title);
                console.log("Location: " + jobResults[0].location);
                //debugger;

                // goes through all job postings based on the input values
                for (var i = 0; i < jobResults.length; i++) {
                    //debugger;
                    // creates main div for job listing and adds attribute to the specific job posting
                    var jobDiv = $("<div>");
                    jobDiv.attr("id", "jobResults" + i);
                    // creates a separate div for the position and pulls the job title of the job listing and creates a hyperlink to the job posting webpage
                    var jobTitleDiv = $("<a>").append("<h4><p>" + jobResults[i].title + "</p></h4>");
                    jobTitleDiv.attr("href", jobResults[i].url);
                    // opens the webpage in a separate tab
                    jobTitleDiv.attr("target", "_blank");

                    // creates a separate div for the job location (e.g., suburb or cities nearby the city search input)
                    var jobLocationDiv = $("<p>").append("Located in: " + jobResults[i].location);

                    // appends the divs into the parent div for the job search results
                    $("#jobSection").append(jobDiv, jobTitleDiv, jobLocationDiv);

                }

            });

    }

    // creates variable for API key for the OpenWeatherAPI call 
    var authKey = "60491f0ae881db1d21b8fc251fe7e947";

    // function that runs the query for the city that was searched for and dynamically pulls all the weather parameters to populate on the webpage
    function runQuery(newLink) {

        console.log("newLink: ", newLink)

        $.ajax({
            url: newLink,
            method: "GET"
        })
            .then(function (WeatherData) {

                $("#weatherSection").empty();

                //start dumping to html
                var sectionCard = $("<div>");

                // sectionCard.addClass("card");
                sectionCard.attr("id", "articleCard");
                // sectionCard.addClass("border border-secondary");
                $("#weatherSection").append(sectionCard);
                //attach the content the appropiate well
                $("#articleCard").append("<h2>" + WeatherData.city.name + "</h2>");
                $("#articleCard").append("<h5>" + WeatherData.list[0].weather[0]['main'] + ": " + "</h5>" + "<img src=" + "https://openweathermap.org/img/wn/" + WeatherData.list[0].weather[0]['icon'] + "@2x.png" + " width=" + "150px" + "height=" + "150px>");
                $("#articleCard").append("<h4>" + "<p><b> Temperature: </b>" + ((WeatherData.list[1].main.temp - 273.15) * 9 / 5 + 32).toFixed(1) + "°F" + "</p> </h4>");
                $("#articleCard").append("<h4><p>But it feels like: " + ((WeatherData.list[1].main.feels_like - 273.15) * 9 / 5 + 32).toFixed(1) + "°F" + " </p></h4>");
                $("#articleCard").append("<h4>Description: </h4><h5>" + WeatherData.list[0].weather[0]['description'] + "</h5>");
                $("#articleCard").append("<h4> Humidity: </h4><h5>" + WeatherData.list[0].main.humidity + "%</h5>");
                //console.log(WeatherData.list[0].weather[0]['icon'])

            });
    }

    // prompts the program to collect values inputted and begin functions upon clicking the 'search' button
    $("#search").on("click", function (event) {
        event.preventDefault();
        // get city search term
        var cityTerm = $("#citySearch").val().trim().split(" ").join("+");

        // creates a variable to store the value of the input for the job search term
        var jobTerm = $("#jobSearch").val().trim();

        //add in both the city and job search terms to their respective API query URLs
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityTerm + "&appid=" + authKey;
        var jobQueryURL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?description=" + jobTerm + "&location=" + cityTerm;

        // runs the respective functions for retrieving data on the job openings and the weather for the city that was searched for
        runQuery(queryURL);
        jobSearch(jobQueryURL);
        //debugger;

    })

    // clears all entries and populated data when you click on the 'clear' button
    $("#clear").on("click", function (event) {
        event.preventDefault();
        $("#jobSearch").val('');
        $("#citySearch").val('');
        $("#weatherSection").empty();
        $("#jobSection").empty();

    })
});

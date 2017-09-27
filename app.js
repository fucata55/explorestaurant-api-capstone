//Step 1. Get user input
//Can input type text be submitted by "enter" button, without having "submit" button
$('.input-box').on('click', function (event) {
    event.preventDefault();
    let userInput = $('input').val();
    console.log(userInput);
    getZomatoLocation(userInput);
    //    getZomatoResults(userInput);
    getYoutubeResults(userInput);
})

//step 2. Get JSON response from zomato

function getZomatoLocation(userSearchTerm) {


    /* Update all the parameters for your API test*/
    var params = {
        query: userSearchTerm
    };
    var result = $.ajax({
            /* update API end point */
            url: "https://developers.zomato.com/api/v2.1/locations",
            data: params,
            dataType: "json",
            /*set the call type GET / POST*/
            type: "GET",
            headers: {
                "Accept": "application/json",
                "user-key": "526eb86cb3e39c4e5f4fa9ba0031fbf0"
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function (receivedApiData) {
            /* if the results are meeningful, we can just console.log them */
            console.log(receivedApiData);
            let entity_id = receivedApiData.location_suggestions[0].entity_id;
            let entity_type = receivedApiData.location_suggestions[0].entity_type;
            console.log(entity_id, entity_type);
            //            return [entity_id, entity_type];
            getZomatoResults(entity_id, entity_type);
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//Must request entity Id  & location Id first, before requesting restaurants in the area
function getZomatoResults(entityId, entityType) {
    /* Update all the parameters for your API test*/
    var params = {
        "entity_id": entityId,
        "entity_type": entityType,
    };
    var result = $.ajax({
            /* update API end point */
            url: "https://developers.zomato.com/api/v2.1/location_details",
            data: params,
            dataType: "json",
            /*set the call type GET / POST*/
            type: "GET",
            headers: {
                "Accept": "application/json",
                "user-key": "526eb86cb3e39c4e5f4fa9ba0031fbf0"
            }
        })
        /* if the call is successful (status 200 OK) show results */
        .done(function displayRestaurants(receivedApiDataLocation) {
            /* if the results are meeningful, we can just console.log them */
            console.log(receivedApiDataLocation);
            displayZomatoResults(receivedApiDataLocation)
        })
        /* if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

//step 3. Get JSON response from Youtube
function getYoutubeResults(userSearchTerm) {
    $.getJSON('https://www.googleapis.com/youtube/v3/search', {
        q: userSearchTerm,
        part: 'snippet',
        key: 'AIzaSyAuQxnyeTiG2xHqYKu3EDRxP9owZqfiAjc',
        maxResults: 10,
        type: 'video',
    }, displayYoutubeResults())
    //    console.log('getYoutubeResults ran')
}

//step 4. Plug new HTML in with data form JSON response in the appropriate locations
function displayZomatoResults(apiResponse) {
    $('.zomato-outputs').empty();
    for (let i = 0; i < apiResponse.best_rated_restaurant.length; i++) {
        let restaurantName = apiResponse.best_rated_restaurant[i].restaurant.name;
        let restaurantImage = apiResponse.best_rated_restaurant[i].restaurant.featured_image;
        let restaurantStreet = apiResponse.best_rated_restaurant[i].restaurant.location.address;
        let restaurantCity = apiResponse.best_rated_restaurant[i].restaurant.location.locality_verbose;
        //        console.log(restaurantName, restaurantImage, restaurantStreet, restaurantCity);
        $('.zomato-outputs').append(`
            <div class='zomato-output'>
            <img src="${restaurantImage}" class='zomato-output-image' alt="">
            <h3 class='zomato-output-restaurant-name'>${restaurantName}</h3>
            <p class='zomato-output-restaurant-street'>${restaurantStreet}</p>
            <p class='zomato-output-restaurant-state'>${restaurantCity}</p>
            </div>`)
    }

}

function displayYoutubeResults(results) {
    console.log('displayYoutubbeResults() ran')
    $('.youtube-outputs').empty();
    let videoImage = results.snippet.thumbnails.high.url;
    let videoName = results.snippet.title;
    let videoLink = results.id.videoId
    $('.youtube-outputs').append(`
    <div class='youtube-output'>
    <a href='https://www.youtube.com/watch?v=" + ${videoLink} + "' target='_blank'>"
    <img src="${videoImage}" class='youtube-output-image' alt="">
    </a>
    <h3 class='zomato-output-restaurant-name'>${videoName}</h3>
    </div>`)
}

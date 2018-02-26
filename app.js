//Step 1. Get user input
$('.search-query').submit(function (event) {
    event.preventDefault();
    let userInput = $('.input-box').val();
    getZomatoLocation(userInput);
    getYoutubeResults('best food in ' + userInput);
    $('main').show();
    $('.input-box').val('')
})

//step 2. Get JSON response from zomato

function getZomatoLocation(userSearchTerm) {


//Update all the parameters for your API test*/
    var params = {
        query: userSearchTerm
    };
    var result = $.ajax({
            url: "https://developers.zomato.com/api/v2.1/locations",
            data: params,
            dataType: "json",
            type: "GET",
            headers: {
                "Accept": "application/json",
                "user-key": "526eb86cb3e39c4e5f4fa9ba0031fbf0"
            }
        })
            //if the call is successful (status 200 OK) show results
        .done(function (receivedApiData) {
            let entity_id = receivedApiData.location_suggestions[0].entity_id;
            let entity_type = receivedApiData.location_suggestions[0].entity_type;
            getZomatoResults(entity_id, entity_type);
        })
            //if the call is NOT successful show errors */
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//Must request entity Id  & location Id first, before requesting restaurants in the area
function getZomatoResults(entityId, entityType) {
    var params = {
        "entity_id": entityId,
        "entity_type": entityType,
    };
    var result = $.ajax({
            url: "https://developers.zomato.com/api/v2.1/location_details",
            data: params,
            dataType: "json",
            type: "GET",
            headers: {
                "Accept": "application/json",
                "user-key": "526eb86cb3e39c4e5f4fa9ba0031fbf0"
            }
        })
        .done(function displayRestaurants(receivedApiDataLocation) {
            displayZomatoResults(receivedApiDataLocation)
        })
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
    }, displayYoutubeResults)
}

//step 4. Plug new HTML in with data form JSON response in the appropriate locations
function displayZomatoResults(apiResponse) {
    $('.zomato-outputs').empty();
    for (let i = 0; i < apiResponse.best_rated_restaurant.length; i++) {
        let restaurantName = apiResponse.best_rated_restaurant[i].restaurant.name;
        let restaurantCurrency = apiResponse.best_rated_restaurant[i].restaurant.currency;
        let restaurantAverageCost = apiResponse.best_rated_restaurant[i].restaurant.average_cost_for_two
        let restaurantPage = apiResponse.best_rated_restaurant[i].restaurant.events_url
        let restaurantCuisine = apiResponse.best_rated_restaurant[i].restaurant.cuisines;
        let restaurantImage = apiResponse.best_rated_restaurant[i].restaurant.featured_image;

        function b(image) {
            if (image == "") {
                let restaurantImage = 'https://i.pinimg.com/736x/42/c3/39/42c3397907bbcbded0b912fa956f8a42--scallop-plating-fish-plating.jpg';
                $('.zomato-outputs').append(`
<div class='zomato-output'>
<a href=${restaurantPage} class='zomato-output-image' target='_blank'>
<div style='background-image: url(${restaurantImage})' class='zomato-output-image'></div>
</a>
<div class='restaurant-detail'>
<h3 class='zomato-output-restaurant-name'>${restaurantName}</h3>
<p class='zomato-output-restaurant-street'>Average cost for two: ${restaurantCurrency}${restaurantAverageCost}</p>
<p class='zomato-output-restaurant-state'>${restaurantCuisine}</p>
<div>
</div>`)
            } else {
                let restaurantImage = apiResponse.best_rated_restaurant[i].restaurant.featured_image;
                $('.zomato-outputs').append(`
<div class='zomato-output'>
<a href=${restaurantPage} class='zomato-output-image' target='_blank'>
<div style='background-image: url(${restaurantImage})' class='zomato-output-image'></div>
</a>
<div class='restaurant-detail'>
<h3 class='zomato-output-restaurant-name'>${restaurantName}</h3>
<p class='zomato-output-restaurant-street'>Average cost for two: ${restaurantCurrency} ${restaurantAverageCost}</p>
<p class='zomato-output-restaurant-state'>${restaurantCuisine}</p>
<div>
</div>`)
            }
        };
        b(restaurantImage);


    }
}

function displayYoutubeResults(results) {
    $('.youtube-outputs').empty();
    for (let i = 0; i < 10; i++) {
        let videoImage = results.items[i].snippet.thumbnails.default.url;
        let videoName = results.items[i].snippet.title;
        let videoLink = results.items[i].id.videoId;
        $('.youtube-outputs').append(`
    <div class='youtube-output'>
    <a href='https://www.youtube.com/watch?v=${videoLink}' class ='link' target='_blank'>
    <div style='background-image: url(${videoImage})' class='youtube-output-image'></div>
    </a>
    <div class='video-detail'>
    <h3 class='youtube-output-video-name'>${videoName}</h3>
    </div>
    </div>`)
    };
}

function a() {
    $('main').hide();
}


$(document).ready(function () {
    let text = ['Location', 'Country', 'State', 'City', 'Area'];
    let n = 0;
    let loopLength = text.length;

    setInterval(function () {
        if (n < loopLength) {
            var newText = text[n];
            n++;
            $('.rotating-text').html(newText);
        } else {
            $('rotating-text').html(text[0]);
            n = 0;
        }
    }, 2500);
});

a()

// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        //anime: [], //array for anime
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_anime = function () {
        fetch("https://kitsu.io/api/edge/anime?filter[season]=spring&filter[seasonYear]=2021&sort=-averageRating", {
            "method": "GET",
            "headers": {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
            }
        }).then(response => {
            return response.json();
        }).then(function(data) {
            first_array = data["data"];
            for (i = 0; i < first_array.length; i++) {
                first_anime = first_array[i];
                links = first_anime["links"];
                attributes = first_anime["attributes"];
                //app.vue.anime.push({link: links["self"],
                //                     name: attributes["canonicalTitle"],});
                axios.post(add_anime_url,
                {
                    link: links["self"],
                    name: attributes["canonicalTitle"],
                });

            }
        });
    };


    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        //for (i = 0; i < app.vue.anime.length; i++) {
        //    app.vue.anime.pop();
        //}
        app.add_anime();
        console.log("Hello");
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);

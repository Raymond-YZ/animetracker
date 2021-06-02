// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        title: "",
        episode_num: 0,
        poster: "",
        synopsis: "",
        start_date: "",
        end_date: "",
        trailer: "",
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.add_show = function () {
        axios.post(add_to_list_url, {
            title: app.vue.title,
            episode_num: app.vue.episode_num,
            poster: app.vue.poster,
        });
    }


    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        add_show: app.add_show,
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
        //fetch("https://kitsu.io/api/edge/anime", {
        //    "method": "GET",
        //    "headers": {
        //        "Accept": "application/vnd.api+json",
        //        "Content-Type": "application/vnd.api+json"
        //    }
        //}).then(response => {
        //    return response.json();
        //}).then(function(data) {
        //    first_array = data["data"];

        //    first_dict = first_array[0];

        //    attributes = first_dict["attributes"];

        //    posterAttr = attributes["posterImage"];

        //    app.vue.title = attributes["canonicalTitle"];
        //    app.vue.poster = posterAttr["small"];
        //    app.vue.episode_num = attributes["episodeCount"];
        //    app.vue.synopsis = attributes["synopsis"];
        //});
        axios.get(get_anime_url).then(function (response) {
            console.log(response.data.show);
            fetch(response.data.show, {
            "method": "GET",
            "headers": {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json"
                }
            }).then(response => {
                return response.json();
            }).then(function(data) {
                first_dict = data["data"];

                attributes = first_dict["attributes"];

                posterAttr = attributes["posterImage"];

                app.vue.title = attributes["canonicalTitle"];
                app.vue.poster = posterAttr["small"];
                app.vue.episode_num = attributes["episodeCount"];
                app.vue.synopsis = attributes["synopsis"];
                app.vue.start_date = attributes["startDate"];
                app.vue.end_date = attributes["endDate"];
                app.vue.trailer = "https://www.youtube.com/embed/" + attributes["youtubeVideoId"];
            });
        });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);

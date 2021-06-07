// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        show: "",
        results: [],
        search_status: false,
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };

    app.set_search_status = function (status) {
        app.vue.search_status = status;
    };

    app.delete_search = function () {
        axios.get(delete_search_url);
    };

    app.get_search = function () {
        app.delete_search();
        app.vue.results = [];
        let rep = app.vue.show.replace(/ /g, "%20");
        console.log("https://kitsu.io/api/edge/anime?filter[text]=" + rep + "&page[limit]=5&page[offset]=0");
        fetch("https://kitsu.io/api/edge/anime?filter[text]=" + rep + "&page[limit]=5&page[offset]=0", {
            "method": "GET",
            "headers": {
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
            }
        }).then(response => {
            return response.json();
        }).then(function(data) {
            data_array = data["data"];
            for (i = 0; i < data_array.length; i++) {
                anime_show = data_array[i];
                link = anime_show["links"];
                attributes = anime_show["attributes"];
                posterAttr = attributes["posterImage"];
                coverAttr = attributes["coverImage"];
                if (coverAttr != null){
                    cover = coverAttr["small"];
                }
                else{
                    cover = "null";
                }
                app.vue.results.push({
                    link: link["self"],
                    name: attributes["canonicalTitle"],
                    poster: posterAttr["small"],
                });
                console.log(attributes["canonicalTitle"]);
                axios.post(add_search_url, {
                    link: link["self"],
                    name: attributes["canonicalTitle"],
                    poster: posterAttr["small"],
                    cover: cover,
                });
            }
            location.reload();
        });
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        set_search_status: app.set_search_status,
        get_search: app.get_search,
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

    }
    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
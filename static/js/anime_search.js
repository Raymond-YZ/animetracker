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
        comments: [],
        add_mode: false,
        add_text: "",
        show: "",
        cover: "",
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

    app.add_comment = function () {
        axios.post(add_comment_url,
            {
                text: app.vue.add_text,
                show: app.vue.show,
            }).then(function (response) {
                app.vue.comments.push({
                    id: response.data.id,
                    text: app.vue.add_text,
                    user: response.data.user,
                    user_email: response.data.user_email,
                    show: app.vue.show,
                });
                app.enumerate(app.vue.comments);
                app.reset_form();
                app.set_add_status(false);

            });
        app.init();
    };

    app.set_add_status = function (new_status) {
        app.vue.add_mode = new_status;
    };

    app.reset_form = function () {
        app.vue.add_text = "";
    };

    app.delete_comment = function (comment_idx) {
        let id = app.vue.comments[comment_idx].id;
        axios.get(delete_comment_url, { params: { id: id } }).then(function (response) {
            for (let i = 0; i < app.vue.comments.length; i++) {
                if (app.vue.comments[i].id === id) {
                    app.vue.comments.splice(i, 1);
                    app.enumerate(app.vue.comments);
                    break;
                }
            }
        })
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        add_show: app.add_show,
        add_comment: app.add_comment,
        set_add_status: app.set_add_status,
        delete_comment: app.delete_comment,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        axios.get(get_search_url).then(function (response) {
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

                links = first_dict["links"];

                posterAttr = attributes["posterImage"];
                coverAttr = attributes["coverImage"];
                if (coverAttr != null) {
                    app.vue.cover = coverAttr["small"];
                }
                else {
                    app.vue.cover = "null";
                }
                console.log(app.vue.cover);
                app.vue.show = links["self"];
                app.vue.title = attributes["canonicalTitle"];
                app.vue.poster = posterAttr["small"];
                app.vue.episode_num = attributes["episodeCount"];
                app.vue.synopsis = attributes["synopsis"];
                app.vue.start_date = attributes["startDate"];
                app.vue.end_date = attributes["endDate"];
                app.vue.trailer = "https://www.youtube.com/embed/" + attributes["youtubeVideoId"];
            });
        });

        axios.get(load_comments_url)
            .then(function (response) {
            //    app.complete(response.data.comments);
                app.vue.comments = app.enumerate(response.data.comments)
            });
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);
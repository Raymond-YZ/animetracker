// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        shows: [],
    };

    app.file = null;

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => { e._idx = k++; });
        return a;
    };



    app.decorate = (a) => {
        a.map((e) => { e._state = { episodes_watched: "clean" }; });
        return a;
    };

    //users can edit the number of episodes watched
    app.start_edit = function (a_idx, fn) {
        app.vue.shows[a_idx]._state[fn] = 'edit';
    }

    //checks to see if entry is valid (ie. cannot watch more than the number of episodes published)
    app.stop_edit = function (a_idx, fn) {
        let show = app.vue.shows[a_idx];
        console.log(show);
        if (show._state[fn] === 'edit') {
            show._state[fn] = 'pending';
            if (show[fn] <= show["episode_num"]) {
                axios.post(edit_show_url,
                    {
                        id: show.id,
                        field: fn,
                        value: show[fn],
                    }).then(function (result) {
                        show._state[fn] = 'clean';
                    });
            }
            else{
                show._state[fn] = 'edit';
                alert("Please enter a valid entry.");
            }
        }

    }

    //delete show
    app.delete_show = function (email, anime_name) {
        axios.get(delete_show_url, { params: { email: email, name: anime_name } }).then(function (response) {
            for (i = 0; i < app.vue.shows.length; i++) {
                if ((app.vue.shows[i].user == email) &&
                    (app.vue.shows[i].anime_name == anime_name)) {
                    app.vue.shows.splice(i, 1);
                    break;
                }
            }
        });
    };

    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        delete_show: app.delete_show,
        start_edit: app.start_edit,
        stop_edit: app.stop_edit,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods
    });

    // And this initializes it.
    app.init = () => {
        axios.get(load_list_url).then(function (response) {
            app.vue.shows = app.decorate(app.enumerate(response.data.show_list));
        })
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);

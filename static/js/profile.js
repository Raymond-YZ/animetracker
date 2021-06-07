// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};


// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        selection_done: false,
        uploading: false,
        uploaded_file: "",
        uploaded: false,
        upload_done: false,
        img_url: "",
        shows: [],
    };

    app.file = null;

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => { e._idx = k++; });
        return a;
    };

    

    app.decorate = (a) =>{
        a.map((e) => {e._state = {episodes_watched: "clean"};});
        return a;
    };

    app.start_edit = function(a_idx, fn){
        app.vue.shows[a_idx]._state[fn] = 'edit';
    }

    app.stop_edit = function(a_idx, fn){
        let show = app.vue.shows[a_idx];
        if(show._state[fn] === 'edit'){
            show._state[fn] = 'pending';
            axios.post(edit_show_url,
            {
                id: show.id,
                field: fn,
                value: show[fn],
            }).then(function(result){
                show._state[fn] = 'clean';
            });
        }

    }

    app.select_file = function (event) {
        let input = event.target;
        app.file = input.files[0];
        if (app.file) {
            app.vue.selection_done = true;
            // We read the file.
            let reader = new FileReader();
            reader.addEventListener("load", function () {
                app.vue.img_url = reader.result;
            });
            reader.readAsDataURL(app.file);
        }
    };

    app.upload_complete = function (file_name, file_type) {
        app.vue.uploading = false;
        app.vue.uploaded = true;
        app.vue.uploaded_file = file_name;
    };

    app.upload_file = function (event) {
        if (app.file) {
            let file_type = app.file.type;
            let file_name = app.file.name;
            let full_url = file_upload_url + "&file_name=" + encodeURIComponent(file_name)
                + "&file_type=" + encodeURIComponent(file_type);
            // Uploads the file, using the low-level streaming interface. This avoid any
            // encoding.
            app.vue.uploading = true;
            let req = new XMLHttpRequest();
            req.addEventListener("load", function () {
                app.upload_complete(file_name, file_type)
            });
            req.open("PUT", full_url, true);
            req.send(app.file);
        }

    };



    app.delete_show = function (email, anime_name) {
        axios.get(delete_show_url, { params: {email: email, name: anime_name} }).then(function(response){
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
        select_file: app.select_file,
        upload_file: app.upload_file,
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
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
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

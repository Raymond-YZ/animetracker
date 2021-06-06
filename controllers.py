"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('browse')
@action.uses(db, auth, "browse.html")
def browse():
    rows = db(db.anime_shows).select()
    assert rows is not None
    search = db(db.search_results).select()
    assert search is not None
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        add_search_url = URL('add_search', signer=url_signer),
        add_anime_url = URL('add_anime', signer=url_signer),
        delete_search_url = URL('delete_search', signer=url_signer),
        url_signer = url_signer,
        rows=rows,
        search=search,
    )
    return "ok"

@action('delete_search')
@action.uses(db, auth)
def delete_search():
    db(db.search_results).delete()
    return "ok"

@action('go_to_search')
@action.uses(db, auth)
def go_to_anime(anime_id=None):
    assert anime_id is not None
    redirect(URL('anime_search', anime_id))
    return "ok"

@action('anime_search')
@action.uses(db, auth, 'anime_search.html')
def anime_page(anime_id=None):
    assert anime_id is not None
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        get_anime_url = URL('get_search', anime_id, signer=url_signer),
        load_comments_url = URL('load_comments', signer=url_signer),
        add_comment_url = URL('add_comment', signer=url_signer),
        delete_comment_url = URL('delete_comment', signer=url_signer),
        add_to_list_url=URL('add_to_list', signer=url_signer),
        user_email=get_user_email(),
        url_signer=url_signer,
    )

@action('get_search')
@action.uses(db, auth)
def get_anime(anime_id=None):
    assert anime_id is not None
    show = db(db.search_results.id == anime_id).select().first()
    return dict(show=show['link'])

@action('index')
@action.uses(db, auth, 'index.html')
def index():
    rows = db(db.anime_shows).select()
    assert rows is not None
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
        add_anime_url=URL('add_anime', signer=url_signer),
        file_upload_url = URL('file_upload', signer=url_signer),
        url_signer=url_signer,
        rows=rows,
    )

@action('go_to_profile')
@action.uses(db, auth, auth.user, url_signer.verify())
def go_to_profile():
    redirect(URL('profile'))
    return "ok"

@action('add_anime', method="POST")
@action.uses(db, auth)
def add_anime():
    link=request.json.get("link")
    name=request.json.get("name")
    poster = request.json.get("poster")
    db.anime_shows.update_or_insert(
        (db.anime_shows.link == link),
        link=link,
        name=name,
        poster=poster,
    )
    return "ok"

@action('profile')
@action.uses(db, auth,'profile.html')
def profile():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        file_upload_url = URL('file_upload', signer=url_signer),
        load_list_url=URL('load_list', signer=url_signer),
        delete_show_url = URL('delete_show', signer=url_signer),
        user_email=get_user_email(),
        url_signer=url_signer,
    )

@action('go_to_list')
@action.uses(db, auth, auth.user, url_signer.verify())
def go_to_profile():
    redirect(URL('list'))
    return "ok"

@action('load_list')
@action.uses(db, url_signer.verify())
def load_list():
    #user = db(db.auth_user.email == get_user_email()).select().first()
    show_list = db(db.list.user == get_user_email()).select().as_list()
    return dict(show_list=show_list)

@action('go_to_anime')
@action.uses(db, auth)
def go_to_anime(anime_id=None):
    assert anime_id is not None
    redirect(URL('anime_page', anime_id))
    return "ok"

@action('list')
@action.uses(db, auth, auth.user, 'list.html')
def list():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        user_email=get_user_email(),
    )

@action('delete_show')
@action.uses(db, auth, url_signer.verify())
def delete_show():
    email = request.params.get("email")
    name = request.params.get("name")
    assert email is not None
    assert name is not None
    db((db.list.user == email) & (db.list.anime_name == name)).delete()
    return "ok"

@action('anime_page')
@action.uses(db, auth, 'anime_page.html')
def anime_page(anime_id=None):
    assert anime_id is not None
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        get_anime_url = URL('get_anime', anime_id, signer=url_signer),
        load_comments_url = URL('load_comments', signer=url_signer),
        add_comment_url = URL('add_comment', signer=url_signer),
        delete_comment_url = URL('delete_comment', signer=url_signer),
        add_to_list_url=URL('add_to_list', signer=url_signer),
        user_email=get_user_email(),
        url_signer=url_signer,
    )

@action('get_anime')
@action.uses(db, auth)
def get_anime(anime_id=None):
    assert anime_id is not None
    show = db(db.anime_shows.id == anime_id).select().first()
    return dict(show=show['link'])

@action('add_to_list', method="POST")
@action.uses(db, url_signer.verify())
def add_to_list():
    user = db(db.auth_user.email == get_user_email()).select().first()
    title = request.json.get("title")
    episode_num = request.json.get("episode_num")
    poster = request.json.get("poster")
    db.list.update_or_insert(
        ((db.list.user == get_user_email()) &
         (db.list.anime_name == title)),
        anime_name = title,
        episode_num = episode_num,
        poster = poster,
    )
    return "ok"

@action('load_comments')
@action.uses(url_signer.verify(), db)
def load_comments():
    comments = db(db.comment).select().as_list()
    return dict(comments = comments)

@action('add_comment', method ="POST")
@action.uses(url_signer.verify(), auth.user, db)
def add_comment():
    r = db(db.auth_user.email == get_user_email()).select().first()
    name= r.first_name + " " + r.last_name if r is not None else "Unknown"
    current_email = get_user_email()
    id = db.comment.insert(
        text=request.json.get('text'),
        user=name,
        user_email=current_email
    )
    return dict(id=id)

@action('delete_comment')
@action.uses(url_signer.verify(), auth.user, db)
def delete_comment():
    id = request.params.get('id')
    assert id is not None
    db(db.comment.id == id).delete()
    return "ok"

@action('file_upload', method="PUT")
@action.uses()
def file_upload():
    file_name = request.params.get("file_name")
    file_type = request.params.get("file_type")
    uploaded_file = request.body # This is a file, you can read it.
    # Diagnostics
    print("Uploaded", file_name, "of type", file_type)
    print("Content:", uploaded_file.read())
    return "ok"

@action('add_search', method="POST")
@action.uses(db, auth)
def add_search():
    link=request.json.get("link")
    name=request.json.get("name")
    poster = request.json.get("poster")
    db.search_results.update_or_insert(
        (db.search_results.link == link),
        link=link,
        name=name,
        poster=poster,
    )
    return "ok"


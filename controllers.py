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
    db.anime_shows.update_or_insert(
        ((db.anime_shows.name == name) &
         (db.anime_shows.link == link)),
        link=link,
        name=name,
    )
    return "ok"

@action('profile')
@action.uses(db, auth,'profile.html')
def profile():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        file_upload_url = URL('file_upload', signer=url_signer),
        user_email=get_user_email(),
        url_signer=url_signer,
    )

@action('go_to_list')
@action.uses(db, auth, auth.user, url_signer.verify())
def go_to_profile():
    redirect(URL('list'))
    return "ok"

@action('go_to_anime/<anime_id:int>')
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

@action('anime_page/<anime_id:int>')
@action.uses(db, auth, 'anime_page.html')
def anime_page(anime_id=None):
    assert anime_id is not None
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        get_anime_url = URL('get_anime', anime_id, signer=url_signer),
    )

@action('get_anime/<anime_id:int>')
@action.uses(db, auth)
def get_anime(anime_id=None):
    assert anime_id is not None
    show = db(db.anime_shows.id == anime_id).select().first()
    return dict(show=show['link'])

@action('file_upload', method="PUT")
@action.uses() # Add here things you might want to use.
def file_upload():
    file_name = request.params.get("file_name")
    file_type = request.params.get("file_type")
    uploaded_file = request.body # This is a file, you can read it.
    # Diagnostics
    print("Uploaded", file_name, "of type", file_type)
    print("Content:", uploaded_file.read())
    return "ok"


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
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
        url_signer=url_signer,
    )

@action('go_to_profile')
@action.uses(db, auth, auth.user, url_signer.verify())
def go_to_profile():
    redirect(URL('profile'))
    return "ok"

@action('profile')
@action.uses(db, auth, auth.user, 'profile.html')
def profile():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        user_email=get_user_email(),
        url_signer=url_signer,
    )

@action('go_to_list')
@action.uses(db, auth, auth.user, url_signer.verify())
def go_to_profile():
    redirect(URL('list'))
    return "ok"

@action('list')
@action.uses(db, auth, auth.user, 'list.html')
def list():
    return dict(
        my_callback_url = URL('my_callback', signer=url_signer),
        user_email=get_user_email(),
    )


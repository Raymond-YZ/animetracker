"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_user():
    return auth.current_user.get('id') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

db.define_table(
    'profiles',
    Field('username', default='WeebWarrior'),
    Field('user_email', default=get_user_email),
    Field('thumbnail', 'text'),
    Field('description', 'text'),
)

db.define_table(
    'list',
    Field('user', default=get_user_email),
    Field('anime_name'),
    Field('episodes_watched', 'integer', default = 0, requires = IS_INT_IN_RANGE(0, 1e6)),
    Field('episode_num', default=0),
    Field('poster'),
)

db.define_table(
    'anime_shows',
    Field('link'),
    Field('name'),
    Field('poster'),
    Field('cover'),
)

db.define_table(
    'search_results',
    Field('link'),
    Field('name'),
    Field('poster'),
    Field('cover'),
)

db.define_table('comment',
                Field('show'),
                Field('text'),
                Field('user'),
                Field('user_email', default = get_user_email))

db.list.anime_name.writable = False
db.list.user.readable = db.list.anime_name.writable = False

db.commit()

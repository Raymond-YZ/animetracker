"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

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
)

db.define_table(
    'list',
    Field('profile', 'reference profiles'),
    Field('anime_name'),
    Field('episode_num', default=0),
    Field('poster'),
)

db.define_table(
    'anime_links',
    Field('link'),
    Field('name'),
)

db.commit()

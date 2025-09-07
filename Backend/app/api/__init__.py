from flask import Blueprint

api_bp = Blueprint('api', __name__)

from . import colleges, students, events, reports, reports_web

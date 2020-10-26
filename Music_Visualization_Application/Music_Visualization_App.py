
#Import Flask and the module required to render HTML pages and deal with
#requests and redirections between pages
from flask import Flask, render_template, request, redirect, jsonify
from markupsafe import escape
import requests

SOUNDCLOUD_PRETEXT = "https://api.soundcloud.com/tracks/"
SOUNDCLOUD_POSTTEXT = "/stream?client_id="
CLIENT_ID = "YOUR_SOUNCLOUD_ClIENT_ID"

#Instantiate the Flask Application/Object
app = Flask(__name__)

#The code below handles the default URL/Landing page 
@app.route('/')
def index():

	#We render the file home.html contained in the templates folder
	return render_template('home.html')


@app.route('/stream/<int:id>')
def find(id):
	stream = SOUNDCLOUD_PRETEXT + str(id) + SOUNDCLOUD_POSTTEXT + CLIENT_ID
	response = requests.get(stream)
	return str(response.url)

	
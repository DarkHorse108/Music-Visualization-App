
#Import Flask and the module required to render HTML pages and deal with
#requests and redirections between pages
from flask import Flask, render_template, request, redirect, jsonify
from markupsafe import escape
import requests

#Instantiate the Flask Application/Object
app = Flask(__name__)

#The code below handles the default URL/Landing page 
@app.route('/')
def index():

	#We render the file home.html contained in the templates folder
	return render_template('home.html')

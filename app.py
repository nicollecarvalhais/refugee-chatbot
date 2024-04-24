from flask import Flask, render_template, request, jsonify
from chat import get_response
from googletrans import Translator


app = Flask(__name__)



# Define predefined questions
predefined_questions = [
    "How can I access education?",
    "How can I find a job?",
    "I need legal advice.",
    "Claiming Refugee Status",
    "UK Emergency Numbers"
]

# Define routes for Flask app
@app.route("/")
def index():
    return render_template("index.html", predefined_questions=predefined_questions)

@app.route("/near_you")
def near_you():
    return render_template("near_you.html")

@app.route("/steps")
def steps():
    return render_template("steps.html")

# Define API route for chat interaction
@app.route("/predict", methods=["POST"])
def predict():
    message = request.get_json().get("message")
    
    if message == 'greeting':
        greeting_message = "Hello! Welcome to Re-Fem. How can we assist you today?. Feel free to ask a question or select one of the suggestions below."
        return jsonify({"answer": greeting_message})
    
    translator = Translator()
    translated_message = translator.translate(message, dest='en').text
    
    response = get_response(translated_message)
    
    response_dict = {"answer": response}
    
    return jsonify(response_dict)

if __name__ == "__main__":
    app.run(debug=True)

from flask_smorest import Blueprint

blp = Blueprint("Home" , __name__, description="Home page")

@blp.route('/')
def home():
    return "Backend is running!", 200

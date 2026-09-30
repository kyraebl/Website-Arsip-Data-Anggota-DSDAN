from dotenv import load_dotenv
from flask import Flask

load_dotenv()

from config import Config
from routes import register_routes
from services.uploads import init_upload_paths


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)
    init_upload_paths(app)
    register_routes(app)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

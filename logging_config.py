import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging(logger):
    logger.setLevel(logging.INFO)

    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    logger.addHandler(console_handler)

    log_file_path = os.path.join(log_dir, "flask_app.log")
    file_handler = RotatingFileHandler(log_file_path, maxBytes=5 * 1024 * 1024, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]"
    ))
    logger.addHandler(file_handler)


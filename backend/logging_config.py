import logging
import os
from logging.handlers import RotatingFileHandler

def setup_logging(logger):
    logger.setLevel(logging.INFO)

    base_log_dir = "logs"
    if not os.path.exists(base_log_dir):
        os.makedirs(base_log_dir)

    log_levels = ["debug", "info", "error", "warning", "critical"]
    log_dirs = {level : os.path.join(base_log_dir, level) for level in log_levels}

    for log_dir in log_dirs.values():
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    logger.addHandler(console_handler)

    #Rotating file handlers for each log level
    for level_name, log_dir in log_dirs.items():
        log_file = os.path.join(log_dir, f"{level_name}.log")
        file_handler = RotatingFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=5)

        level = getattr(logging, level_name.upper())
        file_handler.setLevel(level)

        file_handler.setFormatter(logging.Formatter(
            "%(asctime)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]"
        ))
        logger.addHandler(file_handler)

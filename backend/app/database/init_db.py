from app.database.session import Base, engine, SessionLocal
from app.database.seed_data import seed_database
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Creating database tables if not present...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        logger.info("Seeding initial verified tourism data...")
        seed_database(db)
        logger.info("Database successfully initialized and seeded!")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()


from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Common base class for all ARGUS SQLAlchemy models.

    Every database model will inherit from this class.
    """
    pass

"""
Train Operations Data Models
============================
- Trains (Passenger, Express, Freight)
- Train Schedules & Timetable paths
- Real-Time RTIS Train GPS Movements & Delays
- FOIS Freight Movement Forecasts
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Boolean, JSON, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Train(Base):
    __tablename__ = "trains"

    id = Column(String(32), primary_key=True, index=True)  # e.g., "12123", "22221", "BOXN-9021"
    train_number = Column(String(32), unique=True, nullable=False, index=True)
    train_name = Column(String(128), nullable=False)
    train_type = Column(String(32), nullable=False, index=True) # "VANDE_BHARAT", "RAJDHANI", "MAIL_EXPRESS", "SUBURBAN_EMU", "GOODS_FREIGHT"
    priority_class = Column(Integer, default=3) # 1 = Highest (Vande Bharat/Rajdhani), 5 = Lowest (Freight)
    origin_station = Column(String(16), nullable=False)
    destination_station = Column(String(16), nullable=False)
    max_permissible_speed_kmph = Column(Integer, default=110)
    length_coaches = Column(Integer, default=22)

    schedules = relationship("TrainSchedule", back_populates="train", cascade="all, delete-orphan")
    live_movements = relationship("LiveTrainMovement", back_populates="train", cascade="all, delete-orphan")


class TrainSchedule(Base):
    """
    Timetabled path through a railway section.
    Used by the Conflict Engine & OR-Tools Optimizer.
    """
    __tablename__ = "train_schedules"

    id = Column(String(64), primary_key=True, index=True)
    train_id = Column(String(32), ForeignKey("trains.id"), nullable=False, index=True)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False, index=True)
    start_station_code = Column(String(16), nullable=False)
    end_station_code = Column(String(16), nullable=False)
    direction = Column(String(16), default="UP") # "UP", "DOWN"
    track_number = Column(Integer, default=1)
    
    # Scheduled corridor occupancy window
    entry_time = Column(DateTime, nullable=False, index=True)
    exit_time = Column(DateTime, nullable=False, index=True)
    scheduled_duration_min = Column(Integer, nullable=False)
    
    is_daily = Column(Boolean, default=True)

    train = relationship("Train", back_populates="schedules")


class LiveTrainMovement(Base):
    """
    RTIS (Real-Time Train Information System) Live GPS snapshot.
    Used for live dynamic conflict detection and automatic re-planning.
    """
    __tablename__ = "live_train_movements"

    id = Column(String(64), primary_key=True, index=True)
    train_id = Column(String(32), ForeignKey("trains.id"), nullable=False, index=True)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False, index=True)
    current_km = Column(Float, nullable=False)
    current_speed_kmph = Column(Float, default=0.0)
    current_block_section_id = Column(String(64), nullable=True)
    delay_minutes = Column(Integer, default=0) # Real-time delay in minutes
    eta_next_station = Column(DateTime, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(32), default="RUNNING") # "RUNNING", "REGULATED", "HALTED", "DIVERTED"
    recorded_at = Column(DateTime, server_default=func.now(), index=True)

    train = relationship("Train", back_populates="live_movements")

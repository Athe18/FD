"""
Infrastructure Data Models
==========================
Hierarchical Railway Topology:
Zone -> Division -> Section -> Corridor -> BlockSection -> Track -> Stations
"""

from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Zone(Base):
    __tablename__ = "zones"

    id = Column(String(32), primary_key=True, index=True)  # e.g., "CR", "NR", "WR"
    name = Column(String(128), nullable=False)
    headquarters = Column(String(128), nullable=False)
    code = Column(String(16), unique=True, nullable=False)

    divisions = relationship("Division", back_populates="zone", cascade="all, delete-orphan")


class Division(Base):
    __tablename__ = "divisions"

    id = Column(String(32), primary_key=True, index=True)  # e.g., "MUMBAI-CR", "DELHI-NR"
    name = Column(String(128), nullable=False)
    code = Column(String(16), nullable=False)
    zone_id = Column(String(32), ForeignKey("zones.id"), nullable=False)

    zone = relationship("Zone", back_populates="divisions")
    sections = relationship("Section", back_populates="division", cascade="all, delete-orphan")


class Section(Base):
    __tablename__ = "sections"

    id = Column(String(64), primary_key=True, index=True)  # e.g., "KYN-IGP", "GZB-CNB"
    name = Column(String(128), nullable=False)
    division_id = Column(String(32), ForeignKey("divisions.id"), nullable=False)
    start_km = Column(Float, nullable=False)
    end_km = Column(Float, nullable=False)
    total_length_km = Column(Float, nullable=False)
    traffic_density_gmt = Column(Float, default=35.0)  # Gross Million Tonnes per annum
    speed_limit_kmph = Column(Integer, default=110)
    electrification_type = Column(String(32), default="25kV AC 50Hz")
    signalling_type = Column(String(64), default="Automatic Block Signalling (ABS)")
    geojson_geometry = Column(JSON, nullable=True)  # GeoJSON LineString for MapLibre

    division = relationship("Division", back_populates="sections")
    block_sections = relationship("BlockSection", back_populates="section", cascade="all, delete-orphan")
    stations = relationship("Station", back_populates="section", cascade="all, delete-orphan")
    tracks = relationship("Track", back_populates="section", cascade="all, delete-orphan")


class Station(Base):
    __tablename__ = "stations"

    id = Column(String(32), primary_key=True, index=True)  # e.g., "KYN", "KSRA", "IGP"
    code = Column(String(16), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False)
    km_location = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    number_of_platforms = Column(Integer, default=4)
    station_type = Column(String(32), default="Junction")  # "Terminal", "Junction", "Station"

    section = relationship("Section", back_populates="stations")


class BlockSection(Base):
    """
    Railway Block Section: Basic operational unit of railway track where
    only one train movement is permitted at a time under ABS / Absolute block.
    """
    __tablename__ = "block_sections"

    id = Column(String(64), primary_key=True, index=True)  # e.g., "BS-KYN-TNA-UP"
    name = Column(String(128), nullable=False)
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False)
    start_station_code = Column(String(16), nullable=False)
    end_station_code = Column(String(16), nullable=False)
    start_km = Column(Float, nullable=False)
    end_km = Column(Float, nullable=False)
    track_number = Column(Integer, default=1)  # 1: UP, 2: DOWN, 3: 3rd Line, 4: 4th Line
    direction = Column(String(16), default="UP")  # "UP", "DOWN", "BIDIRECTIONAL"
    abs_sub_sections = Column(Integer, default=3)  # Signal-to-signal automatic blocks
    geojson_geometry = Column(JSON, nullable=True)

    section = relationship("Section", back_populates="block_sections")


class Track(Base):
    __tablename__ = "tracks"

    id = Column(String(64), primary_key=True, index=True)  # e.g., "TRK-KYN-IGP-UP-MAIN"
    section_id = Column(String(64), ForeignKey("sections.id"), nullable=False)
    track_name = Column(String(64), nullable=False)
    track_type = Column(String(32), default="Mainline")  # "Mainline", "Loop", "Siding", "Yard"
    gauge = Column(String(32), default="Broad Gauge (1676 mm)")
    rail_type = Column(String(32), default="60 kg / 90 UTS")
    sleeper_type = Column(String(32), default="PSC (Prestressed Concrete)")
    max_axle_load_tonnes = Column(Float, default=22.82)
    start_km = Column(Float, nullable=False)
    end_km = Column(Float, nullable=False)

    section = relationship("Section", back_populates="tracks")

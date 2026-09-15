"""
Database Seeding Script for PostgreSQL / Supabase
=================================================
Populates the PostgreSQL / Supabase database with the complete
synthetic Indian Railways corridor dataset.

Usage:
    python scripts/seed_database.py
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import Base, engine, SessionLocal
from app.models import (
    Zone, Division, Section, Station, BlockSection, Track,
    Asset, MaintenanceTask, Train, TrainSchedule, Team, Equipment, InventoryItem
)
from scripts.synthetic_data_generator import generate_prabal_dataset


def seed_database():
    print(f"Connecting to database: {engine.url}")
    
    try:
        # Create all tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully.")
    except Exception as e:
        print(f"⚠️ Could not connect to PostgreSQL server: {e}")
        print("Please verify your DATABASE_URL or Supabase credentials in .env")
        return

    db = SessionLocal()
    data = generate_prabal_dataset()

    try:
        # Check if already seeded
        if db.query(Zone).filter_by(id="CR").first():
            print("ℹ️ Database already seeded with Central Railway corridor.")
            return

        print("Seeding Central Railway Infrastructure...")
        zone = Zone(id="CR", name="Central Railway", headquarters="Mumbai CSMT", code="CR")
        div = Division(id="MUMBAI-CR", name="Mumbai Division", code="BB", zone_id="CR")
        sec = Section(
            id=data["section"]["id"],
            name=data["section"]["name"],
            division_id="MUMBAI-CR",
            start_km=data["section"]["start_km"],
            end_km=data["section"]["end_km"],
            total_length_km=84.0,
            traffic_density_gmt=38.5
        )
        db.add_all([zone, div, sec])
        db.flush()

        # Stations & Block Sections
        for st in data["stations"]:
            db.add(Station(
                id=st["code"], code=st["code"], name=st["name"],
                section_id=sec.id, km_location=st["km"],
                latitude=st["lat"], longitude=st["lng"],
                number_of_platforms=st.get("platforms", 4)
            ))

        for bs in data["block_sections"]:
            db.add(BlockSection(
                id=bs["id"], name=bs["name"], section_id=sec.id,
                start_station_code=bs["name"].split(" - ")[0],
                end_station_code=bs["name"].split(" - ")[1].split(" ")[0],
                start_km=bs["start_km"], end_km=bs["end_km"],
                track_number=bs["track_number"], direction=bs["direction"]
            ))

        # Assets
        for ast in data["assets"]:
            db.add(Asset(
                id=ast["id"], asset_code=ast["asset_code"], name=ast["name"],
                department=ast["department"], asset_type=ast["asset_type"],
                section_id=ast["section_id"], block_section_id=ast["block_section_id"],
                km_location=ast["km_location"], latitude=ast["lat"], longitude=ast["lng"],
                health_score=ast["health_score"], failure_probability=ast["failure_probability"],
                risk_category=ast["risk_category"], asset_criticality=ast["asset_criticality"]
            ))

        # Tasks
        for t in data["tasks"]:
            db.add(MaintenanceTask(
                id=t["id"], task_code=t["task_code"], title=t["title"],
                department=t["department"], task_type=t["task_type"],
                asset_id=t["asset_id"], section_id=t["section_id"],
                block_section_id=t["block_section_id"], km_location=t["km_location"],
                estimated_duration_min=t["estimated_duration_min"], overdue_days=t["overdue_days"],
                required_team_type=t["required_team_type"], priority_score=t["priority_score"],
                risk_level=t["risk_level"]
            ))

        # Trains & Schedules
        for tr in data["train_schedules"]:
            if not db.query(Train).filter_by(id=tr["train_id"]).first():
                db.add(Train(
                    id=tr["train_id"], train_number=tr["train_number"],
                    train_name=tr["train_name"], train_type=tr["train_type"],
                    origin_station="CSMT", destination_station="IGP"
                ))
            db.add(TrainSchedule(
                id=f"SCH-{tr['train_id']}", train_id=tr["train_id"],
                section_id=tr["section_id"], start_station_code="KYN",
                end_station_code="IGP", entry_time=tr["entry_time"],
                exit_time=tr["exit_time"], scheduled_duration_min=30
            ))

        # Inventory
        for item_code, qty in data["inventory"].items():
            db.add(InventoryItem(
                id=item_code, item_code=item_code, name=item_code.replace("MAT-", ""),
                category="TRACK", warehouse_code="KSRA-DEPOT", quantity_on_hand=qty
            ))

        db.commit()
        print("✅ Database successfully seeded with full Indian Railways dataset.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

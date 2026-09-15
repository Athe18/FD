"""
Synthetic Railway Dataset Generator
====================================
Generates a realistic, deterministic Indian Railways operational dataset:
- High-density Central Railway Mumbai-Igatpuri corridor (50km)
- Multi-track ABS topology
- Multi-departmental assets (Track, OHE, Signal, Telecom)
- Timetabled passenger, superfast, suburban local & freight trains
- Targeted maintenance requests for SIH evaluation demonstration
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta
import random


def generate_prabal_dataset(base_date: datetime = None) -> Dict[str, Any]:
    if base_date is None:
        base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    # 1. Infrastructure: Section & Stations
    stations = [
        {"code": "KYN", "name": "Kalyan Junction", "km": 53.0, "lat": 19.2437, "lng": 73.1355, "platforms": 8},
        {"code": "THS", "name": "Titwala", "km": 64.0, "lat": 19.3000, "lng": 73.2100, "platforms": 3},
        {"code": "ASO", "name": "Asangaon", "km": 85.0, "lat": 19.4300, "lng": 73.3000, "platforms": 3},
        {"code": "KSRA", "name": "Kasara", "km": 121.0, "lat": 19.6400, "lng": 73.4800, "platforms": 4},
        {"code": "IGP", "name": "Igatpuri", "km": 137.0, "lat": 19.6950, "lng": 73.5600, "platforms": 4}
    ]

    block_sections = [
        {
            "id": "BS-KYN-THS-UP", "name": "Kalyan - Titwala UP", "start_km": 53.0, "end_km": 64.0,
            "track_number": 1, "direction": "UP", "speed_limit": 110
        },
        {
            "id": "BS-THS-ASO-UP", "name": "Titwala - Asangaon UP", "start_km": 64.0, "end_km": 85.0,
            "track_number": 1, "direction": "UP", "speed_limit": 110
        },
        {
            "id": "BS-ASO-KSRA-UP", "name": "Asangaon - Kasara UP", "start_km": 85.0, "end_km": 121.0,
            "track_number": 1, "direction": "UP", "speed_limit": 100
        },
        {
            "id": "BS-KSRA-IGP-UP", "name": "Kasara - Igatpuri UP (Thal Ghat)", "start_km": 121.0, "end_km": 137.0,
            "track_number": 1, "direction": "UP", "speed_limit": 75
        }
    ]

    # 2. Assets (Engineering, TRD, S&T)
    assets = [
        # Engineering Track Assets
        {
            "id": "AST-ENG-RAIL-125", "asset_code": "RAIL-60KG-KM125.4", "name": "60kg/90UTS Flash Butt Welded Rail",
            "department": "ENGINEERING", "asset_type": "Rail Section", "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP", "km_location": 125.4, "lat": 19.6620, "lng": 73.5010,
            "health_score": 48.0, "failure_probability": 0.74, "risk_category": "CRITICAL", "asset_criticality": 0.95
        },
        {
            "id": "AST-ENG-SW-126", "asset_code": "TURNOUT-1-IN-12-KM126", "name": "1-in-12 Curved Switch Turnout",
            "department": "ENGINEERING", "asset_type": "Turnout Point", "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP", "km_location": 126.1, "lat": 19.6680, "lng": 73.5120,
            "health_score": 72.0, "failure_probability": 0.28, "risk_category": "MEDIUM", "asset_criticality": 0.80
        },
        # TRD OHE Assets
        {
            "id": "AST-TRD-OHE-125", "asset_code": "OHE-MAST-125-14", "name": "25kV AC Cantilever Mast Assembly",
            "department": "TRD", "asset_type": "OHE Cantilever", "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP", "km_location": 125.4, "lat": 19.6622, "lng": 73.5012,
            "health_score": 62.0, "failure_probability": 0.45, "risk_category": "HIGH", "asset_criticality": 0.88
        },
        {
            "id": "AST-TRD-ATD-127", "asset_code": "TRD-ATD-127-02", "name": "Auto Tensioning Device (3-Pulley 5:1)",
            "department": "TRD", "asset_type": "OHE ATD", "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP", "km_location": 127.2, "lat": 19.6740, "lng": 73.5250,
            "health_score": 88.0, "failure_probability": 0.12, "risk_category": "LOW", "asset_criticality": 0.70
        },
        # S&T Signal Assets
        {
            "id": "AST-SNT-SIG-126", "asset_code": "SIG-PT-126B", "name": "Electric Point Machine & Dual Axle Counter",
            "department": "SNT", "asset_type": "Signal Point Machine", "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP", "km_location": 126.0, "lat": 19.6675, "lng": 73.5110,
            "health_score": 58.0, "failure_probability": 0.52, "risk_category": "HIGH", "asset_criticality": 0.90
        }
    ]

    # 3. Targeted Demonstration Maintenance Tasks
    tasks = [
        # Task 1: Engineering Rail Defect (Key Demo Task)
        {
            "id": "TSK-ENG-001",
            "task_code": "MT-ENG-125-01",
            "title": "USFD Detected Rail Flaw (IMR) Defect Rectification",
            "department": "ENGINEERING",
            "task_type": "CORRECTIVE",
            "asset_id": "AST-ENG-RAIL-125",
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "km_location": 125.4,
            "estimated_duration_min": 120, # 2 Hours
            "overdue_days": 14,
            "requires_traffic_block": True,
            "requires_power_block": False,
            "required_team_type": "P-Way Gang",
            "required_machine_type": "CSM Tamping Machine",
            "priority_score": 92.5,
            "risk_level": "CRITICAL",
            "material_requirements": [{"item_code": "MAT-RAIL-60KG", "required_quantity": 2}]
        },
        # Task 2: TRD OHE Maintenance (Co-located at KM 125)
        {
            "id": "TSK-TRD-002",
            "task_code": "MT-TRD-125-02",
            "title": "25kV OHE Cantilever Adjustment & Contact Wire Inspection",
            "department": "TRD",
            "task_type": "PREVENTIVE",
            "asset_id": "AST-TRD-OHE-125",
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "km_location": 125.4,
            "estimated_duration_min": 60, # 1 Hour
            "overdue_days": 8,
            "requires_traffic_block": True,
            "requires_power_block": True,
            "required_team_type": "TRD Line Gang",
            "required_machine_type": "Tower Wagon",
            "priority_score": 78.0,
            "risk_level": "HIGH",
            "material_requirements": [{"item_code": "MAT-OHE-DROPPER", "required_quantity": 10}]
        },
        # Task 3: S&T Signal Maintenance (Adjacent at KM 126)
        {
            "id": "TSK-SNT-003",
            "task_code": "MT-SNT-126-03",
            "title": "Point Machine Backlash Adjustment & Track Circuit Testing",
            "department": "SNT",
            "task_type": "PREVENTIVE",
            "asset_id": "AST-SNT-SIG-126",
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "km_location": 126.0,
            "estimated_duration_min": 60, # 1 Hour
            "overdue_days": 6,
            "requires_traffic_block": True,
            "requires_power_block": False,
            "required_team_type": "Signal Maintenance Gang",
            "required_machine_type": None,
            "priority_score": 74.0,
            "risk_level": "HIGH",
            "material_requirements": []
        }
    ]

    # 4. Train Timetable (Morning rush + Daytime gap 11:15-14:15 + Afternoon trains)
    train_schedules = [
        {
            "train_id": "EMU-96001",
            "train_number": "96001",
            "train_name": "CSMT-Kasara Fast Local",
            "train_type": "SUBURBAN_EMU",
            "priority_class": 3,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=6, minutes=30),
            "exit_time": base_date + timedelta(hours=7, minutes=15),
            "delay_minutes": 0
        },
        {
            "train_id": "12533",
            "train_number": "12533",
            "train_name": "Pushpak Superfast Express",
            "train_type": "MAIL_EXPRESS",
            "priority_class": 2,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=7, minutes=45),
            "exit_time": base_date + timedelta(hours=8, minutes=30),
            "delay_minutes": 0
        },
        {
            "train_id": "22223",
            "train_number": "22223",
            "train_name": "CSMT-Sainagar Shirdi Vande Bharat",
            "train_type": "VANDE_BHARAT",
            "priority_class": 1,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=8, minutes=45),
            "exit_time": base_date + timedelta(hours=9, minutes=30),
            "delay_minutes": 0
        },
        {
            "train_id": "12123",
            "train_number": "12123",
            "train_name": "Deccan Queen Superfast Express",
            "train_type": "RAJDHANI",
            "priority_class": 1,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=9, minutes=45),
            "exit_time": base_date + timedelta(hours=10, minutes=15),
            "delay_minutes": 0
        },
        {
            "train_id": "22221",
            "train_number": "22221",
            "train_name": "CSMT-NZM Rajdhani Express",
            "train_type": "RAJDHANI",
            "priority_class": 1,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=10, minutes=40),
            "exit_time": base_date + timedelta(hours=11, minutes=10),
            "delay_minutes": 0
        },
        # Natural Headway Gap from 11:15 to 14:15 !
        {
            "train_id": "12102",
            "train_number": "12102",
            "train_name": "Jnaneswari Super Deluxe Express",
            "train_type": "MAIL_EXPRESS",
            "priority_class": 2,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=14, minutes=20),
            "exit_time": base_date + timedelta(hours=14, minutes=50),
            "delay_minutes": 0
        },
        {
            "train_id": "12859",
            "train_number": "12859",
            "train_name": "Gitanjali Express",
            "train_type": "MAIL_EXPRESS",
            "priority_class": 2,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=15, minutes=15),
            "exit_time": base_date + timedelta(hours=15, minutes=45),
            "delay_minutes": 0
        },
        {
            "train_id": "BOXN-9021",
            "train_number": "BOXN-9021",
            "train_name": "JNPT Container Freight Express",
            "train_type": "GOODS_FREIGHT",
            "priority_class": 5,
            "section_id": "KYN-IGP",
            "block_section_id": "BS-KSRA-IGP-UP",
            "entry_time": base_date + timedelta(hours=16, minutes=30),
            "exit_time": base_date + timedelta(hours=17, minutes=15),
            "delay_minutes": 0
        }
    ]

    # 5. Teams & Heavy Equipment
    teams = [
        {"id": "TM-ENG-01", "team_code": "GANG-ENG-KSRA-01", "name": "Kasara P-Way Heavy Gang", "department": "ENGINEERING", "base_km": 121.0},
        {"id": "TM-TRD-01", "team_code": "GANG-TRD-IGP-01", "name": "Igatpuri TRD Traction Gang", "department": "TRD", "base_km": 137.0},
        {"id": "TM-SNT-01", "team_code": "GANG-SNT-KSRA-01", "name": "Kasara Signal Relay Gang", "department": "SNT", "base_km": 121.0}
    ]

    equipment = [
        {"id": "EQ-CSM-01", "machine_code": "CSM-902", "machine_name": "09-32 CSM Continuous Action Tamping Machine", "department": "ENGINEERING", "current_km": 121.0, "transit_speed_kmph": 30.0, "setup_time_min": 15},
        {"id": "EQ-TW-01", "machine_code": "TW-21", "machine_name": "8-Wheeler Diesel-Hydraulic Tower Wagon", "department": "TRD", "current_km": 137.0, "transit_speed_kmph": 40.0, "setup_time_min": 10}
    ]

    # 6. Inventory items in stock
    inventory = {
        "MAT-RAIL-60KG": 40,
        "MAT-SLP-PSC": 250,
        "MAT-OHE-DROPPER": 120,
        "MAT-SIG-MOTOR": 15
    }

    return {
        "section": {"id": "KYN-IGP", "name": "Kalyan - Igatpuri Ghat Trunk Corridor", "start_km": 53.0, "end_km": 137.0},
        "stations": stations,
        "block_sections": block_sections,
        "assets": assets,
        "tasks": tasks,
        "train_schedules": train_schedules,
        "teams": teams,
        "equipment": equipment,
        "inventory": inventory
    }

"""
Prabal Verified Railway Knowledge Base
======================================
Stores authentic, loaded Indian Railways manuals and circulars.

GROUND RULE:
Only cite clauses that are present below. If a requested rule/document is not present,
the system must explicitly return "Source not available" instead of fabricating a citation.
"""

from typing import Dict, Any, List, Optional


RAILWAY_MANUALS_STORE = [
    {
        "doc_id": "IRPWM-2020-PARA-603",
        "manual": "Indian Railways Permanent Way Manual (IRPWM 2020)",
        "chapter": "Chapter 6: Track Maintenance Procedures & Traffic Blocks",
        "clause": "Para 603(2) - Traffic Blocks for Heavy Track Machines",
        "content": "For mechanized track maintenance utilizing CSM/BCM/DTS machines, a minimum continuous block of 2 hours is desirable. All adjacent lines must have cautionary speed orders imposed if safety clearance is less than 0.5m.",
        "tags": ["IRPWM", "Track Machine", "Block Duration", "Safety Clearance"]
    },
    {
        "doc_id": "ACTM-VOL2-PARA-20415",
        "manual": "Manual of AC Traction Maintenance (ACTM Vol II)",
        "chapter": "Chapter 4: Power Blocks and Permit-to-Work (PTW)",
        "clause": "Para 20415 - Power Block Protocol on 25kV 50Hz Traction",
        "content": "No person shall climb an OHE mast or bring any metallic tool within 2 meters of live 25kV conductors until a valid Permit-to-Work (PTW) is issued by the TPC (Traction Power Controller) and earth discharge rods are securely locked to the rail return.",
        "tags": ["ACTM", "TRD", "OHE", "Power Block", "Permit to Work", "Safety"]
    },
    {
        "doc_id": "SEM-PART1-SEC5",
        "manual": "Signal Engineering Manual (SEM Part I)",
        "chapter": "Section 5: Maintenance of Point Machines and Detection Circuits",
        "clause": "Para 19.5 - Point Machine Inspection & Disconnection Protocol",
        "content": "Before undertaking adjustments to switch rail facing point locks or point motors, a Disconnection Memo (Form S&T T/351) must be submitted to the Station Master on duty, and signals leading over the turnout must be set to DANGER.",
        "tags": ["SEM", "S&T", "Point Machine", "Disconnection Memo", "Safety"]
    },
    {
        "doc_id": "CRIS-COA-CIRCULAR-2023-04",
        "manual": "CRIS Joint Operating Guidelines (COA / TMS Coordination)",
        "chapter": "Guidelines for Integrated Corridor Maintenance Blocks (Shadow Blocks)",
        "clause": "Item 4.1 - Cross-Departmental Block Consolidation (Shadow Blocks)",
        "content": "Wherever Engineering, TRD, and S&T maintenance requirements coincide on the same section or adjacent track circuits, the Division Operating Branch shall grant one consolidated shadow block rather than granting separate disjointed blocks, thereby minimizing total train regulation time.",
        "tags": ["Shadow Block", "Consolidation", "Cross Department", "COA", "Operating"]
    }
]


def search_knowledge_base(query: str) -> List[Dict[str, Any]]:
    """
    Searches loaded project manuals. If no match is found, returns empty list
    so the agent explicitly outputs 'Source not available'.
    """
    q_lower = query.lower()
    matches = []
    
    for doc in RAILWAY_MANUALS_STORE:
        score = 0
        for tag in doc["tags"]:
            if tag.lower() in q_lower:
                score += 3
        if any(word in doc["content"].lower() for word in q_lower.split() if len(word) > 3):
            score += 2
        if any(word in doc["clause"].lower() for word in q_lower.split() if len(word) > 3):
            score += 4
            
        if score > 0:
            matches.append((score, doc))
            
    matches.sort(key=lambda x: x[0], reverse=True)
    return [m[1] for m in matches[:3]]

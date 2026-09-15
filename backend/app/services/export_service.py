"""
Plan Export & Reporting Service
===============================
Supports export of Weekly Block Plans, Monthly Maintenance Plans,
and Train Impact Reports in CSV, Excel (.xlsx), and PDF formats.
"""

import io
import csv
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime
from reportlab.lib.pagesizes import letter, landscape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors


class ExportService:
    """
    Generates downloadable reports in standard formats.
    """

    @classmethod
    def export_blocks_csv(cls, blocks: List[Dict[str, Any]]) -> str:
        """Generates CSV string of scheduled blocks."""
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Block Code", "Section ID", "Block Section", "Scheduled Start", "Scheduled End",
            "Duration (Min)", "Departments", "Tasks Count", "Separate Blocks Saved", "Utilization %", "Status"
        ])
        for b in blocks:
            writer.writerow([
                b.get("block_code", ""),
                b.get("section_id", ""),
                b.get("block_section_id", ""),
                b.get("scheduled_start", ""),
                b.get("scheduled_end", ""),
                b.get("duration_minutes", 0),
                ", ".join(b.get("departments", [])),
                b.get("tasks_count", 0),
                b.get("separate_blocks_avoided", 0),
                f"{b.get('utilization_pct', 0.0):.1f}%",
                b.get("status", "")
            ])
        return output.getvalue()

    @classmethod
    def export_blocks_excel(cls, blocks: List[Dict[str, Any]], metrics: Dict[str, Any]) -> bytes:
        """Generates multi-sheet Excel file (.xlsx)."""
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Sheet 1: Blocks
            block_rows = []
            for b in blocks:
                block_rows.append({
                    "Block Code": b.get("block_code", ""),
                    "Section": b.get("section_id", ""),
                    "Block Section": b.get("block_section_id", ""),
                    "Start Time": b.get("scheduled_start", ""),
                    "End Time": b.get("scheduled_end", ""),
                    "Duration (Min)": b.get("duration_minutes", 0),
                    "Departments": ", ".join(b.get("departments", [])),
                    "Tasks Count": b.get("tasks_count", 0),
                    "Blocks Saved": b.get("separate_blocks_avoided", 0),
                    "Utilization %": b.get("utilization_pct", 0.0),
                    "Status": b.get("status", "")
                })
            df_blocks = pd.DataFrame(block_rows)
            df_blocks.to_excel(writer, sheet_name='Optimized Blocks', index=False)

            # Sheet 2: KPIs & Comparison
            df_metrics = pd.DataFrame([metrics])
            df_metrics.to_excel(writer, sheet_name='Performance Metrics', index=False)

        return output.getvalue()

    @classmethod
    def export_blocks_pdf(cls, blocks: List[Dict[str, Any]], plan_code: str = "PLAN-2026-CR-001") -> bytes:
        """Generates formal printable PDF report with ReportLab."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=landscape(letter), rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        title_style = ParagraphStyle(
            name='TitleStyle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor("#0f172a"),
            spaceAfter=10
        )
        elements.append(Paragraph(f"PRABAL: Official Coordinated Weekly Block Plan ({plan_code})", title_style))
        elements.append(Paragraph(f"Generated: {datetime.now().strftime('%d-%b-%Y %H:%M:%S')} | Authority: Division Control Office", styles['Normal']))
        elements.append(Spacer(1, 15))

        # Table data
        table_data = [[
            "Block Code", "Section", "Start Time", "End Time", "Duration", "Departments", "Tasks", "Blocks Saved", "Utilization"
        ]]
        for b in blocks:
            s_time = b.get("scheduled_start", "").replace("T", " ")[:16]
            e_time = b.get("scheduled_end", "").replace("T", " ")[:16]
            table_data.append([
                b.get("block_code", ""),
                b.get("section_id", ""),
                s_time,
                e_time,
                f"{b.get('duration_minutes', 0)}m",
                ", ".join(b.get("departments", [])),
                str(b.get("tasks_count", 0)),
                str(b.get("separate_blocks_avoided", 0)),
                f"{b.get('utilization_pct', 0.0):.1f}%"
            ])

        t = Table(table_data, repeatRows=1)
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (4, 1), (-1, -1), 'CENTER'),
        ]))
        elements.append(t)
        doc.build(elements)
        return buffer.getvalue()


export_service = ExportService()

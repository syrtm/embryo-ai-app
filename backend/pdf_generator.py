import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime

# ReportLab'in varsayilan fontlarini kullanacagiz
# Turkce karakter icermeyen metinler kullanacagiz

def turkce_to_ascii(text):
    """Turkce karakterleri ASCII karakterlere donusturur"""
    if not text:
        return ""
    
    # Turkce karakter donusum tablosu
    tr_map = {
        'ç': 'c', 'Ç': 'C',  # ç, Ç
        'ğ': 'g', 'Ğ': 'G',  # ğ, Ğ
        'ı': 'i', 'İ': 'I',  # ı, İ
        'ö': 'o', 'Ö': 'O',  # ö, Ö
        'ş': 's', 'Ş': 'S',  # ş, Ş
        'ü': 'u', 'Ü': 'U',  # ü, Ü
    }
    
    for tr_char, ascii_char in tr_map.items():
        text = text.replace(tr_char, ascii_char)
    
    return text

def generate_embryo_report_pdf(report_data):
    """
    Embriyo raporu icin PDF olusturur
    """
    try:
        # PDF oluştur
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []
        
        # Baslik
        title_style = styles['Heading1']
        title_style.alignment = 1  # Ortalama
        elements.append(Paragraph(turkce_to_ascii('Embriyo Analiz Raporu'), title_style))
        elements.append(Spacer(1, 0.5 * inch))
        
        # Rapor bilgileri
        info_style = styles['Normal']
        info_style.fontSize = 12
        elements.append(Paragraph(turkce_to_ascii(f'Rapor ID: {report_data["id"]}'), info_style))
        
        # Tarih formati
        created_at = report_data.get("created_at", datetime.now().isoformat())
        if isinstance(created_at, str):
            try:
                # ISO format tarihini datetime'a cevir
                if "Z" in created_at:
                    created_at = created_at.replace("Z", "+00:00")
                date_obj = datetime.fromisoformat(created_at)
                formatted_date = date_obj.strftime("%d.%m.%Y %H:%M")
            except ValueError:
                formatted_date = created_at
        else:
            formatted_date = created_at.strftime("%d.%m.%Y %H:%M") if hasattr(created_at, 'strftime') else str(created_at)
            
        elements.append(Paragraph(turkce_to_ascii(f'Tarih: {formatted_date}'), info_style))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Hasta ve doktor bilgileri
        patient_name = report_data.get("patient_name", "Belirtilmemis")
        doctor_name = report_data.get("doctor_name", "Belirtilmemis")
        
        elements.append(Paragraph(turkce_to_ascii(f'Hasta: {patient_name}'), info_style))
        elements.append(Paragraph(turkce_to_ascii(f'Doktor: {doctor_name}'), info_style))
        elements.append(Spacer(1, 0.5 * inch))
        
        # Embriyo siniflandirma sonuclari
        elements.append(Paragraph(turkce_to_ascii('Embriyo Analiz Sonuclari'), styles['Heading2']))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Siniflandirma tablosu
        data = [
            [turkce_to_ascii('Parametre'), turkce_to_ascii('Deger')],
            [turkce_to_ascii('Embriyo Sinifi'), turkce_to_ascii(report_data.get("result", "Belirtilmemis"))],
            [turkce_to_ascii('Morfolojik Degerlendirme'), turkce_to_ascii(report_data.get("morphology", "Belirtilmemis"))],
            [turkce_to_ascii('Gelisim Asamasi'), turkce_to_ascii(report_data.get("development_stage", "Belirtilmemis"))]
        ]
        
        table = Table(data, colWidths=[3*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (1, 0), colors.teal),
            ('TEXTCOLOR', (0, 0), (1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (1, 0), 12),
            ('BACKGROUND', (0, 1), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 0.5 * inch))
        
        # Notlar
        notes = report_data.get("notes", "")
        if notes:
            elements.append(Paragraph(turkce_to_ascii('Doktor Notlari:'), styles['Heading3']))
            elements.append(Paragraph(turkce_to_ascii(notes), styles['Normal']))
        
        # PDF oluştur
        doc.build(elements)
        
        # Buffer'ı başa al ve içeriği döndür
        buffer.seek(0)
        return buffer.getvalue()
        
    except Exception as e:
        import traceback
        print(f"PDF oluşturma hatası: {str(e)}")
        print(f"Hata detayları:\n{traceback.format_exc()}")
        raise

def generate_medical_record_pdf(record_id):
    """
    Medikal kayit icin PDF olusturur
    """
    try:
        # PDF olustur
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []
        
        # Baslik
        title_style = styles['Heading1']
        title_style.alignment = 1  # Ortalama
        elements.append(Paragraph(turkce_to_ascii('Medikal Kayit'), title_style))
        elements.append(Spacer(1, 0.5 * inch))
        
        # Rapor bilgileri
        info_style = styles['Normal']
        info_style.fontSize = 12
        elements.append(Paragraph(turkce_to_ascii(f'Kayit ID: {record_id}'), info_style))
        elements.append(Paragraph(turkce_to_ascii(f'Tarih: {datetime.now().strftime("%d.%m.%Y %H:%M")}'), info_style))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Mock hasta ve doktor bilgileri
        elements.append(Paragraph(turkce_to_ascii(f'Hasta: Emma Thompson'), info_style))
        elements.append(Paragraph(turkce_to_ascii(f'Doktor: Dr. James Wilson'), info_style))
        elements.append(Spacer(1, 0.5 * inch))
        
        # Mock medikal kayit icerigi
        elements.append(Paragraph(turkce_to_ascii('Medikal Kayit Detaylari'), styles['Heading2']))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Mock icerik tablosu
        data = [
            [turkce_to_ascii('Parametre'), turkce_to_ascii('Deger')],
            [turkce_to_ascii('Kayit Turu'), turkce_to_ascii('Laboratuvar Sonuclari')],
            [turkce_to_ascii('Sonuc'), turkce_to_ascii('Normal')],
            [turkce_to_ascii('Referans Araligi'), turkce_to_ascii('0.5 - 1.5')]
        ]
        
        table = Table(data, colWidths=[3*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (1, 0), colors.teal),
            ('TEXTCOLOR', (0, 0), (1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (1, 0), 'CENTER'),
            ('FONTNAME', (0, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (1, 0), 12),
            ('BACKGROUND', (0, 1), (1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('ALIGN', (1, 0), (1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 0.5 * inch))
        
        # Mock notlar
        elements.append(Paragraph(turkce_to_ascii('Doktor Notlari:'), styles['Heading3']))
        elements.append(Paragraph(turkce_to_ascii('Tum degerler normal aralikta. Herhangi bir anormallik gozlenmedi.'), styles['Normal']))
        
        # PDF oluştur
        doc.build(elements)
        
        # Buffer'ı başa al ve içeriği döndür
        buffer.seek(0)
        return buffer.getvalue()
        
    except Exception as e:
        import traceback
        print(f"PDF oluşturma hatası: {str(e)}")
        print(f"Hata detayları:\n{traceback.format_exc()}")
        raise

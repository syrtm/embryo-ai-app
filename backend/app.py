from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash
import os
import re
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from datetime import datetime
import bcrypt
from werkzeug.utils import secure_filename
import time
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import base64
from torchvision import models

app = Flask(__name__)
CORS(app)

# Database initialization
DB_NAME = os.path.join(os.path.dirname(__file__), 'embryo_ai.db')

# Dosya yükleme için klasör
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def init_db():
    try:
        # Veritabanı dosyasının bulunduğu dizini oluştur
        os.makedirs(os.path.dirname(DB_NAME), exist_ok=True)
        
        # Veritabanına bağlan
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        # Tabloların var olup olmadığını kontrol et
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            print("Tablolar oluşturuluyor...")
            
            # Users tablosunu oluştur
            cursor.execute('''
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    full_name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    age INTEGER,
                    phone TEXT,
                    address TEXT,
                    blood_type TEXT,
                    emergency_contact TEXT,
                    emergency_phone TEXT,
                    allergies TEXT,
                    medical_history TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            print("Users tablosu oluşturuldu!")
            
            # Hasta-Doktor ilişki tablosu
            cursor.execute('''
                CREATE TABLE doctor_patient_relations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    doctor_id INTEGER NOT NULL,
                    patient_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (doctor_id) REFERENCES users (id),
                    FOREIGN KEY (patient_id) REFERENCES users (id)
                )
            ''')
            print("Doctor-Patient Relations tablosu oluşturuldu!")

            # Raporlar tablosu
            cursor.execute('''
                CREATE TABLE reports (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    doctor_id INTEGER NOT NULL,
                    image_path TEXT NOT NULL,
                    result TEXT,
                    confidence FLOAT,
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES users (id),
                    FOREIGN KEY (doctor_id) REFERENCES users (id)
                )
                ''')
            print("Reports tablosu oluşturuldu!")
            
            # Randevular tablosu
            cursor.execute('''
                CREATE TABLE appointments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    doctor_id INTEGER NOT NULL,
                    appointment_type TEXT NOT NULL,
                    linked_embryo_id INTEGER,
                    date_time TEXT NOT NULL,
                    status TEXT DEFAULT 'scheduled',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES users (id),
                    FOREIGN KEY (doctor_id) REFERENCES users (id),
                    FOREIGN KEY (linked_embryo_id) REFERENCES reports (id)
                )
                ''')
            print("Appointments tablosu oluşturuldu!")
        
            conn.commit()
        else:
            # Appointments tablosu var mı kontrol et, yoksa oluştur
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'")
            if not cursor.fetchone():
                print("Appointments tablosu oluşturuluyor...")
                cursor.execute('''
                    CREATE TABLE appointments (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        patient_id INTEGER NOT NULL,
                        doctor_id INTEGER NOT NULL,
                        appointment_type TEXT NOT NULL,
                        linked_embryo_id INTEGER,
                        date_time TEXT NOT NULL,
                        status TEXT DEFAULT 'scheduled',
                        notes TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (patient_id) REFERENCES users (id),
                        FOREIGN KEY (doctor_id) REFERENCES users (id),
                        FOREIGN KEY (linked_embryo_id) REFERENCES reports (id)
                    )
                ''')
                conn.commit()
                print("Appointments tablosu oluşturuldu!")
            else:
                print("Tüm tablolar zaten mevcut.")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"SQLite hatası: {str(e)}")
        raise
    except Exception as e:
        print(f"Beklenmeyen hata: {str(e)}")
        raise

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Gerekli alanların kontrolü
        required_fields = ['fullName', 'email', 'username', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "message": f"{field} alanı gereklidir"}), 400

        # Email formatı kontrolü
        if not re.match(r"[^@]+@[^@]+\.[^@]+", data['email']):
            return jsonify({"success": False, "message": "Geçersiz email formatı"}), 400

        # Rol kontrolü
        if data['role'] not in ['patient', 'doctor']:
            return jsonify({"success": False, "message": "Geçersiz rol"}), 400

        # Email ve kullanıcı adı benzersizlik kontrolü
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ? OR username = ?", 
                          (data['email'], data['username']))
            if cursor.fetchone():
                return jsonify({"success": False, "message": "Bu email veya kullanıcı adı zaten kullanılıyor"}), 400

            # Şifre hashleme
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

            # Kullanıcıyı veritabanına ekle
            cursor.execute("""
                INSERT INTO users (full_name, email, username, password, role)
                VALUES (?, ?, ?, ?, ?)
            """, (
                    data['fullName'],
                    data['email'],
                    data['username'],
                    hashed_password.decode('utf-8'),
                    data['role']
                ))
            conn.commit()

            return jsonify({"success": True, "message": "Kayıt başarılı"}), 201

    except Exception as e:
        print(f"Kayıt hatası: {str(e)}")
        return jsonify({"success": False, "message": "Kayıt işlemi sırasında bir hata oluştu"}), 500

@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'password', 'role']
        if not all(field in data for field in required_fields):
            return jsonify({
                'success': False,
                'message': 'Username, password ve rol alanları gereklidir'
            }), 400

        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, username, password, role FROM users 
                WHERE username = ? AND role = ?
            ''', (data['username'], data['role']))
            user = cursor.fetchone()

            if not user:
                return jsonify({
                    'success': False,
                    'message': 'Kullanıcı bulunamadı veya rol uyuşmuyor'
                }), 401

            # Şifre kontrolü
            stored_password = user[2]
            if isinstance(stored_password, str):
                stored_password = stored_password.encode('utf-8')
            
            if bcrypt.checkpw(data['password'].encode('utf-8'), stored_password):
                return jsonify({
                    'success': True,
                    'message': 'Giriş başarılı',
                    'user': {
                        'id': user[0],
                        'username': user[1],
                        'role': user[3]
                    }
                }), 200
            else:
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz şifre'
                }), 401

    except Exception as e:
        print(f"Login hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Giriş sırasında bir hata oluştu'
        }), 500

@app.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        # Veritabanında hasta yoksa örnek hastalar ekle
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users WHERE role = 'patient'")
            count = cursor.fetchone()[0]
            
            # Eğer veritabanında hasta yoksa örnek hastalar ekle
            if count == 0:
                print("Veritabanında hasta bulunamadı. Örnek hastalar ekleniyor...")
                sample_patients = [
                    ('Emma Jhonson', 'emmajhonson@gmail.com', 'emmajhonson', 'password123', 'patient', 34),
                    ('Emma Thompson', 'emma.thompson@example.com', 'emma', 'password123', 'patient', 34),
                    ('Sarah Johnson', 'sarah.johnson@example.com', 'sarah', 'password123', 'patient', 29),
                    ('Lisa Davis', 'lisa.davis@example.com', 'lisa', 'password123', 'patient', 31),
                    ('Emily Brown', 'emily.brown@example.com', 'emily', 'password123', 'patient', 36)
                ]
                
                for patient in sample_patients:
                    try:
                        hashed_password = bcrypt.hashpw(patient[3].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                        cursor.execute('''
                            INSERT INTO users (full_name, email, username, password, role, age)
                            VALUES (?, ?, ?, ?, ?, ?)
                        ''', (patient[0], patient[1], patient[2], hashed_password, patient[4], patient[5]))
                    except sqlite3.IntegrityError:
                        print(f"Hasta {patient[0]} zaten mevcut, atlanıyor.")
                        continue
                
                conn.commit()
                print("Örnek hastalar eklendi.")
            
            # Tüm hastaları getir
            cursor.execute('''
                SELECT id, full_name, email, username, age FROM users 
                WHERE role = 'patient'
            ''')
            patients = cursor.fetchall()
            
            return jsonify([{
                'id': patient[0],
                'full_name': patient[1],  # Frontend'de full_name kullanılıyor
                'name': patient[1],        # Geriye dönük uyumluluk için name de ekleyelim
                'email': patient[2],
                'username': patient[3],
                'age': patient[4]
            } for patient in patients]), 200
    except Exception as e:
        print(f"Hastalar getirilirken hata: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/<username>')
def get_user(username):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT full_name, email, phone, address, blood_type, 
                       emergency_contact, emergency_phone, allergies, medical_history, age 
                FROM users 
                WHERE username = ? AND role = 'patient'
            ''', (username,))
            result = cursor.fetchone()
            if result:
                return jsonify({
                    'full_name': result[0],
                    'email': result[1],
                    'phone': result[2],
                    'address': result[3],
                    'blood_type': result[4],
                    'emergency_contact': result[5],
                    'emergency_phone': result[6],
                    'allergies': result[7],
                    'medical_history': result[8],
                    'age': result[9]
                }), 200
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor')
def get_doctor():
    try:
        username = request.headers.get('X-User-Username')
        if not username:
            return jsonify({'error': 'Username not provided'}), 400

        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT full_name FROM users WHERE username = ? AND role = ?', (username, 'doctor'))
            result = cursor.fetchone()
            if result:
                return jsonify({'full_name': result[0]}), 200
            return jsonify({'error': 'Doctor not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/doctor/select-patient', methods=['POST'])
def select_patient():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['doctor_id', 'patient_id']):
            return jsonify({
                'success': False,
                'message': 'Doktor ID ve hasta ID gereklidir'
            }), 400

        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Doktor ve hastanın var olduğunu kontrol et
            cursor.execute('SELECT role FROM users WHERE id = ?', (data['doctor_id'],))
            doctor = cursor.fetchone()
            cursor.execute('SELECT role FROM users WHERE id = ?', (data['patient_id'],))
            patient = cursor.fetchone()

            if not doctor or doctor[0] != 'doctor':
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz doktor ID'
                }), 400

            if not patient or patient[0] != 'patient':
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz hasta ID'
                }), 400

            # Aynı ilişki var mı kontrol et
            cursor.execute('''
                SELECT id FROM doctor_patient_relations WHERE doctor_id = ? AND patient_id = ?
            ''', (data['doctor_id'], data['patient_id']))
            if cursor.fetchone():
                return jsonify({
                    'success': True,
                    'message': 'Hasta zaten seçildi'
                }), 200

            # İlişkiyi kaydet
            cursor.execute('''
                INSERT INTO doctor_patient_relations (doctor_id, patient_id)
                VALUES (?, ?)
            ''', (data['doctor_id'], data['patient_id']))
            
            conn.commit()

            return jsonify({
                'success': True,
                'message': 'Hasta başarıyla seçildi'
            }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Hasta seçilirken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/doctor/patients', methods=['GET'])
def get_doctor_patients():
    try:
        doctor_id = request.args.get('doctor_id')
        if not doctor_id:
            return jsonify({
                'success': False,
                'message': 'Doktor ID\'si gereklidir'
            }), 400

        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Doktor var mı kontrol et
            cursor.execute("SELECT id FROM users WHERE id = ? AND role = 'doctor'", (doctor_id,))
            doctor = cursor.fetchone()
            if not doctor:
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz doktor ID\'si'
                }), 404
            
            # Önce doktorun seçtiği hastaları al
            cursor.execute('''
                SELECT u.id, u.full_name, u.email, u.username, u.age,
                       CASE WHEN dpr.doctor_id IS NOT NULL THEN 1 ELSE 0 END as is_selected
                FROM users u
                LEFT JOIN doctor_patient_relations dpr 
                    ON u.id = dpr.patient_id AND dpr.doctor_id = ?
                WHERE u.role = 'patient'
            ''', (doctor_id,))
            
            patients = cursor.fetchall()
            
            # Eğer hiç hasta yoksa, get_patients fonksiyonunu çağır
            if not patients:
                print("Doktor için hasta bulunamadı, tüm hastalar getiriliyor...")
                # get_patients fonksiyonunu çağırarak hastaları oluştur
                get_patients()
                
                # Tekrar sorgula
                cursor.execute('''
                    SELECT u.id, u.full_name, u.email, u.username, u.age,
                           CASE WHEN dpr.doctor_id IS NOT NULL THEN 1 ELSE 0 END as is_selected
                    FROM users u
                    LEFT JOIN doctor_patient_relations dpr 
                        ON u.id = dpr.patient_id AND dpr.doctor_id = ?
                    WHERE u.role = 'patient'
                ''', (doctor_id,))
                
                patients = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'patients': [{
                    'id': patient[0],
                    'full_name': patient[1],
                    'email': patient[2],
                    'username': patient[3],
                    'age': patient[4],
                    'is_selected': bool(patient[5])
                } for patient in patients]
            }), 200

    except Exception as e:
        print(f"Hasta listesi alınırken hata: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Hasta listesi alınırken bir hata oluştu'
        }), 500

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-report', methods=['POST'])
def upload_report():
    try:
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'message': 'Dosya yüklenmedi'
            }), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'Dosya seçilmedi'
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'message': 'Geçersiz dosya formatı'
            }), 400

        # Dosya adını güvenli hale getir
        filename = secure_filename(file.filename)
        # Benzersiz dosya adı oluştur
        unique_filename = f"{int(time.time())}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)

        # Uploads klasörünü oluştur
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

        # Dosyayı kaydet
        file.save(filepath)

        # Veritabanına kaydet
        data = request.form
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO reports (patient_id, doctor_id, image_path, result, confidence, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                data['patient_id'],
                data['doctor_id'],
                unique_filename,
                data.get('result'),
                data.get('confidence'),
                data.get('notes')
            ))
            conn.commit()

        return jsonify({
            'success': True,
            'message': 'Rapor başarıyla yüklendi'
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Rapor yüklenirken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        user_id = request.args.get('user_id')
        user_role = request.args.get('role')

        if not user_id or not user_role:
            return jsonify({
                'success': False,
                'message': 'Kullanıcı ID ve rol gereklidir'
            }), 400

        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            if user_role == 'doctor':
                # Doktorun tüm raporlarını getir
                cursor.execute('''
                    SELECT r.*, u.full_name as patient_name
                    FROM reports r
                    INNER JOIN users u ON r.patient_id = u.id
                    WHERE r.doctor_id = ?
                    ORDER BY r.created_at DESC
                ''', (user_id,))
            else:
                # Hastanın kendi raporlarını getir
                cursor.execute('''
                    SELECT r.*, u.full_name as doctor_name
                    FROM reports r
                    INNER JOIN users u ON r.doctor_id = u.id
                    WHERE r.patient_id = ?
                    ORDER BY r.created_at DESC
                ''', (user_id,))

            reports = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'reports': [{
                    'id': r[0],
                    'patient_id': r[1],
                    'doctor_id': r[2],
                    'image_path': r[3],
                    'result': r[4],
                    'confidence': r[5],
                    'notes': r[6],
                    'created_at': r[7],
                    'other_party_name': r[8]  # Hasta için doktor adı, doktor için hasta adı
                } for r in reports]
            }), 200

    except Exception as e:
        print(f"Error fetching report: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Rapor alınırken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/report/<int:report_id>', methods=['GET'])
def get_report(report_id):
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Raporu ID'ye göre getir
            cursor.execute('''
                SELECT r.*, 
                       p.full_name as patient_name, 
                       d.full_name as doctor_name
                FROM reports r
                INNER JOIN users p ON r.patient_id = p.id
                INNER JOIN users d ON r.doctor_id = d.id
                WHERE r.id = ?
            ''', (report_id,))
            
            report = cursor.fetchone()
            
            if not report:
                return jsonify({
                    'success': False,
                    'message': 'Rapor bulunamadı'
                }), 404
            
            return jsonify({
                'success': True,
                'report': {
                    'id': report[0],
                    'patient_id': report[1],
                    'doctor_id': report[2],
                    'image_path': report[3],
                    'result': report[4],
                    'confidence': report[5],
                    'notes': report[6],
                    'created_at': report[7],
                    'patient_name': report[8],
                    'doctor_name': report[9]
                }
            }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Rapor getirilirken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/reset-passwords', methods=['POST'])
def reset_passwords():
    try:
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT id, password FROM users')
            users = cursor.fetchall()
            
            for user in users:
                # Yeni hash oluştur
                new_hash = bcrypt.hashpw('123456'.encode('utf-8'), bcrypt.gensalt())
                cursor.execute('UPDATE users SET password = ? WHERE id = ?', 
                             (new_hash.decode('utf-8'), user[0]))
            
            conn.commit()
            return jsonify({
                'success': True,
                'message': 'Şifreler başarıyla güncellendi'
            }), 200
            
    except Exception as e:
        print(f"Şifre güncelleme hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Şifreler güncellenirken bir hata oluştu'
        }), 500

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['patientId', 'doctorId', 'appointmentType', 'dateTime']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'{field} alanı gereklidir'
                }), 400
        
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Check if patient and doctor exist
            cursor.execute('SELECT id FROM users WHERE id = ? AND role = \'patient\'', (data['patientId'],))
            if not cursor.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz hasta ID'
                }), 404
            
            cursor.execute('SELECT id FROM users WHERE id = ? AND role = \'doctor\'', (data['doctorId'],))
            if not cursor.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz doktor ID'
                }), 404
            
            # Create the appointment
            cursor.execute('''
                INSERT INTO appointments (patient_id, doctor_id, appointment_type, linked_embryo_id, date_time, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                data['patientId'],
                data['doctorId'],
                data['appointmentType'],
                data.get('linkedEmbryo'),  # Optional field
                data['dateTime'],
                data.get('notes')  # Optional field
            ))
            
            appointment_id = cursor.lastrowid
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Randevu başarıyla oluşturuldu',
                'appointmentId': appointment_id
            }), 201
    
    except Exception as e:
        print(f"Randevu oluşturma hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Randevu oluşturulurken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    try:
        user_id = request.args.get('userId')
        role = request.args.get('role')
        
        if not user_id or not role:
            return jsonify({
                'success': False,
                'message': 'userId ve role parametreleri gereklidir'
            }), 400
        
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            if role == 'patient':
                # Get appointments for a patient
                cursor.execute('''
                    SELECT a.*, u.full_name as doctor_name, r.result as embryo_grade
                    FROM appointments a
                    INNER JOIN users u ON a.doctor_id = u.id
                    LEFT JOIN reports r ON a.linked_embryo_id = r.id
                    WHERE a.patient_id = ?
                    ORDER BY a.date_time ASC
                ''', (user_id,))
                
                appointments = cursor.fetchall()
                
                return jsonify({
                    'success': True,
                    'appointments': [{
                        'id': a[0],
                        'patient_id': a[1],
                        'doctor_id': a[2],
                        'appointment_type': a[3],
                        'linked_embryo_id': a[4],
                        'date_time': a[5],
                        'status': a[6],
                        'notes': a[7],
                        'created_at': a[8],
                        'other_party_name': a[9],  # doctor_name
                        'embryo_grade': a[10]
                    } for a in appointments]
                }), 200
            
            elif role == 'doctor':
                # Get appointments for a doctor
                cursor.execute('''
                    SELECT a.*, u.full_name as patient_name, r.result as embryo_grade
                    FROM appointments a
                    INNER JOIN users u ON a.patient_id = u.id
                    LEFT JOIN reports r ON a.linked_embryo_id = r.id
                    WHERE a.doctor_id = ?
                    ORDER BY a.date_time ASC
                ''', (user_id,))
                
                appointments = cursor.fetchall()
                
                return jsonify({
                    'success': True,
                    'appointments': [{
                        'id': a[0],
                        'patient_id': a[1],
                        'doctor_id': a[2],
                        'appointment_type': a[3],
                        'linked_embryo_id': a[4],
                        'date_time': a[5],
                        'status': a[6],
                        'notes': a[7],
                        'created_at': a[8],
                        'other_party_name': a[9],  # patient_name
                        'embryo_grade': a[10]
                    } for a in appointments]
                }), 200
            
            else:
                return jsonify({
                    'success': False,
                    'message': 'Geçersiz rol'
                }), 400
    
    except Exception as e:
        print(f"Randevuları getirme hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Randevular alınırken bir hata oluştu',
            'error': str(e)
        }), 500

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment_status(appointment_id):
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({
                'success': False,
                'message': 'status alanı gereklidir'
            }), 400
        
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Check if appointment exists
            cursor.execute('SELECT id FROM appointments WHERE id = ?', (appointment_id,))
            if not cursor.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Randevu bulunamadı'
                }), 404
            
            # Update appointment status
            cursor.execute('UPDATE appointments SET status = ? WHERE id = ?', 
                         (data['status'], appointment_id))
            
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Randevu durumu güncellendi'
            }), 200
    
    except Exception as e:
        print(f"Randevu güncelleme hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Randevu güncellenirken bir hata oluştu',
            'error': str(e)
        }), 500

# Model sınıf tanımlamaları - embryo_classes.py dosyasından içe aktar
from embryo_classes import EMBRYO_CLASSES





# Model yükleme fonksiyonu

# Model yükleme fonksiyonu
def load_model():
    try:
        # ResNet50 modelini oluştur
        model = models.resnet50()
        
        # Eğitilmiş model ağırlıklarını yükle
        checkpoint = torch.load("best_resnet50_clean.pth", map_location=torch.device("cpu"))
        
        # Modeli yeniden yapılandır - tam olarak kaydedilen modele uygun olacak şekilde
        num_classes = 19  # Kaydedilen modeldeki sınıf sayısı
        model.fc = torch.nn.Sequential(
            torch.nn.Dropout(0.5),
            torch.nn.Linear(model.fc.in_features, num_classes)
        )
        
        model.load_state_dict(checkpoint)
        model.eval()
        return model
    except Exception as e:
        print(f"Model yükleme hatası: {str(e)}")
        raise

# Model tahmin fonksiyonu
def predict_embryo_class(image_data):
    try:
        print("Tahmin işlemi başlıyor...")
        # Base64'ten resmi decode et
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        print(f"Resim başarıyla açıldı. Boyut: {image.size}, Format: {image.format}")
        
        # Resmi model için hazırla - eğitim sırasında kullanılan dönüşümlerle tam olarak eşleştir
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
        ])
        
        print("Resim dönüştürülüyor...")
        input_tensor = transform(image)
        print(f"Tensor boyutu: {input_tensor.shape}")
        input_batch = input_tensor.unsqueeze(0)
        print(f"Batch tensor boyutu: {input_batch.shape}")
        
        # Model tahmini yap
        print("Model yükleniyor...")
        model = load_model()
        print("Model yüklendi, tahmin yapılıyor...")
        
        with torch.no_grad():
            output = model(input_batch)
            print(f"Model çıktı boyutu: {output.shape}")
            
        # En yüksek olasılıklı sınıfı bul
        _, predicted_idx = torch.max(output, 1)
        print(f"Tahmin edilen indeks: {predicted_idx.item()}")
        
        # main.py'deki sınıf isimleri ile eşleştir
        class_names = [
            "2-1-1", "2-1-2", "2-1-3", "2-2-1", "2-2-2", "2-2-3",
            "2-3-3",
            "3-1-1", "3-1-2", "3-1-3",
            "3-2-1", "3-2-2", "3-2-3",
            "3-3-2", "3-3-3",
            "4-2-2",
            "Arrested", "Early", "Morula"
        ]


        # İndeksin sınıf listesinin sınırları içinde olduğundan emin ol
        if predicted_idx.item() >= len(class_names):
            print(f"UYARI: Tahmin indeksi ({predicted_idx.item()}) sınıf listesinin uzunluğundan ({len(class_names)}) büyük!")
            predicted_idx = torch.tensor([len(class_names) - 1])  # Son sınıfı kullan
        
        predicted_class = class_names[predicted_idx.item()]
        print(f"Tahmin edilen sınıf: {predicted_class}")
        
        # Tahmin güvenini hesapla
        probabilities = torch.nn.functional.softmax(output, dim=1)[0]
        confidence = probabilities[predicted_idx.item()].item() * 100  # Yüzde olarak
        print(f"Güven skoru: %{round(confidence, 2)}")
        
        # Sınıf detaylarını al
        if predicted_class in EMBRYO_CLASSES:
            class_details = EMBRYO_CLASSES[predicted_class]
            print(f"Sınıf detayları: {class_details}")
        else:
            print(f"UYARI: {predicted_class} sınıfı EMBRYO_CLASSES sözlüğünde bulunamadı!")
            class_details = {
                'hücre_sayısı': 'Bilinmiyor',
                'fragmentasyon': 'Bilinmiyor',
                'simetri': 'Bilinmiyor'
            }
        
        print("Tahmin işlemi tamamlandı.")
        return {
            'success': True,
            'class': predicted_class,
            'details': class_details,
            'confidence': round(confidence, 2)
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/api/analyze-embryo', methods=['POST'])
def analyze_embryo():
    try:
        data = request.get_json()
        image_data = data.get('image')
        patient_id = data.get('patient_id')
        doctor_id = data.get('doctor_id')
        notes = data.get('notes', '')
        
        if not image_data:
            return jsonify({
                'success': False,
                'error': 'Resim verisi bulunamadı'
            })
        
        if not patient_id or not doctor_id:
            return jsonify({
                'success': False,
                'error': 'Hasta ID ve Doktor ID gereklidir'
            })
            
        # Analiz sonucunu al
        result = predict_embryo_class(image_data)
        
        if result['success']:
            # Base64 görüntüyü kaydet
            image_bytes = base64.b64decode(image_data.split(',')[1])
            # Benzersiz dosya adı oluştur
            unique_filename = f"{int(time.time())}_embryo.jpg"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            
            # Uploads klasörünü oluştur
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            
            # Dosyayı kaydet
            with open(filepath, 'wb') as f:
                f.write(image_bytes)
            
            # Veritabanına raporu kaydet
            with sqlite3.connect(DB_NAME) as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO reports (patient_id, doctor_id, image_path, result, confidence, notes)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    patient_id,
                    doctor_id,
                    unique_filename,
                    result['class'],
                    result['confidence'],
                    notes
                ))
                conn.commit()
                
                # Eklenen raporun ID'sini al
                report_id = cursor.lastrowid
                result['report_id'] = report_id
                result['message'] = 'Rapor başarıyla kaydedildi'
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

# Appointment endpoints
# This duplicate route was removed to fix the conflict with the existing create_appointment function

# This duplicate route was removed to fix the conflict with the existing get_appointments function

@app.route('/api/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    try:
        data = request.get_json()
        
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            
            # Check if appointment exists
            cursor.execute('SELECT id FROM appointments WHERE id = ?', (appointment_id,))
            if not cursor.fetchone():
                return jsonify({
                    'success': False,
                    'message': 'Appointment not found'
                }), 404
            
            # Update fields that are provided
            update_fields = []
            update_values = []
            
            if 'status' in data:
                update_fields.append('status = ?')
                update_values.append(data['status'])
            
            if 'dateTime' in data:
                update_fields.append('date_time = ?')
                update_values.append(data['dateTime'])
            
            if 'notes' in data:
                update_fields.append('notes = ?')
                update_values.append(data['notes'])
            
            if not update_fields:
                return jsonify({
                    'success': False,
                    'message': 'No fields to update'
                }), 400
            
            # Build and execute the update query
            update_query = f'''
                UPDATE appointments
                SET {', '.join(update_fields)}
                WHERE id = ?
            '''
            
            update_values.append(appointment_id)
            cursor.execute(update_query, update_values)
            conn.commit()
            
            return jsonify({
                'success': True,
                'message': 'Appointment updated successfully'
            }), 200
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Error updating appointment',
            'error': str(e)
        }), 500

# PDF oluşturma ve indirme endpoint'i
@app.route('/api/reports/<int:report_id>/pdf', methods=['GET'])
def generate_embryo_report_pdf(report_id):
    print(f"PDF oluşturma isteği alındı: report_id={report_id}")
    try:
        # Kullanıcı kimliğini doğrula
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Kullanıcı kimliği gerekli'
            }), 400
        
        # Veritabanı bağlantısı oluştur
        conn = sqlite3.connect(DB_NAME)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Raporu veritabanından al
        cursor.execute('''
            SELECT r.*, 
                   p.full_name as patient_name, 
                   d.full_name as doctor_name
            FROM reports r
            JOIN users p ON r.patient_id = p.id
            JOIN users d ON r.doctor_id = d.id
            WHERE r.id = ?
        ''', (report_id,))
        
        report = cursor.fetchone()
        
        if not report:
            return jsonify({
                'success': False,
                'message': 'Rapor bulunamadı'
            }), 404
        
        # Kullanıcının bu raporu görüntüleme yetkisi var mı kontrol et
        if str(report['patient_id']) != user_id and str(report['doctor_id']) != user_id:
            return jsonify({
                'success': False,
                'message': 'Bu raporu görüntüleme yetkiniz yok'
            }), 403
        
        # PDF oluşturucu modülünü import et
        from pdf_generator import generate_embryo_report_pdf as pdf_generator
        
        # Report nesnesini sözlük olarak dönüştür
        report_dict = dict(report)
        
        # PDF oluştur
        pdf_content = pdf_generator(report_dict)
        
        # PDF'i döndür
        response = make_response(pdf_content)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename=embriyo-rapor-{report_id}.pdf'
        
        return response
        
    except Exception as e:
        print(f"PDF oluşturma hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'PDF oluşturulurken bir hata oluştu',
            'error': str(e)
        }), 500

# Medikal kayıtlar için PDF endpoint'i
@app.route('/api/medical-records/<int:record_id>/pdf', methods=['GET'])
def generate_medical_record_pdf(record_id):
    print(f"Medikal kayıt PDF isteği alındı: record_id={record_id}")
    try:
        # Kullanıcı kimliğini doğrula
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({
                'success': False,
                'message': 'Kullanıcı kimliği gerekli'
            }), 400
        
        # PDF oluşturucu modülünü import et
        from pdf_generator import generate_medical_record_pdf as pdf_generator
        
        # PDF oluştur
        pdf_content = pdf_generator(record_id)
        
        # PDF'i döndür
        response = make_response(pdf_content)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename=medikal-kayit-{record_id}.pdf'
        
        return response
        
    except Exception as e:
        print(f"PDF oluşturma hatası: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'PDF oluşturulurken bir hata oluştu',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)

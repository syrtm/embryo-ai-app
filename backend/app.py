from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash
import os
import re
import bcrypt
from werkzeug.utils import secure_filename
import time

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
            
            conn.commit()
        else:
            print("Tablolar zaten mevcut.")
        
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
        with sqlite3.connect(DB_NAME) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, full_name, email, username, age FROM users 
                WHERE role = 'patient'
            ''')
            patients = cursor.fetchall()
            return jsonify([{
                'id': patient[0],
                'name': patient[1],
                'email': patient[2],
                'username': patient[3],
                'age': patient[4]
            } for patient in patients]), 200
    except Exception as e:
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
            
            # Önce doktorun seçtiği hastaları al
            cursor.execute('''
                SELECT u.id, u.full_name, u.email, u.username,
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
                    'is_selected': bool(patient[4])
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
        return jsonify({
            'success': False,
            'message': 'Raporlar listelenirken bir hata oluştu',
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

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)

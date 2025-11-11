from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# SQLite DB config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskjournal.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200))
    completed = db.Column(db.Boolean, default=False)
    important = db.Column(db.Boolean, default=False)
    from_my_day = db.Column(db.Boolean, default=False)
    user_email = db.Column(db.String(100))
    planned_date = db.Column(db.String(100))  # <-- ADD THIS
# Create tables
with app.app_context():
    db.create_all()

# Register route'

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    hashed_pw = generate_password_hash(password)
    new_user = User(email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        return jsonify({'message': 'Login successful', 'user': {'email': user.email}})
    return jsonify({'message': 'Invalid credentials'}), 401


# ✅ Create Task - This is the version you should keep
@app.route('/api/tasks', methods=['POST'])
def create_task_api():  # <-- renamed function here
    data = request.get_json()
    task = Task(
        text=data.get("text"),
        completed=data.get("completed", False),
        important=data.get("important", False),
        from_my_day=data.get("from_my_day", False),
        planned_date=data.get("planned_date"),
        user_email=data.get("user_email")
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"id": task.id, "message": "Task created"}), 201


# ✅ Get all tasks
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    task_list = [{
        "id": t.id,
        "text": t.text,
        "completed": t.completed,
        "important": t.important,
        "planned_date": t.planned_date,
        "from_my_day": t.from_my_day,
        "user_email": t.user_email
    } for t in tasks]
    return jsonify(task_list)


# ✅ Update task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    task.text = data.get('text', task.text)
    task.completed = data.get('completed', task.completed)
    task.important = data.get('important', task.important)
    task.from_my_day = data.get('from_my_day', task.from_my_day)
    task.planned_date = data.get('planned_date', task.planned_date)
    db.session.commit()
    return jsonify({"message": "Task updated"})


# ✅ Delete task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})


if __name__ == '__main__':
    app.run(debug=True)

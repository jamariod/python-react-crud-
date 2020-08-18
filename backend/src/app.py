from flask import Flask, request, jsonify 
from flask_pymongo import PyMongo, ObjectId 
from flask_cors import CORS 

app = Flask(__name__)
app.config['MONGO_URI']='mongodb://localhost/pythonreactdb'
mongo = PyMongo(app) 

CORS(app)

db = mongo.db.items 

@app.route('/items', methods=['POST'])
def createTodo():
    id = db.insert({
        'name': request.json['name'],
        'date': request.json['date']
    })
    return jsonify(str(ObjectId(id))) 
@app.route('/items', methods=['GET'])
def getTodos():
    items = []
    for doc in db.find():
        items.append({
            'id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'date': doc['date']
        })
    return jsonify(items)
@app.route('/items/<id>', methods=['GET'])
def getTodo(id):
    print(id)
    item = db.find_one({'_id': ObjectId(id)})
    print(item)
    return jsonify({
        '_id': str(ObjectId(item['_id'])),
        'name': item['name'],
        'date': item['date']
    })
@app.route('/items/<id>', methods=['DELETE'])
def deleteTodo(id):
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Item deleted'})
@app.route('/items/<id>', methods=['PUT'])
def updateTodo(id):
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json['name'],
        'date': request.json['date'],
    }})
    return jsonify({'msg': 'Item Updated'})
if __name__ == "__main__":
    app.run(debug=True)
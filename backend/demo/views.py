# views.py

from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Todo
from .serializers import TodoSerializer
import json
from pymongo import MongoClient
from bson import ObjectId
import json

clint= MongoClient('mongodb+srv://karthidharshini513:dharshinisrihari239@krishna.4aeajin.mongodb.net/')
db = clint["tododb"]  # You can rename this to whatever DB name you want
collection = db["todos"]  # Collection name

@method_decorator(csrf_exempt, name='dispatch')
class TodoView(View):

    def get(self, request):
        todos = Todo.objects.all()
        serializer = TodoSerializer(todos, many=True)
        return JsonResponse({"todos": serializer.data})

    def post(self, request):
        data = json.loads(request.body)
        todo = Todo(title=data.get("title", ""), completed=data.get("completed", False))
        todo.save()
        serializer = TodoSerializer(todo)
        return JsonResponse(serializer.data)
    

@method_decorator(csrf_exempt, name='dispatch')
class TodoDetailView(View):
    def put(self, request, id):
        try:
            data = json.loads(request.body)
            todo = Todo.objects.get(id=id)
            todo.title = data.get("title", todo.title)
            todo.completed = data.get("completed", todo.completed)
            todo.save()
            serializer = TodoSerializer(todo)
            return JsonResponse(serializer.data)
        except Todo.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

    def delete(self, request, id):
        try:
            todo = Todo.objects.get(id=id)
            todo.delete()
            return JsonResponse({"message": "Deleted"})
        except Todo.DoesNotExist:
            return JsonResponse({"error": "Not found"}, status=404)

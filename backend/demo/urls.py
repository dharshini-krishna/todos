from django.urls import path
from .views import TodoView, TodoDetailView

urlpatterns = [
    path("todos/", TodoView.as_view()),
    path("todos/<int:id>/", TodoDetailView.as_view()),
]

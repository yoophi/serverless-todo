import abc
import uuid


class AbstractTodoRepository(abc.ABC):
    @abc.abstractmethod
    def get(self, todo_id: str):
        raise NotImplementedError

    @abc.abstractmethod
    def get_list(
        self,
    ):
        raise NotImplementedError

    @abc.abstractmethod
    def create(self, title=None):
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, todo_id, title):
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, todo_id):
        raise NotImplementedError


class MemTodoRepository(AbstractTodoRepository):
    def create(self, title=None):
        if title is None:
            raise ValueError

        todo = {
            "id": str(uuid.uuid4()),
            "title": title,
            "completed": False,
        }
        self.todos.append(todo)
        return todo

    def update(self, todo_id, title):
        todo = self.get(todo_id)
        if todo is None:
            return None

        todo["title"] = title
        self.todos = [
            todo if str(item["id"]) == str(todo_id) else item for item in self.todos
        ]

        return todo

    def delete(self, todo_id):
        self.todos = list(
            filter(lambda obj: str(obj["id"]) != str(todo_id), self.todos)
        )

    def __init__(self, todos):
        print("initializing MemTodoRepository")
        print("todos", todos)
        self.todos = todos

    def get(self, todo_id):
        try:
            return next(todo for todo in self.todos if str(todo["id"]) == str(todo_id))
        except StopIteration:
            return None

    def get_list(
        self,
    ):
        return self.todos

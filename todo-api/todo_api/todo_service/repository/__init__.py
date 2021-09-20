import abc


class AbstractTodoRepository(abc.ABC):
    @abc.abstractmethod
    def get(self, todo_id: str):
        raise NotImplementedError

    @abc.abstractmethod
    def get_list(self, ):
        raise NotImplementedError


class MemTodoRepository(AbstractTodoRepository):
    def __init__(self, todos):
        self.todos = todos

    def get(self, todo_id):
        try:
            return next(todo for todo in self.todos if todo['id'] == int(todo_id))
        except StopIteration:
            return None

    def get_list(self, ):
        return self.todos

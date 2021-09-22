import abc
import uuid

import boto3
from botocore.exceptions import ClientError


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
    def __init__(self, todos):
        self.todos = todos

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

    def get(self, todo_id):
        try:
            return next(todo for todo in self.todos if str(todo["id"]) == str(todo_id))
        except StopIteration:
            return None

    def get_list(
            self,
    ):
        return self.todos


class DynamoDBRepository(AbstractTodoRepository):
    def __init__(self, table_name, is_local=False):
        if is_local:
            dynamodb = boto3.resource('dynamodb', endpoint_url="http://dynamodb:8000")
        else:
            dynamodb = boto3.resource('dynamodb')

        self.table = dynamodb.Table(table_name, )

    def get(self, todo_id: str):
        try:
            resp = self.table.get_item(Key={'id': todo_id, })
        except ClientError as e:
            print(e.response['Error']['Message'])
        else:
            return resp.get('Item')

    def get_list(self):
        resp = self.table.scan()
        return resp.get('Items', [])

    def create(self, title=None):
        try:
            todo_id = str(uuid.uuid4())
            self.table.put_item(
                Item={
                    'id': todo_id,
                    'title': title,
                    'completed': False,
                }
            )
        except Exception as e:
            print(type(e), str(e))
            return False

        return self.get(todo_id)

    def update(self, todo_id, title):
        try:
            self.table.update_item(
                Key={
                    'id': todo_id,
                },
                UpdateExpression='set title=:t',
                ExpressionAttributeValues={
                    ':t': title,
                },
                ReturnValues='UPDATED_NEW',
            )
        except Exception as e:
            print(type(e), str(e))
            return False

        return self.get(todo_id)

    def delete(self, todo_id):
        try:
            resp = self.table.delete_item(
                Key={
                    'id': todo_id,
                },
            )
        except ClientError as e:
            print(type(e), str(e))
            return False
        else:
            return resp

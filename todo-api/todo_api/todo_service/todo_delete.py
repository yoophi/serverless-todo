import json

from todo_service.repository import AbstractTodoRepository


def lambda_handler(event, context, todo_repository: AbstractTodoRepository):
    todo_id = event['pathParameters']['id']
    todo_repository.delete(todo_id)

    return {
        "statusCode": 200,
        "body": json.dumps({}),
    }

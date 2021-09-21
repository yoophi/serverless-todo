import json

from todo_service.repository import AbstractTodoRepository


def lambda_handler(event, context, todo_repository: AbstractTodoRepository):
    todo_id = event['pathParameters']['id']
    payload = json.loads(event['body'])
    todo = todo_repository.update(todo_id, title=payload.get('title'))
    if not todo:
        return {
            "statusCode": 404,
            "body": json.dumps({
                "message": 'not found'
            })
        }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "data": todo,
        }),
    }

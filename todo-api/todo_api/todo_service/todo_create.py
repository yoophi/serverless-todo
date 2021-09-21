import json

from todo_service.repository import AbstractTodoRepository


def lambda_handler(event, context, todo_repository: AbstractTodoRepository):
    payload = json.loads(event['body'])
    todo = todo_repository.create(title=payload.get('title'))
    if not todo:
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": 'failed'
            })
        }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "data": todo,
        }),
    }

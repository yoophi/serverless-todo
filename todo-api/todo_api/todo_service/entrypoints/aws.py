import json

from todo_service.repository import AbstractTodoRepository, MemTodoRepository
from todo_service.todos import TODO_DATA


def todo_list(event, context, todo_repository: AbstractTodoRepository):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "data": todo_repository.get_list(),
        }),
    }


def todo_create(event, context, todo_repository: AbstractTodoRepository):
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


def todo_delete(event, context, todo_repository: AbstractTodoRepository):
    todo_id = event['pathParameters']['id']
    todo_repository.delete(todo_id)

    return {
        "statusCode": 200,
        "body": json.dumps({}),
    }


def todo_detail(event, context, todo_repository: AbstractTodoRepository):
    todo_id = event['pathParameters']['id']
    todo = todo_repository.get(todo_id)
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


def todo_update(event, context, todo_repository: AbstractTodoRepository):
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


routes = {
    ('GET', '/todos'): todo_list,
    ('GET', '/todos/{id}'): todo_detail,
    ('POST', '/todos'): todo_create,
    ('PUT', '/todos/{id}'): todo_update,
    ('DELETE', '/todos/{id}'): todo_delete,
}


def lambda_handler(event, context):
    request_context = event['requestContext']
    path = request_context['resourcePath']
    http_method = request_context['httpMethod']
    todo_repository = MemTodoRepository(TODO_DATA)
    try:
        return routes[(http_method, path)](event, context, todo_repository=todo_repository)
    except:
        return {
            "statusCode": 404,
            "body": json.dumps({
                "message": "not found",
                'path': path,
                'httpMethod': http_method,
                'requestContext': request_context,
            })
        }

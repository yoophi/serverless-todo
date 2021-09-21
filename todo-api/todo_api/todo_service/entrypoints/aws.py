import json
import sys

from dependency_injector import containers, providers
from dependency_injector.wiring import inject, Provide

from todo_service.repository import AbstractTodoRepository, MemTodoRepository
from todo_service.todos import TODO_DATA


class Container(containers.DeclarativeContainer):
    config = providers.Configuration()

    todo_repository = providers.Factory(
        MemTodoRepository,
        todos=config.initial_todos,
    )


@inject
def todo_list(
    event,
    context,
    todo_repository: AbstractTodoRepository = Provide[Container.todo_repository],
):
    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "data": todo_repository.get_list(),
            }
        ),
    }


@inject
def todo_create(
    event,
    context,
    todo_repository: AbstractTodoRepository = Provide[Container.todo_repository],
):
    payload = json.loads(event["body"])
    todo = todo_repository.create(title=payload.get("title"))
    if not todo:
        return {"statusCode": 400, "body": json.dumps({"message": "failed"})}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "data": todo,
            }
        ),
    }


@inject
def todo_delete(
    event,
    context,
    todo_repository: AbstractTodoRepository = Provide[Container.todo_repository],
):
    todo_id = event["pathParameters"]["id"]
    todo_repository.delete(todo_id)

    return {
        "statusCode": 200,
        "body": json.dumps({}),
    }


@inject
def todo_detail(
    event,
    context,
    todo_repository: AbstractTodoRepository = Provide[Container.todo_repository],
):
    todo_id = event["pathParameters"]["id"]
    todo = todo_repository.get(todo_id)
    if not todo:
        return {"statusCode": 404, "body": json.dumps({"message": "not found"})}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "data": todo,
            }
        ),
    }


@inject
def todo_update(
    event,
    context,
    todo_repository: AbstractTodoRepository = Provide[Container.todo_repository],
):
    todo_id = event["pathParameters"]["id"]
    payload = json.loads(event["body"])
    todo = todo_repository.update(todo_id, title=payload.get("title"))
    if not todo:
        return {"statusCode": 404, "body": json.dumps({"message": "not found"})}

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "data": todo,
            }
        ),
    }


def lambda_handler(event, context):
    request_context = event["requestContext"]
    path = request_context["resourcePath"]
    http_method = request_context["httpMethod"]

    container = Container()
    container.config.from_dict({"initial_todos": TODO_DATA})
    container.wire(modules=[sys.modules[__name__]])

    routes = {
        ("GET", "/todos"): todo_list,
        ("GET", "/todos/{id}"): todo_detail,
        ("POST", "/todos"): todo_create,
        ("PUT", "/todos/{id}"): todo_update,
        ("DELETE", "/todos/{id}"): todo_delete,
    }

    try:
        return routes[(http_method, path)](
            event,
            context,
        )
    except Exception as e:
        print(type(e), str(e))
        return {
            "statusCode": 404,
            "body": json.dumps(
                {
                    "message": "not found",
                    "path": path,
                    "httpMethod": http_method,
                    "requestContext": request_context,
                }
            ),
        }

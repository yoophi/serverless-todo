import json

from todo_service.todos import TODO_DATA


def get_todo(todo_id):
    try:
        return next(todo for todo in TODO_DATA if todo['id'] == int(todo_id))
    except StopIteration:
        return None


def lambda_handler(event, context):
    """Sample pure Lambda function

    Parameters
    ----------
    event: dict, required
        API Gateway Lambda Proxy Input Format

        Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format

    context: object, required
        Lambda Context runtime methods and attributes

        Context doc: https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    Returns
    ------
    API Gateway Lambda Proxy Output Format: dict

        Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
    """

    todo_id = event['pathParameters']['id']
    todo = get_todo(todo_id)
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

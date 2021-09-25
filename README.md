# Serverless Todo Service

AWS Serverless 인프라를 이용하여 AWS Lambda 기반의 마이크로서비스를 개발하는 프로젝트입니다.

다음 기능들을 사용합니다.

- AWS Serverless Application Model 기반의 백엔드 프로젝트 셋업 및 배포
    - 인증 백엔드로 Cognito 를 사용합니다.
    - DynamoDB 를 데이터 저장소로 사용합니다.
    - 백그라운드 작업 처리를 위해 SQS + Lambda 기반의 워크플로우를 사용합니다.
    - 서비스간의 이벤트 기반 아케텍처 구성을 위해 SNS 를 사용합니다.
- Amplify 를 이용한 프론트엔드 배포
    - React 기반의 프론트엔드를 개발하고 배포합니다.

    

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class MyProject1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloLambda = new lambda.Function(this, 'HelloWorld', {
      functionName: 'HelloWorld',
      runtime: lambda.Runtime.NODEJS_22_X,
      code: lambda.Code.fromAsset('lambdas/HelloWorld'),
      handler: 'index.handler'
    });

    const api = new apigateway.RestApi(this, 'HelloApi', {
      restApiName: 'helloAPI',
      description: 'Only GET method allowed'
    });

    const ammar = api.root.addResource('ammar');
    const v1 = ammar.addResource('v1');
    const hello = v1.addResource('hello');

    const helloIntegration = new apigateway.LambdaIntegration(helloLambda);

    hello.addMethod('GET', helloIntegration);
  }
}

import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "node:path";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, "CMUWebringFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "lambda-handler")),
    });

    const endpoint = new apigw.LambdaRestApi(this, "CMUWebringEndpoint", {
      handler: fn,
      restApiName: "CMUWebringApi",
    });

    const staticBucket = new s3.Bucket(this, "CMUWebringStaticBucket", {
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    const certificate = new acm.Certificate(this, "CMUWebringCert", {
      domainName: "cmuwebr.ing",
      validation: acm.CertificateValidation.fromDns(),
    });

    const s3Behavior: cloudfront.BehaviorOptions = {
      origin: origins.S3BucketOrigin.withBucketDefaults(staticBucket),
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      viewerProtocolPolicy:
        cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    };

    const distribution = new cloudfront.Distribution(
      this,
      "CMUWebsiteDistribution",
      {
        defaultBehavior: {
          origin: new origins.RestApiOrigin(endpoint),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
        additionalBehaviors: {
          "/static/*": s3Behavior,
          "/*.php": s3Behavior, // necessary to keep scrapers from hitting the main API Gateway
        },
        domainNames: ["cmuwebr.ing"],
        certificate,
      }
    );

    const staticDeployment = new s3deploy.BucketDeployment(
      this,
      "DeployCMUWebringStatic",
      {
        sources: [s3deploy.Source.asset(path.join(__dirname, "static"))],
        destinationBucket: staticBucket,
        destinationKeyPrefix: "static",
        distribution,
        distributionPaths: ["/static/*"],
      }
    );
  }
}

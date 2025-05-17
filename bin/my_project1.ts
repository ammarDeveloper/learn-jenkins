#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyProject1Stack } from '../lib/my_project1-stack';

const app = new cdk.App();
new MyProject1Stack(app, 'LambdaStack');
pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/ammarDeveloper/learn-jenkins', branch: 'main'
            }
        }

        stage('Install and Test') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                // Install dependencies
                sh 'npm install'
                dir('cdk') {
                    sh 'npm install'
                }
                
                // Run tests
                sh 'npm run test -- --coverage'
                
                // Build CDK
                dir('cdk') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy CDK') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                // For CDK deployment, you might need AWS CLI
                sh 'apk add --no-cache python3 py3-pip curl'
                sh 'pip3 install aws-cdk-lib'
                
                dir('cdk') {
                    sh 'npm install -g aws-cdk'
                    sh 'cdk deploy --require-approval never'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
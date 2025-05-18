pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1' // Change to your region
    }

    stages {
        // Checkout code
        stage('Checkout') {
            steps {
                git branch: 'test', url: 'https://github.com/ammarDeveloper/learn-jenkins'
            }
        }

        // Install dependencies and test
        stage('Install & Test') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                sh 'npm run test'
                sh 'npm run build'
            }
        }

        // Deploy with CDK
        stage('Deploy') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh 'npx cdk deploy --require-approval never'
                }
            }
        }
    }
}
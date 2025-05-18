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
                dir('.') {
                    sh 'npm install'
                }
                
                // Run tests
                sh 'npm run test -- --coverage'
                
                // Build CDK
                dir('.') {
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
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    dir('.') {
                        sh 'ls -la'
                        sh 'npx cdk deploy --require-approval never'
                    }
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
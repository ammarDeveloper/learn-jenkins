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

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm install'
                dir('cdk') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests with Coverge') {
            steps {
                sh 'npm run test -- --coverage'
            }
        }

        stage('Build CDK') {
            steps {
                dir('cdk') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy CDK') {
            steps {
                dir('cdk') {
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
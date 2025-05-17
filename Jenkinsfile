pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Checkout') {
            steps {
                get url: '', branch: 'main'
            }
        }

        stage('Install Dependencies') {
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
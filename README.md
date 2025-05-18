# AWS CDK CI/CD Pipeline with Jenkins

## 1. Set Up Jenkins in Docker

### For Windows (PowerShell)
```powershell
docker run -d `
  --name jenkins `
  -p 8080:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  jenkins/jenkins:lts
```

### For macOS/Linux
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### Access Jenkins

1. Open [http://localhost:8080](http://localhost:8080)
2. Get the admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   Complete setup (install plugins + create admin user).

## 2. Configure Jenkins for AWS & Docker

### Install Plugins
1. Go to **Manage Jenkins > Plugins**
2. Install:
   - Docker Pipeline
   - AWS Credentials
   - GitHub Integration (if using GitHub)

### Add AWS Credentials
1. Go to **Manage Jenkins > Credentials**
2. Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as "Secret text"

## 3. Create the Jenkinsfile

Place this in your project root (`Jenkinsfile`):

```groovy
pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1' // Change to your region
    }

    stages {
        // Checkout code
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo.git'
            }
        }

        // Install dependencies and test
        stage('Install & Test') {
            agent {
                docker {
                    image 'node:18-alpine'
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
                    image 'node:18-alpine'
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
```

## 4. Set Up the Jenkins Job

### Create a New Pipeline
1. Go to **New Item > Pipeline**
2. Select **Pipeline script from SCM**
3. Choose Git and enter your repo URL
4. Set branch to `main` and script path to `Jenkinsfile`

### Run the Pipeline
- Click **Build Now** to trigger the first deployment

## 5. (Optional) GitHub Webhook for Auto-Triggers

### In Jenkins
1. Go to **Manage Jenkins > System**
2. Under GitHub, add a webhook URL (e.g., `http://your-jenkins-ip:8080/github-webhook/`)

### In GitHub
1. Go to **Repo Settings > Webhooks**
2. Add the Jenkins URL
3. Set content type to `application/json`

## Troubleshooting

### Docker not found?
- Ensure the Jenkins container has Docker access (we added `-v /var/run/docker.sock` for this)

### Permission errors?
```bash
docker exec -u 0 jenkins chmod 666 /var/run/docker.sock
```

### AWS credentials error?
- Double-check the credentials IDs in the Jenkinsfile match those in Jenkins

## Final Pipeline Flow

1. Code pushed to GitHub → Jenkins auto-triggers build
2. Tests run in a Node.js Docker container
3. CDK deploys to AWS if tests pass

This mirrors real-world CI/CD setups used in production. Let me know if you'd like to add more stages (e.g., linting, approvals)! 🚀
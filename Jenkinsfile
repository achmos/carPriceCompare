Jenkinsfile (Declarative Pipeline)
pipeline {
    agent any
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                sh '''
                  pwd
                  node app.js &> cpcLog &
                '''
            }
        }
    }
}

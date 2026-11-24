pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
    }

    environment {
        IMAGE_NAME     = 'restaurante-pipeline'
        CONTAINER_NAME = 'restaurante-staging'
        STAGING_PORT   = '3001'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build - Instalar dependencias') {
            steps {
                bat 'node --version'
                bat 'npm ci'
            }
        }

        stage('Análisis estático (ESLint)') {
            steps {
                bat 'npm run lint'
            }
        }

        stage('Pruebas unitarias (Jest)') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit.xml'
                }
            }
        }

        stage('Escaneo de vulnerabilidades (npm audit)') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                    bat 'npm audit --audit-level=high'
                }
            }
        }

        stage('Empaquetado (Docker)') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% -t %IMAGE_NAME%:latest .'
            }
        }

        stage('Despliegue a staging') {
            steps {
                bat 'docker rm -f %CONTAINER_NAME% || exit /b 0'
                bat 'docker run -d --name %CONTAINER_NAME% -p %STAGING_PORT%:3000 %IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'ping -n 6 127.0.0.1 > nul'
                bat 'curl --fail http://localhost:%STAGING_PORT%/health'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado: la aplicación está desplegada en staging.'
        }
        failure {
            echo 'Pipeline fallido: revisar la etapa marcada en rojo y el Console Output.'
        }
    }
}

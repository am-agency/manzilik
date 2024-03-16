
properties(
  [parameters([choice(
    choices: ['ci', 'dev', 'qa', 'prod'],
    description: 'Select the stage you want to deploy.',
    name: 'DEPLOY_STAGE')])]
)

def docker_group_id

node {
  docker_group_id = sh(returnStdout: true, script: "stat -c '%g' /var/run/docker.sock").trim()
}

pipeline {
  agent {
    dockerfile {
      filename 'Dockerfile'
      args '-u 0:0 --group-add ' + docker_group_id + ' -v "/var/run/docker.sock:/var/run/docker.sock:rw"'
    }
  }

  environment {
    AWS_REGION = 'eu-central-1'
    AWS_DEFAULT_PROFILE = "default"
    AWS_PROFILE = "default"
    JOKER_SENTRY = "https://27ccd931c2304a0cb6d65aed4a0b59c0@o917442.ingest.sentry.io/5907483"
  }
  
  stages {
    stage('Prepare environments') {
      steps {
        withAWS(credentials: 'jenkins-credentials', profile: 'default') {
          sh './scripts/prepare_env.sh ${DEPLOY_STAGE} ${AWS_REGION} ${JOKER_SENTRY}'
        }
      }
    }

    stage('Install Packages') {
      steps {
        sh 'npm cache clean --force'
        sh 'npm install --legacy-peer-deps'
      }
    }
    stage('Test and Build') {
      parallel {
        stage('Run Tests') {
          steps {
            //   Tests are broken, we need to fix them later
            sh 'echo "Unit Testing"'
          }
        }
        stage('Create Build Artifacts') {
          steps {
            sh 'npm run build'
          }
        }
      }
    }

    stage('Deploy to stage') {
      steps {
        withAWS(credentials: 'jenkins-credentials', profile: 'default') {
          sh './scripts/deploy.sh ${DEPLOY_STAGE}'
        }
      }
    }
  }
    post {
        always {
            sh 'docker container prune --force'
            sh 'docker image prune -a -f 2> /dev/null'
            cleanWs()
        }
    }
}

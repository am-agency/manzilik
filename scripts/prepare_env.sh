#! /bin/bash
assert() {
  variable=$1
  echo "Variable is $variable"
  variableName=(${!variable@})
  if [ -z "$variable" ]; then
    echo "$variableName Can't be null" >&2
    exit 1
  fi
}
STAGE=$1
REGION=$2
JOKER_SENTRY=$3
SENDBIRD_APP_ID=$4

COGNITO_SERVICE_PREFIX=$(grep COGNITO_SERVICE_PREFIX ./settings.env | cut -d '=' -f2)
FLASH_SERVICE_PREFIX=$(grep FLASH_SERVICE_PREFIX ./settings.env | cut -d '=' -f2)

expectedAppSync="$FLASH_SERVICE_PREFIX-$STAGE-graphql"
expectedIdentityPoolName=$COGNITO_SERVICE_PREFIX"-"$STAGE"-identity_pool"
echo $expectedIdentityPoolName
USER_POOL_NAME="$COGNITO_SERVICE_PREFIX-$STAGE-users"
RECAPTCHA_SITE_KEY="6LfLDmUfAAAAACJPXDyAL5WDF3dKJn06hDuZEhmY"
RECAPTCHA_SECRET_KEY="6LfLDmUfAAAAAL1gYqHUayFc5fPTDTVYyLs30W-6"
USER_POOL_CLIENT_APP_WEB="$COGNITO_SERVICE_PREFIX-$STAGE-users-client"


if [[ "$STAGE" = "prod" ]];
then
  stage_prefix=""
  makhzan_stage_prefix="makhzan"
  intercom_id='k8265c1g'
  analytics="GTM-WKN8B4K"
  PROFESSIONAL_ID="29ff000a-740e-415d-b006-1df9980b2de9"
  SERVICE_INQUERY_ID="4d63f942-cc32-4ef0-b0ff-c9ce531a3db7"
  GOOGLE_ANALYTICS_PROPERTY="G-1FER3BVSZ3"
else
  stage_prefix="$STAGE."
  makhzan_stage_prefix="makhzan-$STAGE"
  intercom_id='k8265c1g'
  analytics="G-TPKMG23NYD"
  PROFESSIONAL_ID="fd5fe374-a8c4-43e3-b209-364212100ed5"
  SERVICE_INQUERY_ID="91549011-470d-4c5c-9c29-920109680698"
  GOOGLE_ANALYTICS_PROPERTY="G-DXHZNSNJFW"
fi

BASE_URL="https://${stage_prefix}manzilik.com"

LOGIN_CALLBACK_URL="$BASE_URL/federated-login"
LOGOUT_CALLBACK_URL="$BASE_URL/federated-logout"
GOOGLE_ANALYTICS="$analytics"
INTERCOM_APP="$intercom_id"
API_KEY='AIzaSyAChdtClxRtHSbFFhCYpg1f6naZsbwu5TY'
AUTH_DOMAIN='manzilik.firebaseapp.com'
PROJECT_ID='manzilik'
STORAGE_BUCKET='manzilik.appspot.com'
MESSAGING_DENDER_ID='843883675615'
APP_ID='1:843883675615:web:e3d06fe93ed52d5122ce6a'
MEASUREMENT_ID='G-FCFTBK2Z9F'


COGNITO_USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 10 | jq -r --arg NAME "$USER_POOL_NAME" '.UserPools[] | select(.Name==$NAME) | .Id')
assert "$COGNITO_USER_POOL_ID"
echo "$COGNITO_USER_POOL_ID"


JOKER_APPSYNC=$(aws appsync list-graphql-apis |
  jq -r --arg Name "$expectedAppSync" '.graphqlApis[] | select(.name==$Name) | .uris.GRAPHQL')


APPSYNC_API_ID=$(aws appsync list-graphql-apis |
  jq -r --arg Name "$expectedAppSync" '.graphqlApis[] | select(.name==$Name) | .apiId')

assert "$JOKER_APPSYNC"

JOKER_APPSYNC_API_KEY=$(aws appsync list-api-keys --api-id "$APPSYNC_API_ID" | jq -r '.apiKeys[] | .id')
assert JOKER_APPSYNC_API_KEY

IDENTITY_POOL_ID=$(aws cognito-identity list-identity-pools --max-results 20 | jq -r --arg Name "$expectedIdentityPoolName" '.IdentityPools[] | select(.IdentityPoolName==$Name) | .IdentityPoolId')
assert "$IDENTITY_POOL_ID"

USER_POOL_WEB_CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id "$COGNITO_USER_POOL_ID" | jq -r  --arg NAME "$USER_POOL_CLIENT_APP_WEB" '.UserPoolClients[] | select(.ClientName==$NAME) | .ClientId')


assert "$USER_POOL_WEB_CLIENT_ID"


MAKHZAN_SERVICE_PREFIX=${STAGE}-$(grep MAKHZAN_SERVICE_PREFIX ./settings.env | cut -d '=' -f2)
MAKHZAN_API_ID=$(aws apigateway get-rest-apis --max-items 20 | jq -r --arg Name "$MAKHZAN_SERVICE_PREFIX" '.items[] | select(.name==$Name) | .id')
assert "$MAKHZAN_API_ID"
MAKHZAN_API_GATEWAY_URL="https://${MAKHZAN_API_ID}.execute-api.${REGION}.amazonaws.com/$STAGE"

# create joker env file
echo -e "REACT_APP_APPSYNC_GRAPHQL_ENDPOINT=$JOKER_APPSYNC" | tee -a .env
echo -e "REACT_APP_APPSYNC_API_KEY=$JOKER_APPSYNC_API_KEY" | tee -a .env
echo -e "REACT_APP_USER_POOL_ID=$COGNITO_USER_POOL_ID" | tee -a .env
echo -e "REACT_APP_REGION=$REGION" | tee -a .env
echo -e "REACT_APP_BASE_URL=$BASE_URL" | tee -a .env
echo -e "REACT_APP_APPSYNC_REGION=$REGION" | tee -a .env
echo -e "REACT_APP_COGNITO_REDIRECT_SIGN_IN_URL=$LOGIN_CALLBACK_URL" | tee -a .env
echo -e "REACT_APP_COGNITO_REDIRECT_SIGN_OUT_URL=$LOGOUT_CALLBACK_URL" | tee -a .env
echo -e "REACT_APP_IDENTITY_POOL_ID=$IDENTITY_POOL_ID" | tee -a .env
echo -e "REACT_APP_USER_POOL_WEB_CLIENT_ID=$USER_POOL_WEB_CLIENT_ID" | tee -a .env
echo -e "REACT_APP_COGNITO_DOMAIN=auth-"$STAGE".manzilik.com" | tee -a .env
echo -e "REACT_APP_MAKHZAN_URL=https://$makhzan_stage_prefix.manzilik.com" | tee -a .env
echo -e "REACT_APP_SENTRY=${JOKER_SENTRY}" | tee -a .env
echo -e "REACT_APP_INTERCOM_APP_ID=${INTERCOM_APP}" | tee -a .env
echo -e "REACT_APP_GOOGLE_ANALYTICS=${GOOGLE_ANALYTICS}" | tee -a .env
echo -e "REACT_APP_STAGE=${STAGE}" | tee -a .env
echo -e "REACT_APP_RECAPTCHA_SITE_KEY=${RECAPTCHA_SITE_KEY}" | tee -a .env
echo -e "REACT_APP_RECAPTCHA_SECRET_KEY=${RECAPTCHA_SECRET_KEY}" | tee -a .env
echo -e "REACT_APP_MAKHZAN_API_URL=${MAKHZAN_API_GATEWAY_URL}" | tee -a .env
echo -e "REACT_APP_API_KEY=${API_KEY}" | tee -a .env
echo -e "REACT_APP_AUTH_DOMAIN=${AUTH_DOMAIN}" | tee -a .env
echo -e "REACT_APP_PROJECT_ID=${PROJECT_ID}" | tee -a .env
echo -e "REACT_APP_STORAGE_BUCKET=${STORAGE_BUCKET}" | tee -a .env
echo -e "REACT_APP_MESSAGING_DENDER_ID=${MESSAGING_DENDER_ID}" | tee -a .env
echo -e "REACT_APP_APP_ID=${APP_ID}" | tee -a .env
echo -e "REACT_APP_MEASUREMENT_ID=${MEASUREMENT_ID}" | tee -a .env
echo -e "REACT_APP_PAYMENT_WIDGET_SRC=/v1/paymentWidgets.js" | tee -a .env
echo -e "REACT_APP_WEB_PROPERTY_ID=${GOOGLE_ANALYTICS_PROPERTY}" | tee -a .env
echo -e "REACT_APP_SENDBIRD_APP_ID=${SENDBIRD_APP_ID}" | tee -a .env
echo -e "REACT_APP_PROFESSIONAL_ID=${PROFESSIONAL_ID}" | tee -a .env
echo -e "REACT_APP_SERVICE_INQUERY_ID=${SERVICE_INQUERY_ID}" | tee -a .env

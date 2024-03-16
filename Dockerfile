FROM node:14-alpine3.13

ENV USER jenkins
ENV HOME /home/$USER
ENV GLIBC_VER=2.31-r0

USER root

RUN apk update \
    && apk add --update sudo \
    && apk add curl \
    && apk add jq \
    && npm install -g npm@latest \
    && apk add bash \
    && apk add --no-cache \
        python3 \
        py3-pip \
    && pip3 install --upgrade pip \
    && rm -rf /var/cache/apk/* \
    && apk --no-cache add \
        binutils \
        curl \
    && curl -sL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-${GLIBC_VER}.apk \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-bin-${GLIBC_VER}.apk \
    && curl -sLO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VER}/glibc-i18n-${GLIBC_VER}.apk \
    && apk add --no-cache \
        glibc-${GLIBC_VER}.apk \
        glibc-bin-${GLIBC_VER}.apk \
        glibc-i18n-${GLIBC_VER}.apk \
    && /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8 \
    && curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip \
    && unzip awscliv2.zip \
    && aws/install \
    && rm -rf \
        awscliv2.zip \
        aws \
        /usr/local/aws-cli/v2/*/dist/aws_completer \
        /usr/local/aws-cli/v2/*/dist/awscli/data/ac.index \
        /usr/local/aws-cli/v2/*/dist/awscli/examples \
        glibc-*.apk \
    && apk --no-cache del \
        binutils \
        curl \
    && rm -rf /var/cache/apk/* \
    && aws configure set aws_access_key_id "123" --profile default


RUN apk add --update docker openrc && rc-update add docker boot

WORKDIR $HOME
COPY . $HOME

ARG UID=113
ARG GID=119

RUN addgroup -g $GID -S $USER \
    && adduser -u $UID -S $USER -G $USER \
    && addgroup $USER docker \
    && sudo chown -R $USER $HOME

USER $USER

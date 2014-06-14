FROM debian:wheezy

# Install node
RUN apt-get update -y && apt-get install --no-install-recommends -y -q curl python build-essential git
RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.11.13/node-v0.11.13-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1
ENV PATH $PATH:/nodejs/bin

# Install our application
ADD docker-build /app
WORKDIR /app
RUN npm install
RUN ./node_modules/bower/bin/bower install --allow-root --force --config.interactive=0
RUN ./node_modules/gulp/bin/gulp.js build --production

EXPOSE 3000
ENTRYPOINT node --harmony server/index.js

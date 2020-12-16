FROM node:14

# set working directory
WORKDIR /opt/services/frontend/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /opt/services/frontend/node_modules/.bin:$PATH

ARG REACT_APP_FACEBOOK_PUBLIC_APP_ID
ENV REACT_APP_FACEBOOK_PUBLIC_APP_ID=$REACT_APP_FACEBOOK_PUBLIC_APP_ID

ARG REACT_APP_GOOGLE_OAUTH_CLIENT_ID
ENV REACT_APP_GOOGLE_OAUTH_CLIENT_ID=$REACT_APP_GOOGLE_OAUTH_CLIENT_ID

# install and cache app dependencies
COPY package.json /opt/services/frontend/package.json
RUN npm install

# copy all other content
COPY . /opt/services/frontend
RUN npm run build

# build app
ENTRYPOINT cp -rf /opt/services/frontend/build/* /opt/services/frontend/static/

FROM node:16 As development

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn install 

# Bundle app source
COPY . .

RUN npm run build

CMD ["npm", "start"]

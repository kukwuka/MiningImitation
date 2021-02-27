FROM node:latest
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install
RUN chmod +x wait-for.sh
EXPOSE 8080
CMD ["npm","run" ,"serve"]
# build stage
FROM node:14 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM nginx:latest
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
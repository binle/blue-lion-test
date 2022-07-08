FROM nginx:latest

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 9090
CMD ["nginx", "-g", "daemon off;"]


FROM nginx:alpine

COPY ./main-page/index.html /usr/share/nginx/html/index.html
COPY ./main-page/main.css /usr/share/nginx/html/main.css
COPY ./assets /usr/share/nginx/html/assets
COPY ./simulations /usr/share/nginx/html/simulations
COPY ./style.css /usr/share/nginx/html/style.css
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
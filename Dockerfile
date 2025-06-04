FROM nginx:stable-alpine

ARG BUILD_DIR=dist

RUN rm -rf /usr/share/nginx/html/*

# 拷贝构建好的前端文件
COPY ./${BUILD_DIR} /usr/share/nginx/html

# 拷贝自定义 Nginx 配置（可选）
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]
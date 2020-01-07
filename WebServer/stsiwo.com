server {
    listen       80 default_server;
    server_name  stsiwo.com;

    #charset koi8-r;
    access_log  /var/log/nginx/stsiwo.com.access.log  main;
    error_log /var/log/nginx/stsiwo.com.error.log info;

    location / {
        root   /var/www;
        index  index.html index.htm;
    }

    # location /api1/ {
    #   proxy_set_header Host api1; 
    #   proxy_pass http://api1:5000;
    # }

    # # to prevent 302 redirect when proxy_pass 
    # location = /api1 {
    #   proxy_set_header Host api1; 
    #   proxy_pass http://api1:5000;
    # }

    # location /api2/ {
    #   proxy_set_header Host api2; 
    #   proxy_pass http://api2:5000;
    # }

    # # to prevent 302 redirect when proxy_pass 
    # location = /api2 {
    #   proxy_set_header Host api2; 
    #   proxy_pass http://api2:5000;
    # }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    # error_page   500 502 503 504  /50x.html;
    # location = /50x.html {
    #     root   /usr/share/nginx/html;
    # }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}

include /etc/nginx/conf.d/api.stsiwo.com;

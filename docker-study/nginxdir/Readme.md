### 教程

<div>
<video class="blog video" style="width:100%;height:auto" src="https://chen-video.oss-cn-guangzhou.aliyuncs.com/se_road/%E5%A6%82%E4%BD%95%E9%80%9A%E8%BF%87docker%E5%AE%B9%E5%99%A8%E9%83%A8%E7%BD%B2https%E8%AE%BF%E9%97%AE%E7%9A%84nginx%E5%BA%94%E7%94%A8%EF%BC%9F.mp4" controls="controls" />
</div>

### 步骤

![image](https://chenxie-fun.oss-cn-shenzhen.aliyuncs.com/work/image-20251011170047-c1gf6ew.png)

1. 随便找个目录进行目录准备

    ```bash
    mkdir -p nginxdir/nginx/conf.d
    mkdir -p nginxdir/nginx/certs
    mkdir -p nginxdir/app
    ```
2. 获取默认default.conf文件

    ```bash
    docker run nginx:latest

    docker ps

    docker exec -it [nginx container id] /bin/bash

    [container]ls etc/nginx/conf.d
    [container]cat default.conf

    docker cp [nginx container id]:/etc/nginx/conf.d/default.conf ./nginx/conf.d/
    ```
3. 修改default.conf文件

    1. 如果没有SSL，不用修改default.conf文件

        ```nginx
        server {
            listen       80;
            listen  [::]:80;
            server_name  localhost;

            #access_log  /var/log/nginx/host.access.log  main;

            location / {
                root   /usr/share/nginx/html;
                index  index.html index.htm;
            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

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
        ```
    2. 如果有SSL

        ```nginx
        server {
        	#特殊的部分
            listen       443 ssl;
        	server_name	 [域名];
        	
        	#ssl证书路径
        	ssl_certificate /etc/nginx/certs/[域名].pem;
        	ssl_certificate_key /etc/nginx/certs/[域名].key;

        }
        ```

        ```nginx
        server {
            listen       80;
            listen       443 ssl;
            server_name  localhost;

            #access_log  /var/log/nginx/host.access.log  main;
        	ssl_certificate /etc/nginx/certs/[域名].pem;
        	ssl_certificate_key /etc/nginx/certs/[域名].key;

            location / {
                root   /usr/share/nginx/html;
                index  index.html index.htm;
            }

            #error_page  404              /404.html;

            # redirect server error pages to the static page /50x.html
            #
            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   /usr/share/nginx/html;
            }

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
        ```
4. 启动Nginx，并将conf.d、certs、html目录挂载到外面

    ```bash
    docker run -d --name=nginx-dev \
    	-p 8080:80 -p 443:443 \
    	-v /[本机目录路径]/nginxdir/nginx/conf.d:/etc/nginx/conf.d \
    	-v /[本机目录路径]/nginxdir/nginx/certs:/etc/nginx/certs \
    	-v /[本机目录路径]/nginxdir/app:/usr/share/nginx/html \
    	--restart always \
    	nginx:latest
    ```

    如果在nginxdir目录，可直接复制以下命令

    ```bash
    docker run -d --name=nginx-dev \
    	-p 8080:80 -p 443:443 \
    	-v $(pwd)/nginx/conf.d:/etc/nginx/conf.d \
    	-v $(pwd)/nginx/certs:/etc/nginx/certs \
    	-v $(pwd)/app:/usr/share/nginx/html \
    	--restart always \
    	nginx:latest
    ```
5. 让访问80端口也自动跳转ssl端口，增加

    ```dsconfig
    server {
    	listen	80;
    	server_name	[域名];
    	return 301 https://$host$request_uri;
    }
    ```

### 测试

  ```bash
  #获取本机IP
  ipconfig getifaddr en0

  #用浏览器访问 ip:8080
  ```
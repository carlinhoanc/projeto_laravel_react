FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql zip

# Increase upload limits for photos
RUN { \
        echo 'upload_max_filesize=20M'; \
        echo 'post_max_size=22M'; \
        echo 'max_file_uploads=20'; \
    } > /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

CMD ["sleep", "infinity"]

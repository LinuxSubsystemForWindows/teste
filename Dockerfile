# Use official PHP image with Apache
FROM php:8.2-apache

# Enable PHP extensions if needed (curl is required for Telegram API)
RUN docker-php-ext-install curl

# Enable Apache mod_rewrite (optional, but common)
RUN a2enmod rewrite

# Copy your PHP source code to the Apache public directory
COPY . /var/www/html/

# Set permissions (optional, depending on your files)
RUN chown -R www-data:www-data /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache in the foreground (default command)
CMD ["apache2-foreground"]

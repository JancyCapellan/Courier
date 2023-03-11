**_Simple and stripped down version of this post: https://www.coderrocketfuel.com/article/how-to-deploy-a-next-js-website-to-a-digital-ocean-server _**

1.  Create a New Droplet On DigitalOcean
    a) In the first section, select the Ubuntu operating system for your server
    b) In the "Authentication" section, make sure the "Password" option is selected and enter a strong root password for your server.

2.  Access Server Using Root
    a) ssh root@server_ip_address (connect to server from terminal)

3.  Add user (OPTIONAL)
    a) adduser armin (creates a new user)
    b) usermod -aG sudo bob (give sudo permissions)

4.  Add public key authentication (OPTIONAL)
    a) ssh-keygen (Generate a Key Pair on Your Local Machine)

    - Press ENTER to accept the file name and path.
    - Next, you'll be prompted to enter a password to secure the newly created key. You can either create a password or leave it blank. This generates a private key, id_rsa, and a public key, id_rsa.pub, in the /.ssh directory inside your home directory.
      b) Install The Key Manually
    - cat ~/.ssh/id_rsa.pub
    - su - armin (temporarily switch to the new user)
    - mkdir ~/.ssh (Create a new directory called /.ssh)
    - chmod 700 ~/.ssh (Restrict its permissions)
    - nano ~/.ssh/authorized_keys (open a file in .ssh called authorized_keys with a text editor)
    - Now insert the public key you generated and copied by pasting it into the nano editor.
    - chmod 600 ~/.ssh/authorized_keys (Restrict the permissions of the authorized_keys)
    - exit (Return to the root user)
    - Now your public key is installed, and you can use SSH keys to log in as your user.
      c) Disable Password Authentication (**_Only follow this step if you installed a public key in the last step. Otherwise, you'll lock yourself out of the server._**)
    - sudo nano /etc/ssh/sshd_config (open the SSH daemon configuration file)
    - Find the line that says PasswordAuthentication
    - change its value from yes to no
    - sudo systemctl reload sshd (Reload the SSH daemon)
      d) ssh armin@server_ip_address (Login using SSH)

5.  Add a Basic Firewall
    a) sudo ufw app list (List applications UFW currently allows)
    b) sudo ufw allow OpenSSH (Configure firewall to allow SSH connections)
    c) sudo ufw enable (Enable firewall)
    d) sudo ufw status (Check firewall status) _The OpenSSH directive should be listed._

6.  Configure a Domain Name
    a) Purchase a domain name from a domain name registrar
    b) Setup DNS (Domain Name System) records for your domain by using a DNS hosting service

7.  Configure DigitalOcean DNS For Your Domain
    a) On the DigitalOcean website, open the "Create" drop-down menu and click the "Domains/DNS" link
    b) In the "Add A Domain" section, enter your domain (this is usually the base only: example.com and not www.example.com) and click the "Add Domain" button
    c) Once you've hit the "Add Domain" button, you'll be taken to the "Create new record" page.
    d) Need to create two A records for your domain

    - For the first one, enter @ in the HOSTNAME field and select the server you want to point the domain name to
    - For the second one, enter www in the HOSTNAME field and select the same server

8.  Configure Your Domain Registrar To Direct Domains to DigitalOcean
    a) Open Advanced DNS on your domain provider's website
    b) In the "Nameservers" section of the resulting screen, select Custom DNS from the dropdown menu and enter the following nameservers:

    - ns1.digitalocean.com
    - ns2.digitalocean.com
    - ns3.digitalocean.com

9.  Install & Configure Nginx
    a) sudo apt-get update && sudo apt-get install nginx (Install nginx and other required dependencies)
    b) Adjust Firewall Settings
    - sudo ufw app list (Get list of apps allowed by firewall) **_nginx should appear_**
    - sudo ufw allow 'Nginx HTTP' (Allow nginx http traffic)
    - sudo ufw status (Check firewall status) **_Nginx HTTP should appear_**
    - systemctl status nginx (Make sure the service is running)
    - test by navigation to the digitalocean server's ip into the browser
10. Install Node.js
    **_SHOULD BE INSTALLED AUTOMATICALLY IF YOU CHOSE SERVER TYPE FOR NODE.JS WHEN GETTING THE DROPLET_**
    a) sudo apt-get install nodejs (Install in case it's not already installed)
    b) sudo apt-get install build-essential
    c) node --version (test if it's installed)
    d) npm --version (test for npm)

11. Push your Next.js app to github (repo doesn't need to be public - private is fine)

12. Clone your Next.js app from github to the digitalocean server's root folder
    a) cd website (change directory to your project)
    b) npm install (install required modules)
    c) npm run dev (test if it's working)
    d) npm run build (generate a production build)
    e) npm start (temporarily run the production version)

13. Install & Use PM2 To Run Application
    a) sudo npm install -g pm2
    b) cd website (change to project's folder)
    c) pm2 start --name=website npm -- start (Run the application with PM2)
    d) pm2 startup systemd (Run PM2 on server restart)

    - In the resulting output on the last line, there'll be a command that you must run with superuser privileges
    - sudo env PATH=$PATH:/usr/bin /usr/lib/node*modules/pm2/bin/pm2 startup systemd -u bob --hp /home/bob \*\*\_SOMETHING LIKE THIS*\*\*
      e) systemctl status pm2-bob (check pm2 system status)

14. Configure Nginx as a Reverse Proxy
    a) cd /etc/nginx/sites-available (navigate to nginx sites folder)
    a1) delete default
    a2) cd /etc/nginx/sites-enabled (navigate to nginx sites enabled folder)
    a3) delete default
    a4) cd /etc/nginx/sites-available (navigate to nginx sites folder)
    b) sudo touch example.com (create a site enrty)
    c) sudo nano example.com (open it in a text editor)
    d) Add following code in it:
    server {
    listen 80;
    listen [::]:80;

          root /var/www/html;
          index index.html index.htm index.nginx-debian.html;

          server_name example.com www.example.com;

          location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
          }

    }

e) Make sure you replace example.com and www.example.com with your URLs.
f) sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/ (create symbolic link)
g) To avoid a hash bucket memory problem in the future when we add additional applications, we need to adjust a single line in the /etc/nginx/nginx.conf file. - sudo nano /etc/nginx/nginx.conf (open config)
In that file, find a commented out line that reads # server_names_hash_bucket_size 64; and remove the comment # symbol to uncomment the line:
http {
. . .
server_names_hash_bucket_size 64;
. . .
}
h) sudo nginx -t (check syntax errors)
i) sudo systemctl restart nginx (restart nginx)

14. Configure HTTPS/SSL Encryption
    a) \***\*DEPRECATED\*\*** sudo add-apt-repository ppa:certbot/certbot (install certbot)
    use instead: snap install certbot --classic
    b) sudo apt-get update -y (update package list)
    c) \***\*DEPRECATED\*\*** sudo apt install python-certbot-nginx (install certbot)
    use instead: sudo apt-get install -y python3-certbot-nginx

15. Update Firewall To Allow HTTPS
    a) sudo ufw allow 'Nginx Full'
    b) sudo ufw delete allow 'Nginx HTTP'

16. Obtain SSL Certificates
    a) sudo certbot --nginx -d example.com -d www.example.com
    b) sudo certbot renew --dry-run (test)

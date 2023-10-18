# FRACAS system deployment

A prototype [deployed website](http://54.253.142.8/) using the following deployment tutorial (not always available).

> <font color="red">**Important note**</font>  
> The following deployment tutorial is concluded based on the demonstration of the project. Additional security suggestions are provided as quoted notes in related steps for the prodction deployment.

Server machine configuration

> Server machine  
> A server machine is used to host the backend server and the web server which communicates with the backend server and serves FRACAS website pages. A local machine, a local virtual machine, or a cloud server can be chosen as long as it can be accessed using a domain name or an IP address by the target users.

<details>
<summary>Creation of an AWS EC2 server machine</summary>

### Creation of an AWS EC2 server machine

A valid Ubuntu server machine can be created as an AWS EC2 instance. This involves the following steps:

1. **Create an AWS Account**:

   - Go to the [AWS website](https://aws.amazon.com/).
   - Click on the "Create an AWS Account" button.
   - Follow the on-screen instructions to set up your AWS account.

2. **Sign in to AWS Console**:

   - Sign in to the AWS Management Console using your newly created credentials.

3. **Navigate to the EC2 Dashboard**:

   - Search for "EC2" in the services search bar, and click on "EC2" under the Compute section in the AWS Management Console.

4. **Launch an EC2 Instance**:

   - Click the "Launch Instance" button to start creating a new EC2 instance.

5. **Name the EC2 instance**:

   - Enter a proper name to identify the server machien.

6. **Choose an Amazon Machine Image (AMI)**:

   - In Quick Start, select `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type`, which is available for Free tier. For architecture, select 64-bit (x86)

7. **Choose an Instance Type**:

   - Select the `t2.micro`, which is available for Free tier.

8. **Configure Key Pair**:

   - Create a new key pair or use an existing key pair for server access.
   - For the creation of a new key pair, please refer to the official [Key pair creation guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html).

   > <font color="red">**Important note**</font>  
   > The security key file should always be kept securely.

9. **Configure Network Settings**:

   - Create a new security group or use an existing security group for access control.
   - For the creation of a new security group in place, select `Allow SSH taffic from Anywhere` and `Allow HTTP traffic from the internet`

10. **Add Storage**:

    - Use gp2 or gp3 general purpose SSD. The free tier supports up to 30 GB of EBS General Purpose (SSD). The storage size should be at least 8 GB.

11. **Launch the Instance**:

    - Click the "Launch" button to create and start your EC2 instance.

Remember to monitor and manage your instances to avoid unnecessary charges. The running and

</details>

<details>
<summary>Server machine connection</summary>

### Server machine connection

1. **Find connection details**
   - Find the created EC2 instance in AWS EC2 dashboard, then enter the instance summary page by clicking on its Instance ID (which looks like i-xxxxxxxxxxx).
   - Click `Actions - Connect` to enter the connection page, take note of its Public IP.
   - Click SSH client for the connection details, take note of its Public DNS, which looks like `ec2-xxx...compute.amazonaws.com`.
2. **Connect to the server machine**
   - Use the connection details and the private key selected in the EC2 creation step to connect to the EC2 instance using SSH.
   - Suppose that an SSH client like OpenSSH has been configured on your machine and can be called using `ssh`. Suppose that your key file's name is `your-private-key.pem` and your EC2's Public DNS is your-EC2-Pubic-DNS, you can connect to your server using:
   ```bash
   ssh -i "your-private-key.pem" ubuntu@your-EC2-Pubic-DNS
   ```
   - <font color="green">**Developer tips:**</font> On Windows, an external application MobaXterm can be used to manage multiple SSH connection like tabs.
     - Create a new session, select SSH, then fill your EC2's Public DNS in the `Remote host` blank, and Specify username as `ubuntu`
     - Click on Advanced SSH settings, tick `Use private key` and select the key file located on your local machine.
     - Save settings, then double click it in the bookmark panel on the left to start an SSH session. Multiple sessions can be manged as tabs at ease.

</details>

<details>
<summary>Server machine configuration and website deployment</summary>

> <font color="green">**Developer note**</font>  
> During the server machine configuration, if there is any error indicating that a package is missing, normally it can be resolved by installing the missing package using `apt`.

<details>
<summary>Server machine preparation</summary>

### Server machine preparation

1. **Connect to server machine**

   - Please refer to the Server machine connection section.

2. **Update and upgrade packages**
   - Run `sudo apt update` to update package list and then run `sudo apt upgrade` to upgrade pacakges. Enter Y and press enter again to confirm.
   - A "Pending kernal upgrade" menu might pop up. Press Tab key to move the cursor to Ok and press enter to confirm.

</details>

<details>
<summary>Backend deployment</summary>

### Backend deployment

1. **Initialise and activate Python virtual environment\***

   - Change to the directory where the Python virtual environment. For example, `~` (`/home/ubuntu`):

   ```bash
   cd ~
   ```

   - Install Python venv package

   ```bash
   sudo apt install python3-venv
   ```

   - Create a virtual environment in `venv` directory:

   ```bash
   python3 -m venv venv
   ```

   - Activate the created virtual environment. The text (venv) will be displayed to the left of SSH user to indicate that the virtual environment is activated successfully.

   ```bash
   source venv/bin/activate
   ```

2. **Retrieve the backend files**

   - Change to the directory where the backend server files are stored. For example, `~` (`/home/ubuntu`):

   ```bash
   cd ~
   ```

   - Clone the repository.

   ```bash
   git clone https://github.com/uwasystemhealth/FRACAS_Team1
   ```

   - Enter the backend folder, then switch to the `backend` branch.

   ```bash
   cd FRACAS_Team1/backend
   ```

   ```bash
   git checkout backend
   ```

3. **Install required packages**
   - In the activated virtual environment and in the backend directory, install the required packages:
   ```bash
   pip3 install -r requirements.txt
   ```
4. **Configure Django backend settings**
   - Modify `backend/fracas/settings.py` with a text editor to add the server's public IP to `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`. Assume that the your server's public ip is `your.server.public.ip` (like 1.2.3.4), then the modified file should look like (only the lines to be modified are included, please use search function to locate where the lines are. ):
   ```python
   ALLOWED_HOSTS = ["localhost:3000", "1.0.0.127.in-addr.arpa", "127.0.0.1", "your.server.public.ip"]
   CORS_ALLOWED_ORIGINS = [
   "http://your.server.public.ip",
   "http://your.server.public.ip:80",
   "http://localhost",
   "http://localhost:3000",
   "http://127.0.0.1",
   "http://0.0.0.0",
   ]
   CSRF_TRUSTED_ORIGINS = ["http://your.server.public.ip"]
   ```
5. **Configure .env for email**

   - Create a file called `.env` in the `backend` folder. For example, run `nano ~/FRACAS_Team1/backend/.env` to create and edit at the same time.
   - Fill in the email details:

   ```
   DJANGO_EMAIL_HOST='your.email.host.com'

   DJANGO_EMAIL_HOST_USER='your.email.host.com'

   DJANGO_EMAIL_HOST_PASSWORD='your_email_host_password'
   ```

   - Note: a tip for using gmail can be found [here](https://support.google.com/mail/answer/185833?hl=en), use the created app password as the DJANGO_EMAIL_HOST_PASSWORD instead of your gmail account password.

6. **(Optional) Use a cloud database**

   - By default, the backend will create a SQL database, which can be exported easily. An [external tutorial](https://coderwall.com/p/mvsoyg/django-dumpdata-and-loaddata) can be useful.
   - It is possible to specify a cloud database.
   - A PostgreSQL cloud database can be created using AWS RDS. Please refer to [the official tutorial](https://aws.amazon.com/getting-started/hands-on/create-connect-postgresql-db/) to create a new PostgreSQL database.
   - Install a package for communicating with the postgres database:

   ```bash
   pip install psycopg2-binary
   ```

   - Make sure that the database is accessible from the server machine. This could be created and managed using the "Connected compute resources" functionality in the AWS RDS panel.
   - Modify the `DATABASES` in `backend/fracas/settings.py` with a text editor to read the database details from `.env` (other parts are omitted):

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql_psycopg2',
           'NAME': os.getenv("DB_NAME"),
           'USER': os.getenv("DB_USER"),
           'PASSWORD': os.getenv("DB_PASSWORD"),
           'HOST': os.getenv("DB_HOST"),
           'PORT': '5432',
       }
   }
   ```

   - Then, modify the `.env` file to add the connection details to your cloud database.

   ```
   DB_HOST="your.database.host.address.rds.amazonaws.com"

   DB_NAME="postgres"

   DB_USER="YOUR_USER_NAME"

   DB_PASSWORD="YOUR_PASSWORD"
   ```

7. **Database migration**

   > <font color="red">**Important note**</font>  
   > Before commencing this section for the first time, please make sure that the used database does not contain existing data.  
   > For the cloud postgres database, please make sure that the public schema is cleaned. It is recommended that the public schema does not contain any existing table to avoid any initilisation error.  
   > Related SQL statements: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`

   - Make sure that your virtual environment is activated. Change to the backend directory.
   - Execute the following 2 commands one by one:

   ```bash
   python3 manage.py makemigrations
   python3 manage.py makemigrations api
   ```

   - Execute the following command to apply migrations.

   ```bash
   python3 manage.py migrate
   ```

   - <font color="green">**Developer tips:**</font> If changes are to be made to the Django backend data models, please repeat the 2 steps above again after changes to apply and automatically handle changes while preserving the integrity of existing data.

8. **Create superuser**

   - An initial superuser should be created as the very first admin. Execute the following command and provide account creation information accordingly.

   ```bash
   python3 manage.py createsuperuser
   ```

9. **Collect static files**

   - Create a site folder:

   ```bash
   sudo mkdir /var/www/fracas
   ```

   - Collect static files and copy them to the created site folder by running:

   ```bash
   python manage.py collectstatic
   sudo cp -r static/* /var/www/fracas/static/
   ```

10. **Run server**

    - To run the backend server, use the following command:

    ```bash
    python3 manage.py runserver
    ```

    - If you'd like to run the backend server in the background, which lets you to keep the backend server running after your SSH session is terminated, use the following command instead.

    ```bash
    nohup python3 manage.py runserver &
    ```

11. **Stop server**
    - If the backend server is running in the foreground, press contrl+C to terminate it.
    - If the backend server is running in the background, find its process ID using `ps aux | grep manage.py`, then kill it using `kill PID`.

</details>

<details>
<summary>Frontend deployment</summary>

### Frontend deployment

1. **Configure node environment**

   - Install nvm (see this [external tutorial](https://tecadmin.net/how-to-install-nvm-on-ubuntu-22-04/))

   ```bash
   sudo apt install curl
   curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
   ```

   - Install and use node 18.18.2

   ```bash
   nvm install 18.18.2
   nvm use 18.18.2
   ```

2. **Retrieve the frontend files**
   - Change to a empty directory, for example, create a folder called frontend:
   ```bash
   mkdir ~/frontend
   cd ~/frontend
   ```
   - Clone the repository.
   ```bash
   git clone https://github.com/uwasystemhealth/FRACAS_Team1
   ```
3. **Build frontend site**

   - Enter the frontend directory:

   ```bash
   cd FRACAS_Team1/fracas-ui
   ```

   - Modify the API entry to the IP address of the server's public IP. Use `nano` or any other editor to edit `fracas-ui/src/api.js` to modify the following lines:

   ```js
   export const BASE_URL = "http://your.server.public.ip:80/api";
   export const BASE_URL_NEW = "http://your.server.public.ip:80";
   ```

   - Install packages using npm

   ```bash
   npm install
   ```

   - Build website. The files of the built site will be created under `/fracas-ui/build`.

   ```bash
   npm run build
   ```

   - <font color="green">**Known issue**</font> If an error message "node-sass not supported" is displayed when running `npm run build`, then run the following commands to replace it with `sass` and build site again:

   ```bash
   npm uninstall node-sass
   npm install sass
   npm run build
   ```

4. **Deploy built frontend site**
   - Copy the built site files into the site folder created in the backend deployment:
   ```bash
   sudo cp -r build/* /var/www/fracas/
   ```

</details>

<details>
<summary>Webserver configuration</summary>

### Webserver configuration

1. **Install Nginx**
   - Run `sudo apt install nginx` to install nginx to the server machine.
2. **Configure Nginx**

   - Run `sudo nano /etc/nginx/sites-available/default` to edit the default config with `nano`. Other text editors can also be used. The content of `default` should be configured to the content below (or copy the `default` template). **Note** replace `your.server.public.ip` with the public ip of your server machine.

   ```
   server {
       listen 80;
       server_name your.server.public.ip;

       location /api/ {
           proxy_set_header X-Forwarded-Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_pass http://127.0.0.1:8000;
       }
       location /auth/ {
           proxy_set_header X-Forwarded-Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_pass http://127.0.0.1:8000;
       }

       location /static/ {
           alias /var/www/fracas/static/;
       }

       location / {
           alias /var/www/fracas/;
           try_files $uri $uri/ /index.html;
       }

       location /admin/ {
           proxy_set_header X-Forwarded-Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_pass http://127.0.0.1:8000; # Proxy to Django admin
       }
   }
   ```

3. **Apply changes**
   - Reload the nginx service to apply changes to the file.
   ```bash
   sudo systemctl reload nginx
   ```

> <font color="red">**Important Security Note**</font>  
> HTTP connection is not secured and should be replaced with appropriate HTTPS protection. HTTPS is usualy avaialbe for a domain name rather than a public IP used in this sample tutorial. Therefore, when the system is deployed for production, the connection should be secured either with HTTPS or VPN for encryption of data in transmission.

</details>

</details>

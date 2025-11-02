BlueLogic Digital - EC2 Deployment Package
=========================================

Files included:
- index.html        : Main static website file
- deploy.sh         : Script to deploy site on an EC2 instance (installs nginx and copies files)
- README.md         : This file

How to deploy on an EC2 instance (Ubuntu / Amazon Linux):
1. Launch an EC2 instance (Ubuntu 20.04 / 22.04 or Amazon Linux 2).
2. Ensure the Security Group allows inbound HTTP (port 80) and SSH (port 22).
3. SSH into the instance:
   ssh -i your-key.pem ubuntu@<PUBLIC_IP>   (user 'ec2-user' for Amazon Linux)
4. Upload the package and extract to home folder or directly create ~/bluelog_site containing index.html.
   Example (from local machine):
     scp -i your-key.pem bluelogic_ec2_deploy.zip ubuntu@<PUBLIC_IP>:/home/ubuntu/
     ssh -i your-key.pem ubuntu@<PUBLIC_IP>
     unzip bluelogic_ec2_deploy.zip -d ~/bluelog_site_upload
     mkdir -p ~/bluelog_site && cp -r ~/bluelog_site_upload/* ~/bluelog_site/
5. Run deployment script:
     sudo bash deploy.sh
6. Open http://<PUBLIC_IP>/ in your browser.

Notes:
- This script installs nginx and copies site files to the default nginx site directory.
- On some distributions the nginx user/group may be 'nginx' instead of 'www-data'. The script uses a best-effort chown and will not fail if the user/group doesn't exist.
- If you have custom assets (images, css, js) keep them in the same folder as index.html before copying.

Security:
- Ensure only required ports are open in your Security Group.
- For production, consider serving via HTTPS (Let's Encrypt) and hardening nginx configuration.
# BlueLogic

# Continuous Deployment (CI/CD) to Your Server

This guide explains how to automatically deploy your application to your server every time you push code to GitHub using **GitHub Actions** and **PM2**.

---

## Architecture Overview

```
[ Your Local Machine ] 
       │  git push origin main
       ▼
 [ GitHub Repository ] 
       │  triggers GitHub Action (.github/workflows/deploy.yml)
       ▼  connects via SSH
   [ Your Server ]
       ├─ git pull
       ├─ npm install
       ├─ npx prisma generate && npx prisma db push
       ├─ npm run build
       └─ pm2 restart ugcexpert
```

---

## Step 1: One-Time Server Preparation (VPS / Ubuntu / Debian)

SSH into your server and install Node.js (v20+), Git, and PM2:

```bash
# 1. Update packages
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 3. Install PM2 process manager globally
sudo npm install -g pm2

# 4. Enable PM2 to auto-start on server reboots
pm2 startup
# (Run the command that PM2 prints in the terminal)
```

---

## Step 2: Clone the Project to Your Server

On your server, create the app directory and clone your repository:

```bash
# 1. Create app folder (e.g. in /var/www)
sudo mkdir -p /var/www/ugcexpert
sudo chown -R $USER:$USER /var/www/ugcexpert

# 2. Clone your repository
git clone <YOUR_GITHUB_REPO_URL> /var/www/ugcexpert
cd /var/www/ugcexpert

# 3. Install dependencies & initialize database
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# 4. Build application
npm run build

# 5. Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
```

Verify it's running:
```bash
pm2 status
curl http://localhost:3000/api/status
```

---

## Step 3: Setup GitHub Secrets for Auto-Deployment

To let GitHub push updates to your server automatically:

1. On your server, generate an SSH deployment key (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy -N ""
   cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. Copy the **private key**:
   ```bash
   cat ~/.ssh/github_deploy
   ```

3. Go to your GitHub Repository:
   - **Settings** → **Secrets and variables** → **Actions** → Click **New repository secret**.
   - Add the following secrets:

   | Secret Name | Description | Example Value |
   |-------------|-------------|---------------|
   | `SERVER_HOST` | Your server's public IP address or domain | `194.87.12.34` or `app.example.kz` |
   | `SERVER_USER` | The Linux user on your server | `root` or `ubuntu` |
   | `SERVER_SSH_KEY` | The private SSH key from `cat ~/.ssh/github_deploy` | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
   | `SERVER_PORT` | SSH port (default: 22) | `22` |
   | `SERVER_APP_DIR` | Absolute path to cloned repo on server | `/var/www/ugcexpert` |

---

## Step 4: Test Automatic Deployment!

Now, whenever you commit and push to GitHub:

```bash
git add .
git commit -m "update feature"
git push origin main
```

1. GitHub will automatically trigger the **Deploy to Server** workflow (visible under the **Actions** tab in GitHub).
2. It SSHs into your server, pulls the new code, updates database migrations, builds the bundle, and restarts the PM2 process with zero downtime.

---

## Step 5: (Optional) Nginx Reverse Proxy & Free SSL

To make your app accessible on standard ports (80 / 443) with a custom domain and HTTPS:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/ugcexpert
```

Paste this configuration (replace `yourdomain.com` with your real domain or server IP):

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/ugcexpert /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Install free SSL certificate:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

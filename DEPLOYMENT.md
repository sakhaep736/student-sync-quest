# Deployment Guide for Linux Server

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Port 8080 available (or modify in server-config.json)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application
```bash
npm run build
```

### 3. Run the Application

#### Option A: Development Mode (with hot reload)
```bash
npm run dev
```
Access at: `http://your-server-ip:8080`

#### Option B: Production Mode (recommended)
```bash
npm run build
npm run preview
```
Access at: `http://your-server-ip:4173`

### 4. Run as Background Service (Production)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/student-jobs-app.service
```

Add this configuration:
```ini
[Unit]
Description=Student Jobs Application
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/npm run preview
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable student-jobs-app
sudo systemctl start student-jobs-app
sudo systemctl status student-jobs-app
```

### 5. Configure Firewall (if needed)
```bash
# For development port
sudo ufw allow 8080/tcp

# For production port
sudo ufw allow 4173/tcp
```

## Environment Configuration

The application uses these Supabase credentials:
- Project URL: `https://actyrrefryycuvptecew.supabase.co`
- Anon Key: (already configured in code)

## Port Configuration

Edit `server-config.json` to change ports:
- `server.port`: Development mode port (default: 8080)
- `preview.port`: Production mode port (default: 4173)

## Using Nginx as Reverse Proxy (Recommended)

Create nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/student-jobs-app
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/student-jobs-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Monitoring & Logs

View application logs:
```bash
# If using systemd service
sudo journalctl -u student-jobs-app -f

# If running directly
npm run dev > app.log 2>&1 &
tail -f app.log
```

## Troubleshooting

### Port already in use
```bash
# Find process using port
sudo lsof -i :8080
# Kill the process
sudo kill -9 <PID>
```

### Permission denied
```bash
# Run with sudo (not recommended for production)
sudo npm run dev
```

### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Quick Start Commands

```bash
# Clone/upload your project to server
cd /path/to/project

# Install and build
npm install
npm run build

# Run production server
npm run preview
```

Access your application at `http://your-server-ip:4173`

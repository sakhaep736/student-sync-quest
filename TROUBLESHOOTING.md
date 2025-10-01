# Troubleshooting Server Access

## Cannot Access Server from External IP

If you cannot access `http://YOUR_SERVER_IP:4173/` from your browser:

### 1. Check if the Application is Running

```bash
# Check if the process is running
ps aux | grep node

# Check if port 4173 is listening
sudo netstat -tlnp | grep 4173
# or
sudo ss -tlnp | grep 4173
```

### 2. Configure Firewall (MOST COMMON ISSUE)

**On Ubuntu/Debian with UFW:**
```bash
# Allow port 4173
sudo ufw allow 4173/tcp

# Reload firewall
sudo ufw reload

# Check firewall status
sudo ufw status
```

**On CentOS/RHEL with firewalld:**
```bash
# Allow port 4173
sudo firewall-cmd --permanent --add-port=4173/tcp

# Reload firewall
sudo firewall-cmd --reload

# Check firewall status
sudo firewall-cmd --list-all
```

### 3. Cloud Provider Security Groups (AWS, Azure, GCP)

If you're using a cloud provider:

**AWS EC2:**
1. Go to EC2 Dashboard → Security Groups
2. Select your instance's security group
3. Add Inbound Rule:
   - Type: Custom TCP
   - Port: 4173
   - Source: 0.0.0.0/0 (or your IP range)

**Azure:**
1. Go to Virtual Machine → Networking
2. Add inbound port rule for port 4173

**Google Cloud:**
1. Go to VPC Network → Firewall
2. Create firewall rule allowing TCP port 4173

### 4. Verify Server is Listening on All Interfaces

```bash
# Check what address the server is listening on
sudo netstat -tlnp | grep 4173

# Should show: 0.0.0.0:4173 (not 127.0.0.1:4173)
```

If it shows `127.0.0.1:4173`, the server is only listening locally. This should be fixed by the updated configuration.

### 5. Test Local Connection First

```bash
# From the server itself, test if it responds
curl http://localhost:4173

# If this works, the issue is networking/firewall
# If this doesn't work, the application has an issue
```

### 6. Check Application Logs

```bash
# If running as a service
sudo journalctl -u student-jobs -f

# If running in terminal, check the output
# Look for errors or warnings
```

### 7. Rebuild and Restart

```bash
# Stop the current process (Ctrl+C if running in terminal)

# Rebuild everything
rm -rf dist node_modules
npm install
npm run build

# Restart the server
./start-server.sh
```

## Common Error Messages

### "EADDRINUSE: address already in use"
Port 4173 is already being used by another process.

**Solution:**
```bash
# Find the process using port 4173
sudo lsof -i :4173

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Or kill all node processes
sudo pkill -9 node

# Then restart
./start-server.sh
```

### "Permission denied" for port access
Ports below 1024 require root privileges (not applicable to 4173).

### Cannot find module errors
Dependencies not installed properly.

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
./start-server.sh
```

## Quick Diagnostic Script

Create and run this script to diagnose issues:

```bash
#!/bin/bash
echo "=== Server Diagnostic ==="
echo ""
echo "1. Node.js version:"
node --version
echo ""
echo "2. Port 4173 status:"
sudo netstat -tlnp | grep 4173
echo ""
echo "3. Firewall status:"
sudo ufw status | grep 4173
echo ""
echo "4. Application process:"
ps aux | grep "npm run preview" | grep -v grep
echo ""
echo "5. Testing local connection:"
curl -I http://localhost:4173 2>&1 | head -5
```

Save as `diagnose.sh`, make executable with `chmod +x diagnose.sh`, and run `./diagnose.sh`.

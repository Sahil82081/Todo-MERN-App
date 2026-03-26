🚀 Kubernetes Deployment (MERN App)

This branch (kubernetes) contains all the Kubernetes manifests and deployment configurations for running a MERN stack application on:

🐳 KIND (Kubernetes in Docker) on EC2
🔄 CI/CD pipeline using GitHub Actions
📌 Overview

This project follows production-style architecture and best practices:

✅ Backend is private (ClusterIP)
✅ Frontend is accessible externally (via port-forward)
✅ Nginx acts as a reverse proxy
✅ MongoDB runs as an internal service
✅ Clear separation of frontend, backend, and database
🏗️ Architecture
Browser
   ↓
EC2 Public IP
   ↓
Frontend (Port-forward)
   ↓  (/api handled by Nginx)
Backend Service (ClusterIP)
   ↓
MongoDB Service (ClusterIP)
📂 Project Structure
k8s/
 ├── frontend-deployment.yaml
 ├── frontend-service.yaml
 ├── backend-deployment.yaml
 ├── backend-service.yaml
 ├── mongo-deployment.yaml
 ├── mongo-service.yaml
 ├── nginx.conf
⚙️ Deployment Steps (EC2 + KIND)
1️⃣ Connect to EC2
ssh ubuntu@<EC2-PUBLIC-IP>
2️⃣ Clone Repository
git clone -b kubernetes https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
3️⃣ Create KIND Cluster
kind create cluster
4️⃣ Apply Kubernetes Manifests
kubectl apply -f k8s/
🌐 Access Application

KIND runs inside Docker, so NodePort is not directly accessible externally.

Use port-forward:
kubectl port-forward service/frontend-service 3000:80 --address 0.0.0.0

Open in browser:

http://<EC2-IP>:3000
🔐 Core Concept
Frontend API Call
axios.get("/api/todos");
Internal Flow
/api requests go to Nginx
Nginx forwards them to backend service
/api → backend-service:5000

👉 Backend is not exposed publicly

🌐 Nginx Configuration
server {
  listen 80;

  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri /index.html;
  }

  location /api/ {
    proxy_pass http://backend-service:5000;
  }
}
⚠️ Important Notes
❌ Do NOT add trailing / in proxy_pass
✅ Always use /api in frontend requests
✅ Kubernetes resolves backend-service using internal DNS
🐳 Frontend Dockerfile
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
🔄 CI/CD Pipeline (GitHub Actions)
Workflow
Push code to GitHub
Build Docker images
Push images to DockerHub
Deploy to Kubernetes
on:
  push:
    branches:
      - main
      - kubernetes
🔑 Environment Variables (Backend)

Set these in your Kubernetes deployment:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-todos
PORT=5000

💡 Recommended:

Use Kubernetes Secrets instead of hardcoding credentials
🧪 Debugging
Check resources
kubectl get pods
kubectl get svc
View logs
kubectl logs <pod-name>
Access container
kubectl exec -it <pod-name> -- sh
Test backend internally
curl http://backend-service:5000/api/todos
❗ Common Issues
Issue	Fix
ERR_NAME_NOT_RESOLVED	Use /api instead of service URL
404 error	Fix Nginx proxy_pass
NodePort not working	Use port-forward (KIND)
Mongo not connecting	Use mongo-service
📚 Key Learnings
Kubernetes networking (ClusterIP vs NodePort)
Internal DNS (service-name)
Reverse proxy using Nginx
CI/CD with GitHub Actions
Running Kubernetes on EC2 using KIND
🚀 Future Improvements
Add Ingress Controller
Enable HTTPS (TLS)
Use Helm Charts
Deploy on AWS EKS
👨‍💻 Author

Sahil Kumbharkar

⭐ Support

If you found this project helpful, give it a ⭐ on GitHub!
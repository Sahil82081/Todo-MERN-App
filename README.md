# 🚀 Kubernetes Deployment (MERN App)

This branch (`kubernetes`) contains all the **Kubernetes manifests and deployment configurations** for running a MERN stack application on **Kubernetes (KIND on EC2)** with a **CI/CD pipeline using GitHub Actions**.

---

## 📌 Overview

This setup follows **production best practices**:

* ✅ Backend is **private** (ClusterIP)
* ✅ Frontend is **exposed** (NodePort / Port-forward)
* ✅ Nginx is used as a **reverse proxy**
* ✅ MongoDB runs as an **internal service**

---

## 🏗️ Architecture

```
Browser
   ↓
EC2 Public IP
   ↓
Frontend (NodePort / Port-forward)
   ↓  (/api via Nginx)
Backend Service (ClusterIP)
   ↓
MongoDB Service (ClusterIP)
```

---

## 📂 Project Structure

```
k8s/
 ├── frontend-deployment.yaml
 ├── frontend-service.yaml
 ├── backend-deployment.yaml
 ├── backend-service.yaml
 ├── mongo-deployment.yaml
 ├── mongo-service.yaml
 ├── nginx.conf
```

---

## ⚙️ Deployment Steps (EC2 + KIND)

### 1️⃣ Connect to EC2

```bash
ssh ubuntu@<EC2-PUBLIC-IP>
```

### 2️⃣ Clone this branch

```bash
git clone -b kubernetes https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 3️⃣ Create Kubernetes cluster

```bash
kind create cluster
```

### 4️⃣ Apply all manifests

```bash
kubectl apply -f k8s/
```

---

## 🌐 Access Application

Since KIND runs inside Docker, NodePort is not directly exposed.

### Use port-forward:

```bash
kubectl port-forward service/frontend-service 3000:80 --address 0.0.0.0
```

Open:

```
http://<EC2-IP>:3000
```

---

## 🔐 Key Concept

* Frontend calls API using:

  ```js
  axios.get("/api/todos");
  ```
* Nginx internally routes:

  ```
  backend-service:5000
  ```
* Backend is **never exposed publicly**

---

## 🌐 Nginx Configuration

```nginx
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
```

### ⚠️ Important

* ❌ Do NOT use trailing `/` in `proxy_pass`
* ✅ Always use `/api` in frontend

---

## 🐳 Docker (Frontend)

```Dockerfile
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow

1. Push code to GitHub
2. Build Docker images
3. Push to DockerHub
4. Deploy to Kubernetes

```yaml
on:
  push:
    branches:
      - main
      - kubernetes
```

---

## 🧪 Debugging

```bash
kubectl get pods
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- sh
```

### Test backend from frontend pod:

```bash
curl http://backend-service:5000/api/todos
```

---

## ❗ Common Issues

| Issue                 | Fix                                   |
| --------------------- | ------------------------------------- |
| ERR_NAME_NOT_RESOLVED | Use `/api` instead of backend-service |
| 404 error             | Fix Nginx `proxy_pass`                |
| NodePort not working  | Use port-forward (KIND)               |
| Mongo not connecting  | Use `mongo-service`                   |

---

## 📚 Learnings

* Kubernetes networking (ClusterIP vs NodePort)
* Internal DNS (`service-name`)
* Reverse proxy with Nginx
* CI/CD automation using GitHub Actions
* Running Kubernetes on EC2 using KIND

---

## 🚀 Future Improvements

* Add Ingress Controller
* Enable HTTPS (TLS)
* Use Helm charts
* Deploy on AWS EKS

---

## 👨‍💻 Author

**Sahil Kumbharkar**

---

## ⭐ Support

If you found this project helpful, give it a ⭐ on GitHub!

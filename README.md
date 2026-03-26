# 🚀 MERN App Deployment with Kubernetes & CI/CD

This project demonstrates a complete **MERN stack deployment** using **Kubernetes (KIND)** along with a **CI/CD pipeline using GitHub Actions**. It also includes **Nginx reverse proxy configuration** to securely connect frontend and backend services.

---

## 📌 Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Containerization:** Docker
* **Orchestration:** Kubernetes (KIND)
* **CI/CD:** GitHub Actions
* **Web Server:** Nginx (Reverse Proxy)

---

## 🏗️ Architecture

```
Browser
   ↓
Frontend (NodePort / Nginx)
   ↓  (/api proxy)
Backend Service (ClusterIP)
   ↓
MongoDB Service (ClusterIP)
```

---

## ⚙️ Kubernetes Setup

### Services Used

| Service          | Type      | Purpose          |
| ---------------- | --------- | ---------------- |
| frontend-service | NodePort  | Exposes frontend |
| backend-service  | ClusterIP | Internal API     |
| mongo-service    | ClusterIP | Database         |

---

## 🔐 Key Concept

* Backend is **NOT exposed publicly**
* Frontend communicates with backend using:

  ```
  /api
  ```
* Nginx handles internal routing to:

  ```
  backend-service:5000
  ```

---

## 🌐 Nginx Configuration

We modified the default Nginx configuration to enable reverse proxy:

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

* Do **NOT** use trailing `/` in `proxy_pass`
* React should call APIs like:

  ```js
  axios.get("/api/todos");
  ```

---

## 🐳 Docker Setup

### Frontend Dockerfile

```Dockerfile
FROM nginx:alpine

COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Workflow Steps

1. Trigger on push to `main`
2. Build Docker images
3. Push images to DockerHub
4. Deploy to Kubernetes

### Example Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build Docker images
        run: |
          docker build -t <your-dockerhub>/frontend ./frontend
          docker build -t <your-dockerhub>/backend ./backend

      - name: Push to DockerHub
        run: |
          docker push <your-dockerhub>/frontend
          docker push <your-dockerhub>/backend

      - name: Deploy to Kubernetes
        run: kubectl apply -f k8s/
```

---

## 🚀 Running the Project

### 1️⃣ Create KIND cluster

```bash
kind create cluster
```

### 2️⃣ Apply Kubernetes configs

```bash
kubectl apply -f k8s/
```

### 3️⃣ Access frontend

Using port-forward:

```bash
kubectl port-forward service/frontend-service 3000:80 --address 0.0.0.0
```

Open:

```
http://<EC2-IP>:3000
```

---

## 🧪 Debugging Tips

### Check pods

```bash
kubectl get pods
```

### Check logs

```bash
kubectl logs <pod-name>
```

### Test backend internally

```bash
kubectl exec -it <frontend-pod> -- sh
curl http://backend-service:5000/api/todos
```

---

## ❗ Common Issues & Fixes

| Issue                   | Solution                                          |
| ----------------------- | ------------------------------------------------- |
| `ERR_NAME_NOT_RESOLVED` | Use `/api` instead of backend-service in frontend |
| 404 error               | Fix Nginx `proxy_pass` (remove trailing `/`)      |
| NodePort not working    | Use port-forward in KIND                          |
| Mongo not connecting    | Use `mongo-service` hostname                      |

---

## 📚 Learnings

* Difference between **NodePort vs ClusterIP**
* Why frontend should not directly call backend service
* Importance of **reverse proxy (Nginx)**
* CI/CD automation using GitHub Actions
* Kubernetes internal DNS (`service-name`)

---

## 📌 Future Improvements

* Add **Ingress Controller**
* Setup **HTTPS with TLS**
* Use **Helm charts**
* Deploy on **EKS / GKE**

---

## 👨‍💻 Author

**Sahil Kumbharkar**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!


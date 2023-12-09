#!/bin/bash

cat >/tmp/init-config.yaml <<EOF
apiVersion: kubeadm.k8s.io/v1beta3
kind: InitConfiguration
bootstrapTokens:
  - token: "${K8S_TOKEN}"
    ttl: "0"
    groups:
      - system:bootstrappers:kubeadm:default-node-token
---
apiVersion: kubeadm.k8s.io/v1beta3
kind: ClusterConfiguration
networking:
  podSubnet: 192.168.0.0/16
controlPlaneEndpoint: "${MST_FIXED_IP}:6443"
apiServer:
  certSANs:
    - "${MST_FIXED_IP}"
  timeoutForControlPlane: 4m0s
EOF

sudo kubeadm init --config=/tmp/init-config.yaml --ignore-preflight-errors=NumCPU

mkdir -p $HOME/.kube
sudo rm -f $HOME/.kube/config
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
sudo cp -i /etc/kubernetes/admin.conf ./

sudo cp -i /etc/kubernetes/admin.conf /home/ubuntu
sudo chmod 777 /home/ubuntu/admin.conf

curl https://raw.githubusercontent.com/projectcalico/calico/v3.25.1/manifests/calico.yaml -O
kubectl apply -f calico.yaml

sudo apt install helm -y

# 설정

- yum 업데이트
yum update

- docker 설치
sudo yum install docker

- os 재부팅 되어도 도커 자동 재실행
sudo systemctl enable docker.service
sudo systemctl enable containerd.service

- docker-compose 다운로드
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

- docker-compose 실행권한설정
sudo chmod +x /usr/local/bin/docker-compose

- docker-compose 설치 확인
sudo docker-compose --version



# wireguard 설정

1. wireguard 설정
-- 외부 트래픽 사용 되도록(인터넷)
echo 'net.ipv4.ip_forward=1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

2. iptable 관리 패키지 다운로드 
sudo yum install -y iptables-services

3. nat 설정
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE


4. nat 정보 세이브
sudo service iptables save


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


# linux ip 확인

0. 현재 라우팅 정보 확인
route -n

1. ec2 os에 ip routing outbound traffic 나가는 NIC
- /etc/sysconfig/network-scripts/ifcfg-eth0

2. dns 트래픽 조회
-  sudo tcpdump port 53

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

5. 제일 중요한 설정 *** 해당 도커 파일에서는 vpn server 에서는 환경정보 셋팅이 없기때문에 직접 수정해줘야한다.!! 근데 만약 도커를 stop or down을 할경우 초기화 되기 때문에 반드시 이 설정을 꼭 넣어줘야한다.!!!

- vpn server (Ec2 vpn server)에 도커가 위치한곳에서 sudo vim wg0.conf 열어서 수정할것

해당 정보는 AWS에 아웃바운드 리졸버 설정 입니다.(규칙 추가해야함)
DNS = 192.168.8.76


```conf
# xxx 는 인증키입니다.
# 여기는 server에서 설정
# Server
[Interface]
PrivateKey = xxxxxxxx
Address = 10.8.0.1/24
ListenPort = 51820
PreUp =
PostUp = iptables -t nat -A POSTROUTING -s 10.8.0.0/24 -o eth0 -j MASQUERADE; iptables -A INPUT -p udp -m udp --dport 51820 -j ACCEPT; iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT;
PreDown =
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# 여기에 추가 해줄것!!!
DNS = 192.168.8.76

# Client: test (xxx)
[Peer]
PublicKey = xxxx
PresharedKey = xxxx
AllowedIPs = 10.8.0.2/32

```
---- ##### -----

```conf
# client
[Interface]
PrivateKey = xxxx
Address = 10.8.0.2/24
DNS = 192.168.133.242, 192.168.15.45, 8.8.8.8, 1.1.1.1


[Peer]
PublicKey = xxxx
PresharedKey = xxxx
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 0
Endpoint = 43.202.26.173:51820

```

# 설정

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

Stonehill-server
================

This server provides a REST API interface to sensors connected to a Raspberry PI.


#Installation

```bash
git clone https://github.com/fredrikholmen/stonehill-server.git [folder]
```

### Install Node dependecies

```bash
cd [folder] && sudo npm install
```


# Other modules used

## DHT11 Sensor

Module to use DHT11 temperature and humidity sensor https://github.com/momenso/node-dht-sensor

```bash
sudo wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.50.tar.gz
tar zxvf bcm2835-1.50.tar.gz
cd bcm2835-1.50/
./configure
make
sudo make check
sudo make install
npm install node-dht-sensor
```
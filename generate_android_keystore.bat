@echo off
set /p "id=Enter KeyStore Name: "

keytool -genkey -v -keystore %id%.keystore -alias %id%-key-alias -keyalg RSA -keysize 2048 -validity 10000
pause
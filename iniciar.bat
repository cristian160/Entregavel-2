@echo off
cd /d "%~dp0"
where javac >nul 2>nul
if errorlevel 1 (
  echo JDK nao encontrado. Instale o JDK 21 e reabra o VS Code.
  pause
  exit /b 1
)
if not exist bin mkdir bin
javac -encoding UTF-8 -d bin Java\*.java
if errorlevel 1 (
  echo Falha na compilacao. Confira a mensagem acima.
  pause
  exit /b 1
)
echo Abra http://127.0.0.1:8080 no navegador.
java -cp bin Servidor
pause

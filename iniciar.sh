#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
mkdir -p bin
javac -encoding UTF-8 -d bin Java/*.java
exec java -cp bin Servidor

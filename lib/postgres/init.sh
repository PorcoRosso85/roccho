# このファイルでは、go言語環境とマイグレーション環境を構築します。
# https://zenn.dev/shiguredo/articles/sqlc-gen-typescript#%E3%83%9E%E3%82%A4%E3%82%B0%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AF%EF%BC%9F

# tty font colors
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
ORNAGE='\033[0;33m'
NC='\033[0m' # No Color

# install go
echo -e "${YELLOW}Installing go...${NC}"
devbox add go

# install sqlc
echo -e "${YELLOW}Installing sqlc...${NC}"
go install github.com/sqlc-dev/sqlc/cmd/sqlc@latest